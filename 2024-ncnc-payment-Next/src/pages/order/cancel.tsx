import { Button, Page } from '@components/common'
import { OrderResultImage } from '@components/purchased'
import styled from '@emotion/styled'
import useAmplitudeEventProperties from '@hooks/useAmplitudeEventProperties'
import useSingleEffect from '@hooks/useSingleEffect'
import { logAmplitude, postMessage } from '@lib/helper/native'
import { fetchPaymentOrders, paymentOrderKeys } from '@queries/orders'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'

const Wrapper = styled.div`
  height: 100vh;

  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding-bottom: 34vh;
`

const CancelMessage = styled.div`
  display: flex;
  justify-content: center;

  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  color: #444;

  margin-top: 28px;
`

const SubMessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-top: 20px;
`

const SubMessage = styled.div`
  display: flex;

  text-align: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  color: ${({ theme }) => theme.gray6};
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  margin-top: 32px;

  & > :not(:first-child) {
    margin-left: 10.5px;
  }
`

const RedirectButton = styled(Button)<{ isRight?: boolean }>`
  width: 44.66vw;

  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: #fff;

  padding: 17px 0;

  background-color: ${({ isRight, theme }) =>
    isRight ? '#C5CBD6' : theme.red};

  border-radius: 10px;
`

const CancelOrderV2 = () => {
  const router = useRouter()
  const { orderId, message } = router.query

  const { getEventProperties } = useAmplitudeEventProperties()

  const { data: canceledPaymentOrder, isLoading } = useQuery({
    queryKey: paymentOrderKeys.paymentOrders(orderId as string, null),
    queryFn: () => fetchPaymentOrders(orderId as string, null),
    enabled: !!orderId,
  })

  useSingleEffect(
    useCallback(() => {
      if (!canceledPaymentOrder) return

      const eventName = canceledPaymentOrder.isCart
        ? 'viewed failed cart buy'
        : 'viewed failed buy'
      const eventProperties = getEventProperties(
        eventName,
        canceledPaymentOrder,
      )

      if (eventProperties) {
        logAmplitude(eventName, eventProperties)
      }
    }, [canceledPaymentOrder]),
  )

  useEffect(() => {
    postMessage('setBeforeRemove', {
      beforeRemoveType: 'default',
    })

    if (message) {
      const failReason = message === 'expired' ? '결제 가능 시간 초과' : message

      alert(failReason)
    }
  }, [message])

  const onClickHomeButton = () => {
    postMessage('goScreen', {
      modalName: 'TabStack',
      screen: 'HomeTab',
    })
  }

  const onClickReOrderButton = () => {
    postMessage('goBack')
  }

  if (isLoading) {
    return (
      <Page full>
        <Wrapper>
          <OrderResultImage orderResult="fail" />
        </Wrapper>
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
        <OrderResultImage orderResult="fail" />
        <CancelMessage>구매에 실패했어요</CancelMessage>
        <SubMessageWrapper>
          <SubMessage>
            주문을 다시 하시려면 {'다시 주문'}을 눌러주세요
          </SubMessage>
          <SubMessage>닫기 버튼을 누르면 홈으로 이동합니다</SubMessage>
        </SubMessageWrapper>
        <ButtonWrapper>
          <RedirectButton onClick={onClickReOrderButton}>
            다시 주문
          </RedirectButton>
          <RedirectButton onClick={onClickHomeButton} isRight>
            닫기
          </RedirectButton>
        </ButtonWrapper>
      </Wrapper>
    </Page>
  )
}

export default CancelOrderV2
