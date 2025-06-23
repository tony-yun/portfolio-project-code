import { Loading, Page } from '@components/common'
import {
  BenefitButton,
  OrderResultImage,
  RouteButtons,
} from '@components/purchased'
import styled from '@emotion/styled'
import useAmplitudeEventProperties from '@hooks/useAmplitudeEventProperties'
import useCompareVersion from '@hooks/useCompareVersion'
import useHandlePaymentOrderInfo from '@hooks/useHandlePaymentOrderInfo'
import useReward from '@hooks/useReward'
import useSingleEffect from '@hooks/useSingleEffect'
import useSocket from '@hooks/useSocket'
import useUserSetting from '@hooks/useUserSetting'
import {
  displayNotification,
  logAmplitude,
  postMessage,
} from '@lib/helper/native'
import { getNaverErrorMessage } from '@lib/helper-pg/naver-pay'
import type { Nullable } from '@lib/types/global.types'
import type { PageType } from '@lib/types/paymentMethod.types'
import { checkOrderDelivered, paymentOrderKeys } from '@queries/orders'
import { nativeFromState } from '@stores/native'
import { currentOrderPageState } from '@stores/payments'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { camelCase } from 'lodash'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'

const Wrapper = styled.div`
  height: 100%;

  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding-bottom: 34vh;
`

const OrderResultMessage = styled.div`
  display: flex;
  justify-content: center;

  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  color: #474d59;

  margin-top: 28px;
`

const SubMessageWrapper = styled.div`
  display: flex;
  justify-content: center;
`

const OrderResultSubMessage = styled.div`
  display: flex;
  justify-content: center;

  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.gray6};

  margin-top: 9px;
`

const PurchasedPage: NextPage = () => {
  useUserSetting()
  const router = useRouter()
  const queryClient = useQueryClient()
  const isRewardNudgeNewVersion = useCompareVersion('6.6.4-1')

  const { orderId, code, message } = router.query

  const { socketFailMessage, socketOrderResult } = useSocket(
    orderId as string,
    'delivery',
  )
  const { getEventProperties } = useAmplitudeEventProperties()
  const { rewardAmountLeft } = useReward()

  const currentOrderPage = useRecoilValue<PageType>(currentOrderPageState)
  const nativeFrom = useRecoilValue<Nullable<string>>(nativeFromState)

  const [deliveryResult, setDeliveryResult] = useState<
    'success' | 'fail' | 'pending'
  >('pending')

  const { data: order } = useHandlePaymentOrderInfo(
    orderId as string,
    'delivery-detail',
    deliveryResult === 'success' || deliveryResult === 'fail',
  )

  const [deliveryResultMessage, setDeliveryResultMessage] = useState<string>('')
  const [orderFailMessage, setOrderFailMessage] =
    useState<Nullable<string>>(null)

  const rewardNotificationSent = useRef<boolean>(false)

  const {
    data: checkOrderDeliveredData,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: paymentOrderKeys.checkOrderDelivered(orderId as string),
    queryFn: () => checkOrderDelivered(orderId as string),
    enabled: !!orderId,
    gcTime: 0,
    staleTime: 0,
    retry: (failureCount: number): boolean => {
      if (code && code !== 'success') {
        return false
      }

      const orderResult = queryClient.getQueryData(
        paymentOrderKeys.checkOrderDelivered(orderId as string),
      )

      if (orderResult === 'fail') {
        return false
      }

      if (failureCount >= 60) {
        return false
      }

      return true
    },
    retryDelay: 1000,
  })

  useEffect(() => {
    postMessage('backHandler', { action: 'add' })

      // ...
    }

    if (isSuccess && socketOrderResult === 'success') {
     // ...
    }
  }, [
    isError,
    isSuccess,
    code,
    message,
    order,
    socketOrderResult,
    currentOrderPage,
  ]

  useEffect(() => {
    if (currentOrderPage !== 'nicon-money') {
      queryClient.setQueryData(
        paymentOrderKeys.checkOrderDelivered(orderId as string),
        socketOrderResult,
      )
    } else {
      if (socketOrderResult === 'fail') {
        queryClient.setQueryData(
          paymentOrderKeys.checkOrderDelivered(orderId as string),
          'fail',
        )
      }
    }
  }, [socketOrderResult, currentOrderPage])

  useSingleEffect(
    useCallback(() => {
      if (deliveryResult === 'success' && order) {
        const eventName = order.isCart
          ? 'viewed checkout cart buy'
          : 'viewed checkout buy'
        const eventProperties = getEventProperties(eventName, order)

        if (eventProperties) {
          logAmplitude(eventName, eventProperties)
        }
      }
    }, [deliveryResult, order]),
  )

  if (deliveryResult === 'pending' || deliveryResultMessage === '' || !order) {
    return (
      <Page full header={{ router }}>
        <Loading
          title="결제중입니다."
          subTitle="최대 1분 정도 소요될 수 있습니다."
        />
      </Page>
    )
  }

  return (
    <Page
      header={{
        router,
        left: 'close-back',
        right: 'home',
      }}
      full
    >
      <Wrapper>
        <OrderResultImage orderResult={deliveryResult} />
        <OrderResultMessage>{deliveryResultMessage}</OrderResultMessage>
        {deliveryResult === 'success' && <BenefitButton />}
        <SubMessageWrapper>
          <OrderResultSubMessage>
            {orderFailMessage ? orderFailMessage : socketFailMessage}
          </OrderResultSubMessage>
        </SubMessageWrapper>
        <RouteButtons order={order} orderResult={deliveryResult} />
      </Wrapper>
    </Page>
  )
}

export default PurchasedPage
