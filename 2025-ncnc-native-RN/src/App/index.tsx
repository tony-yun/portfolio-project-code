import { BugsnagPluginReactResult } from '@bugsnag/plugin-react'
import BugsnagPluginReactNavigation, {
  BugsnagPluginReactNavigationResult,
} from '@bugsnag/plugin-react-navigation'
import Bugsnag from '@bugsnag/react-native'
import notifee from '@notifee/react-native'
import messaging from '@react-native-firebase/messaging'
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { RecoilRoot } from 'recoil'
import GreyToast from '../components/public/toast/GreyToast'
import LikeToast from '../components/public/toast/LikeToast'
import SnackBar from '../components/public/toast/SnackBar'
import useInitChanneltalkPush from '../hooks/channeltalk/useInitChanneltalkPush'
import useCodePush from '../hooks/useCodePush'
import packageJson from '../package.json'
import { setUserPropertiesToAmplitude } from '../public/amplitude-helper'
import {
  handleQueryError,
  handleReactQueryRetry,
  recordLog,
} from '../public/error-helper'
import {
  handleForegroundEvent,
  handlePushClick,
} from '../public/notification-helper'
import {
  available,
  permissions,
  requestPermission,
} from '../public/permission-helper'
import { RootStackScreenList } from '../public/types/navigations.types'
import { deleteAllAsyncStorageData } from '../storage'
import RootStack from './stacks/RootStack'

if (!Bugsnag.isStarted()) {
  Bugsnag.start({
    plugins: [new BugsnagPluginReactNavigation()],
    user: { id: 'ncnc' },
    codeBundleId: packageJson.version,
  })
}

const reactPlugin = Bugsnag.getPlugin('react') as BugsnagPluginReactResult
const reactNavigationPlugin = Bugsnag.getPlugin(
  'reactNavigation',
) as BugsnagPluginReactNavigationResult

const ErrorBoundary = reactPlugin.createErrorBoundary(React)
const { createNavigationContainer } = reactNavigationPlugin

const BugsnagNavigationContainer =
  createNavigationContainer(NavigationContainer)

mobileAds()
  .setRequestConfiguration({
    ...
  })
  .then(() => {
    recordLog('[ADMOB] Request config successfully set!')
  })

if (Platform.OS === 'ios') {
  requestPermission(permissions...).then(
...
  )
}

mobileAds()
  .initialize()
  .then((adapterStatuses) => {
    recordLog('[ADMOB] Initialization complete!', { adapterStatuses })
  })

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleQueryError,
  }),
  defaultOptions: {
    queries: {
      staleTime: example * 60 * 1000,
      gcTime: example * 60 * 1000,
      retry: handleReactQueryRetry,
      retryDelay: example * 1000,
    },
  },
})

const App = () => {
  const navigationRef = useNavigationContainerRef<RootStackScreenList>()

  useCodePush()

  useInitChanneltalkPush()

  useEffect(() => {
    recordLog('App')

    deleteAllAsyncStorageData()

    fetchNotification()

    return notifee.onForegroundEvent((event) =>
      handleForegroundEvent(event, queryClient),
    )
  }, [])

  const fetchNotification = async () => {
    // Notification received on 'Background' state
    messaging().onNotificationOpenedApp((message) => {
      const { notification, data } = message

      handlePushClick({
        title: notification?.title ?? null,
        body: notification?.body ?? null,
        data,
      })
    })

    // Notification received on 'Quit' state
    const initialNotification = await messaging().getInitialNotification()

    if (initialNotification) {
      const { notification, data } = initialNotification

      handlePushClick({
        title: notification?.title ?? null,
        body: notification?.body ?? null,
        data,
      })
    }
  }

  return (
    <>
      <ErrorBoundary>
        <RecoilRoot>
          <QueryClientProvider client={queryClient}>
            <BugsnagNavigationContainer ref={navigationRef}>
              <SafeAreaProvider>
                <RootStack />
              </SafeAreaProvider>
            </BugsnagNavigationContainer>
          </QueryClientProvider>
        </RecoilRoot>
      </ErrorBoundary>
    </>
  )
}

export default App
