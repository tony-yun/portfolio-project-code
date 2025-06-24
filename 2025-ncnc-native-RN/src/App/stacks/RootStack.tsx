import { NdsProvider } from '@doublenc-inc/nds-react-native'
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import { ChannelIO } from 'react-native-channel-plugin'
import { getVersion } from 'react-native-device-info'
import { checkNotifications, RESULTS } from 'react-native-permissions'
import { useRecoilValue } from 'recoil'
import PushPermissionGuideBottomSheet from '../../components/public/bottom-sheet/PushPermissionGuideBottomSheet'
import BottomSheet from '../../components/public/BottomSheet'
import PopupModal from '../../components/public/PopupModal'
import withBlockedAuth from '../../hocs/WithBlockedAuth'
import useChanneltalkUnreadMessages from '../../hooks/channeltalk/useChanneltalkUnreadMessages'
import useBottomSheet from '../../hooks/useBottomSheet'
import useMe from '../../hooks/useMe'
import useStoreVersionCheck from '../../hooks/useStoreVersionCheck'
import packageJson from '../../package.json'
import { setAppVersion } from '../../public/auth-helper'
import { bootChannelIO } from '../../public/channeltalk-helper'
import { recordLog } from '../../public/error-helper'
import { initFcmToken } from '../../public/fcm-helper'
import { available } from '../../public/permission-helper'
import { initAdPopcornOfferwall } from '../../public/reward-helper'
import { setUserId } from '../../public/tracking-helper'
import { RootStackScreenList } from '../../public/types/navigations.types'
import { fetchEncryptedUserId, rewardKey } from '../../queries/reward'
import { isBottomSheetVisibleState } from '../../stores/bottom-sheet'
import { loginModeState } from '../../stores/global'
import MainStack from './MainStack'

const Root = createStackNavigator<RootStackScreenList>()

const RootStack = () => {
  useStoreVersionCheck()
  useChanneltalkUnreadMessages()

  const { showBottomSheet } = useBottomSheet()
  const { me, token } = useMe()

  const loginMode = useRecoilValue(loginModeState)
  const isBottomSheetVisible = useRecoilValue(isBottomSheetVisibleState)

  useEffect(() => {
    //...
  }, [])

  useEffect(() => {
    //...
  }, [token])

  useEffect(() => {
    if (me && token) {
      /**
       * 신규 회원 가입 직후 최초 로그인 / 앱 재설치 후 최초 로그인 시
       * 알림 권한 요청 및 fcmToken 초기화
       */
      const initNotification = async () => {
        const { status } = await checkNotifications()
        const fcmAvailable = available(status)

        recordLog('initNotification', {
          permissionStatus: status,
          fcmAvailable,
        })

        if (fcmAvailable) {
          initFcmToken()
        } else if (status === RESULTS.DENIED) {
          showBottomSheet({
            component: (
              <PushPermissionGuideBottomSheet
                pushGuideKey={`new-from-${loginMode}`}
              />
            ),
            height: 'auto',
          })
        }
      }

      setTimeout(() => {
        initNotification()
      }, 500)
    }
  }, [me, token, loginMode])

  useEffect(() => {
    //...
  }, [me])

  return (
    <NdsProvider>
      <Root.Navigator
        screenOptions={({ route, navigation }) => {
          const options: StackNavigationOptions = {
            headerShown: false,
            presentation: 'modal',
          }

          return Platform.OS === 'ios'
            ? {
                ...options,
                ...TransitionPresets.ModalPresentationIOS,
                cardOverlayEnabled: true,
                gestureEnabled: true,
                headerStatusBarHeight:
                  navigation.getState().routes.indexOf(route) > 0
                    ? 0
                    : undefined,
              }
            : options
        }}
      >
        <Root.Screen name="MainStack" component={MainStack} />
      </Root.Navigator>

      {isBottomSheetVisible && <BottomSheet />}
      <PopupModal />
    </NdsProvider>
  )
}

export default withBlockedAuth(RootStack)
