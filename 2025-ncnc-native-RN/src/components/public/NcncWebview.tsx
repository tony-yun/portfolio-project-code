import { color } from '@doublenc-inc/nds-core'
import CookieManager from '@react-native-cookies/cookies'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useQueryClient } from '@tanstack/react-query'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  AppState,
  AppStateStatus,
  BackHandler,
  Linking,
  NativeEventSubscription,
  Platform,
  View,
  ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SendIntentAndroid from 'react-native-send-intent'
import WebView, { WebViewProps } from 'react-native-webview'
import {
  OnShouldStartLoadWithRequest,
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview/lib/WebViewTypes'
import useAuth from '../../hooks/useAuth'
import useBottomSheet from '../../hooks/useBottomSheet'
import useInAppBrowser from '../../hooks/useInAppBrowser'
import useMe from '../../hooks/useMe'
import useRewardNudge from '../../hooks/useRewardNudge'
import useToast from '../../hooks/useToast'
import {
  WebviewError,
  WebviewHttpError,
  handleError as globalError,
  recordError,
  recordLog,
} from '../../public/error-helper'
import { displayNotification } from '../../public/notification-helper'
import { Nullable } from '../../public/types/global.types'
import { MainStackScreenList } from '../../public/types/navigations.types'
import { handleMessage, postMessage } from '../../public/webview-helper'
import Loading from '../Loading'
import NotFound from './NotFound'

interface NcncWebviewProps {
  uri: string
  screenKey: 'Payment' | 'Event' | 'NiconPaySettings' | 'Trouble'
  route: RouteProp<MainStackScreenList>
  navigation: StackNavigationProp<MainStackScreenList>
  onFocus?: (webviewRef: React.RefObject<WebView<{}>>) => void
  defaultBackgroundColor?: string
  webviewStyle?: ViewStyle
  containerStyle?: ViewStyle
  webviewProps?: Partial<WebViewProps>
  headerShown?: boolean
}

interface DefaultStyle {
  flex: number
  backgroundColor: string
  height?: number
}

const NcncWebview = (props: NcncWebviewProps) => {
  const {
    uri,
    screenKey,
    route,
    navigation,
    onFocus,
    defaultBackgroundColor = color.gray.white,
    webviewStyle,
    containerStyle = {},
    webviewProps = {},
  } = props

  const { me, token } = useMe()
  const { logout } = useAuth()
  const { showBottomSheet: showBottomSheet } = useBottomSheet()
  const toast = useToast()
  const handleInAppBrowser = useInAppBrowser()
  const queryClient = useQueryClient()
  const { top: insetTop } = useSafeAreaInsets()
  const { displayRewardNudgeNotification } = useRewardNudge()

  const [backgroundColor, setBackgroundColor] = useState<string>(
    defaultBackgroundColor,
  )
  const [
    allowsBackForwardNavigationGestures,
    setAllowsBackForwardNavigationGestures,
  ] = useState<boolean>(false)
  const [webviewKey, setWebviewKey] = useState<number>(0)
  const [webviewHeight, setWebviewHeight] = useState<Nullable<number>>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const webViewRef = useRef<WebView>(null)
  const currentAppState = useRef<AppStateStatus>(AppState.currentState)
  const appStateSubscription = useRef<NativeEventSubscription>(null)
  const backHandlerMode = useRef<'NATIVE' | 'WEB'>('WEB')
  const beforeRemoveRef = useRef<'default' | 'custom'>('default')
  const canGoBackRef = useRef<boolean>(false)

  const isOpenableUrl = (scheme: string) => {
    const builtInSchemeList = ['mailto', 'tel', 'sms', 'http', 'https']

    return builtInSchemeList.includes(scheme)
  }

  const onShouldStartLoadWithRequest: OnShouldStartLoadWithRequest = (
    request,
  ) => {
    try {
      const { url } = request
      const [scheme] = url.split(':')

      recordLog(`[${screenKey}] onShouldStartLoadWithRequest`, { url })

      /**
       * @description about:blank 무시
       */
      if (url.startsWith('about:blank')) {
        return false
      }

      /**
       * @description 네이버페이 결제 확인 딥링크 실행시 인앱브라우저를 닫는 로직입니다.
       */
      if (url.includes('naver-pay/confirm')) {
        recordLog(
          `[${screenKey}] onShouldStartLoadWithRequest handle naver-pay/confirm`,
          { url },
        )

        handleInAppBrowser.close()

        return true
      }

      /**
       * @description Android intent 핸들링
       */
      if (Platform.OS === 'android' && scheme === 'intent') {
        recordLog(`[${screenKey}] onShouldStartLoadWithRequest handle intent`, {
          url,
        })

        SendIntentAndroid.openAppWithUri(url)

        return false
      }

      /**
       * @description Deep linking 핸들링
       */
      if (!isOpenableUrl(scheme)) {
        recordLog(
          `[${screenKey}] onShouldStartLoadWithRequest handle deep linking`,
          {
            url,
          },
        )

        if (scheme === 'naversearchapp') {
          //...

          return false
        }

        Linking.openURL(url).catch(() => {
          Alert.alert('앱 또는 페이지를 열 수 없습니다.')
        })

        return false
      }
      
      return true
    } catch (err) {
      recordError(err, `[${screenKey}] onShouldStartLoadWithRequest Error`)

      return false
    }
  }

  const wrapperStyle = useMemo(() => {
    const defaultStyle: DefaultStyle = {
      flex: 1,
      backgroundColor,
    }

    if (webviewHeight) {
      defaultStyle.height = webviewHeight
    }

    return Object.assign(defaultStyle, containerStyle)
  }, [backgroundColor, containerStyle, webviewHeight])

  const style = useMemo(() => {
    const defaultStyle = {
      backgroundColor,
    }

    return Object.assign(defaultStyle, webviewStyle)
  }, [backgroundColor, webviewStyle])

  useFocusEffect(
    useCallback(() => {
      const handleHardwareBackPress = () => {
        // ! 웹뷰에서 뒤로 가기가 가능할 때는 웹뷰에서 뒤로 가기
        if (backHandlerMode.current !== 'NATIVE' && canGoBackRef.current) {
          webViewRef.current?.goBack()
          setWebviewKey((prevKey) => prevKey + 1)

          return true
        }

        // ! 그 외에는 앱 내비게이션 기본 동작을 따름
        return false
      }

      BackHandler.addEventListener('hardwareBackPress', handleHardwareBackPress)

      return () =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          handleHardwareBackPress,
        )
    }, []),
  )

  // 포커싱 변화에 따라 로그인 시 토큰 전송
  useFocusEffect(
    useCallback(() => {
      const dataRes = {
        res: token,
      }

      postMessage(webViewRef, dataRes)

      onFocus?.(webViewRef)
    }, [token, onFocus]),
  )

  useEffect(() => {
    const beforeRemoveListener = navigation.addListener('beforeRemove', (e) => {
      if (beforeRemoveRef.current === 'custom') {
        e.preventDefault()

        postMessage(webViewRef, {
          eventName: 'beforeRemove',
          eventType: e.data.action.type,
          eventSource: screenKey,
        })
      }

      if (backHandlerMode.current !== 'NATIVE' && canGoBackRef.current) {
        e.preventDefault()

        webViewRef.current?.goBack()
      }
    })

    return beforeRemoveListener
  }, [navigation])

  useEffect(() => {
    const setupCookies = async () => {
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        if (Platform.OS === 'android') {
        // CookieManager 세팅
        }
      } catch (error) {
        globalError(error, '쿠키 세팅 중 에러가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    setupCookies()

    return () => {
      CookieManager.clearAll()
    }
  }, [token, uri])

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const gestureEnabled = !allowsBackForwardNavigationGestures

      navigation.setOptions({ gestureEnabled })
      navigation.getParent()?.setOptions({ gestureEnabled })
    }
  }, [navigation, allowsBackForwardNavigationGestures])

  // WebView 에러 처리: 일반 에러
  const handleError = (event: WebViewErrorEvent) => {
    const { nativeEvent, target } = event

    recordError(
      new WebviewError(screenKey, target, nativeEvent),
      `${screenKey} Webview Error`,
    )
  }

  // WebView 에러 처리: HTTP 에러
  const handleHttpError = (event: WebViewHttpErrorEvent) => {
    const { nativeEvent, target } = event

    recordError(
      new WebviewHttpError(screenKey, target, nativeEvent),
      `${screenKey} Webview Http Error`,
    )

    setTimeout(() => {
      toast.show({
        type: 'error',
        text1: '서버 연결 상태가 불안정합니다.',
        text2: '잠시 후 다시 시도해 주세요.',
      })
    }, 500)
  }

  const reloadPage = useCallback(() => {
    if (webViewRef.current) {
      webViewRef.current.reload()
    }
  }, [])

  // Web → Native 메시지 처리
  const onMessage = (message: WebViewMessageEvent) => {
    const {
      nativeEvent: { data },
    } = message

    const { type, option } = JSON.parse(data)

    switch (type) {
      case 'height':
        setWebviewHeight(option.height)
        break
      case 'background-color':
        setBackgroundColor(option)
        break
      case 'logout':
        logout()
        option?.callback()
        break
      case 'displayNotification':
        if (option.type === 'rewardNudge' && option.payload) {
          displayRewardNudgeNotification({
            title: option.payload.title,
            body: option.payload.body,
            eventProperties: option.payload.amplitudeEvent?.properties,
          })
        } else {
          displayNotification(option.payload)
        }
        break
      default:
        handleMessage(data, {
          navigation,
          token,
          me,
          webViewRef,
          setAllowsBackForwardNavigationGestures,
          currentAppState,
          appStateSubscription,
          backHandlerMode,
          route,
          showBottomSheet,
          insetTop,
          handleInAppBrowser,
          queryClient,
          beforeRemoveRef,
        })
    }
  }

  const onNavigationStateChange = (state: WebViewNavigation) => {
    canGoBackRef.current = state.canGoBack

    setAllowsBackForwardNavigationGestures(state.canGoBack)
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <View
      style={{
        ...wrapperStyle,
        paddingBottom: 0,
      }}
    >
      <WebView
        {...webviewProps}
        key={webviewKey}
        ref={webViewRef}
        style={style}
        source={{ uri }}
        startInLoadingState
        decelerationRate="normal"
        androidLayerType="hardware"
        onMessage={onMessage}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        incognito={false}
        onHttpError={handleHttpError}
        onError={handleError}
        renderLoading={() => <Loading />}
        renderError={() => <NotFound onRefresh={reloadPage} />}
        allowsBackForwardNavigationGestures={
          allowsBackForwardNavigationGestures
        } // iOS only
        onContentProcessDidTerminate={reloadPage} // iOS only
        textZoom={100}
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest} // URL 필터링 (딥링크 등)
        onNavigationStateChange={onNavigationStateChange} // 뒤로가기 가능 여부 추적
        webviewDebuggingEnabled={__DEV__} // 보안 이슈로 개발 환경에서만 활성화
      />
    </View>
  )
}

export default NcncWebview
