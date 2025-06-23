import { Divider, Page } from '@components/common'
import { PaymentEmail, SelfAuthPopUp } from '@components/orders/common'
import { AddNiconPayBottomSheet } from '@components/orders/common/nicon-pay'
import NiconPayDisableModal from '@components/orders/common/nicon-pay/NiconPayDisableModal'
import { PaymentMethods } from '@components/orders/common/payment-methods'
import {
  BeforeLeaveModal,
  ConOrderInfo,
  ConPriceTable,
  OrderButton,
  SpendNiconMoney,
} from '@components/orders/con-items'
import { PaymentPromotion } from '@components/orders/con-items/promotion'
import { ConItemSkeleton } from '@components/orders/con-items/skeleton'
import useAmplitudeEventProperties from '@hooks/useAmplitudeEventProperties'
import useHandlePaymentMethods from '@hooks/useHandlePaymentMethods'
import useHandlePaymentOrderInfo from '@hooks/useHandlePaymentOrderInfo'
import useSingleEffect from '@hooks/useSingleEffect'
import { IOS_MIN_VERSION, TIME_LIMIT } from '@lib/constants'
import { logAmplitude, postMessage } from '@lib/helper/native'
import type {
  AppState,
  CurrentAppStatusType,
  Nullable,
} from '@lib/types/global.types'
import type { User } from '@lib/types/me.types'
import type { ConItemPackage } from '@lib/types/order.types'
import type { PageType } from '@lib/types/paymentMethod.types'
import { cancelOrder } from '@queries/orders'
import { conItemPackagesState } from '@stores/con-items'
import { userInfoState } from '@stores/me'
import {
  appState,
  currentAppStatusState,
  currentOrderPageState,
  isShownNiconPayDisableNoticeState,
} from '@stores/payments'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

const ConItemsV2 = () => {
  const router = useRouter()

  const { orderId } = router.query
  const {
    isLoading: isLoadingPaymentOrder,
    isSuccess: isSuccessPaymentOrder,
    data: paymentOrder,
  } = useHandlePaymentOrderInfo(orderId as string, null, true)

  const { isAllowedNiconMoney } = useHandlePaymentMethods()
  const { getEventProperties } = useAmplitudeEventProperties()

  const { userId } = useRecoilValue<User>(userInfoState)
  const app = useRecoilValue<AppState>(appState)
  const currentAppStatus = useRecoilValue<Nullable<CurrentAppStatusType>>(
    currentAppStatusState,
  )

  console.log('')

  const conItemPackages = useRecoilValue<ConItemPackage[]>(conItemPackagesState)
  const isShownNiconPayDisableNotice = useRecoilValue<boolean>(
    isShownNiconPayDisableNoticeState,
  )
  const setCurrentOrderPage = useSetRecoilState<PageType>(currentOrderPageState)

  const [isBeforeRemove, setIsBeforeRemove] = useState<boolean>(false)
  const [alertShown, setAlertShown] = useState<boolean>(false)

  const isInitialUserInfo = userId === 0

  useEffect(() => {
    setCurrentOrderPage('con-items')

    postMessage('loadDataFromStorage', {
      from: 'payment',
      key: 'is-show-nicon-pay-disable-notice',
      valueType: 'boolean',
    })
  }, [])

  useEffect(() => {
    postMessage('setBeforeRemove', {
      beforeRemoveType: 'custom',
    })
    document.addEventListener('beforeRemove', () => setIsBeforeRemove(true))

    return () => {
      document.removeEventListener('beforeRemove', () => postMessage('goBack'))
    }
  }, [])

  useEffect(() => {
    if (
      app.platform === 'ios' &&
      app.osVersion &&
      Number(app.osVersion) < IOS_MIN_VERSION
    ) {
      alert(
        'iOS 15.0 이상 버전에서만 이용 가능합니다. 업데이트 후 이용해주세요.',
      )

      router.replace(`/v2/orders/cancel?orderId=${orderId}`)
    }
  }, [orderId, app.osVersion])

  useEffect(() => {
    if (
      isSuccessPaymentOrder &&
      paymentOrder &&
      currentAppStatus === 'active'
    ) {
      const currentTime = dayjs()
      const orderCreatedAt = dayjs(paymentOrder.createdAt)

    //...
        setAlertShown(true)

        router.replace(`/v2/orders/cancel?orderId=${orderId}&message=expired`)
      }
    }
  }, [currentAppStatus, isSuccessPaymentOrder, paymentOrder, alertShown])

  useSingleEffect(
    useCallback(() => {
      if (!paymentOrder) return

      const eventName = paymentOrder.isCart
        ? 'viewed cart order'
        : 'viewed order'

      const eventProperties = getEventProperties(eventName, paymentOrder)

      if (eventProperties) {
        logAmplitude(eventName, eventProperties)
      }
    }, [paymentOrder]),
  )

  if (
//...
  ) {
    return (
      <Page
        header={{
          router,
          title: '콘 구매',
          left: 'close-back',
        }}
        full
      >
        <ConItemSkeleton />
      </Page>
    )
  }

  return (
    <Page
      header={{
        router,
        title: '콘 구매',
        left: 'close-back',
      }}
      full
    >
      <ConOrderInfo />
      {isAllowedNiconMoney && (
        <>
          <Divider type="thick" />

          <SpendNiconMoney />
        </>
      )}

      <Divider type="thick" />

      <PaymentMethods />
      <PaymentPromotion />

      <Divider type="thick" />

      <ConPriceTable />
      <PaymentEmail />

      <Divider type="thick" />

      <OrderButton />
      <SelfAuthPopUp />
      <AddNiconPayBottomSheet />
      {isBeforeRemove && (
        <BeforeLeaveModal
          orderId={orderId as string}
          onClose={() => setIsBeforeRemove(false)}
        />
      )}
      {!isShownNiconPayDisableNotice && <NiconPayDisableModal />}
    </Page>
  )
}

export default ConItemsV2
