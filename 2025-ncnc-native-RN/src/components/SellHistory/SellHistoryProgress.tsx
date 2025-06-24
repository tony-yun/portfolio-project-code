import { color, typography } from '@doublenc-inc/nds-core'
import { usePopup } from '@doublenc-inc/nds-react-native'
import styled from '@emotion/native'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { ChannelIO } from 'react-native-channel-plugin'
import useSellConStatus from '../../hooks/useSellConStatus'
import { trackAmplitudeEvent } from '../../public/amplitude-helper'
import { handleError, recordError } from '../../public/error-helper'
import event from '../../public/event'
import {
  ChanneltalkSellConInfoPayload,
  ChanneltalkWorkflowIdResponse,
} from '../../public/types/channeltalk/general.types'
import { ErrorResponseData } from '../../public/types/error.types'
import { SellCon } from '../../public/types/sell/con.types'
import { sleep } from '../../public/util'
import { updateChanneltalkUserReportedSellConInfo } from '../../queries/channeltalk'
import NcncText from '../public/NcncText'
import SellCancelTipPopup from './SellCancelTipPopup'
import SellHistoryProgressBar from './SellHistoryProgressBar'
import SellHistoryTroubleInfo from './SellHistoryTroubleInfo'

interface SellHistoryProgressProps {
  con: SellCon
}

const Wrapper = styled.Pressable`
  padding: 0 20px;
`

const ProgressContainer = styled.View`
  padding: 20px 0 32px 0;
`

const Label = styled(NcncText)`
  font-size: 16px;
  font-weight: 700;
  color: #353535;
  line-height: 22px;
`

const SubTitle = styled(NcncText)`
  ${typography.body['body4-15-regular']}
  color: ${color.gray.gray800};

  margin-top: 12px;
`

const SellHistoryProgress = ({ con }: SellHistoryProgressProps) => {
  const {
    currentStatus,
    rejectedReason,
    troubleStatus,
    troubleWaitExpireAt,
    uuid,
    settlementDate,
  } = con

  const popup = usePopup()
  const { statusName, subTitle } = useSellConStatus(currentStatus, {
    settlementDate,
    rejectedReason,
  })

  const [popoverVisible, setPopoverVisible] = useState<boolean>(false)

  const { mutate: mutateChanneltalkUserReportedSellConInfo } = useMutation<
    ChanneltalkWorkflowIdResponse,
    AxiosError<ErrorResponseData>,
    ChanneltalkSellConInfoPayload
  >({
    mutationFn: updateChanneltalkUserReportedSellConInfo,
    onSuccess: async (data) => {
      if (!data?.workflowId) {
        handleReportedOutOfBusiness()

        return
      }

      await sleep(500)

      ChannelIO.openWorkflow(data.workflowId)
    },
    onError: (err) => {
      let errorMessage =
        '쿠폰 문의 접수 중 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.'

      if (axios.isAxiosError(err) && err.response) {
        const { data } = err.response

        if (typeof data === 'object' && data !== null) {
          errorMessage = 'error' in data ? data.error : errorMessage
        } else if (typeof data === 'string') {
          errorMessage = data
        }
      }

      handleError(err, errorMessage)

      recordError(
        err,
        '[SellHistoryDetail] mutateChanneltalkUserReportedSellConInfo error',
      )
    },
  })

  useEffect(() => {
    const handleScroll = () => {
      setPopoverVisible(false)
    }

    event.addListener('scroll', handleScroll)

    return () => {
      event.removeListener('scroll', handleScroll)
    }
  }, [])

  const handleReportedOutOfBusiness = () => {
    trackAmplitudeEvent('viewed disabledChatPopup', {
      module: 'sellHistoryDetail-trouble',
    })

    popup.show({
      variant: 'simple',
      title: '고객센터 영업시간이 아니에요',
      description: `영업시간에 다시 시도해 주세요.\n고객센터는 평일 10:00 - 18:00에 열어요.`,
      buttons: [{ text: '확인', onPress: popup.hide }],
    })
  }

  const handlePressWrapper = () => {
    if (popoverVisible) {
      setPopoverVisible(false)
    }
  }

  const handlePressContact = async () => {
    if (!uuid) {
      Alert.alert('쿠폰 정보를 찾을 수 없습니다.')

      return
    }

    trackAmplitudeEvent('clicked chat', {
      module: 'sellHistoryDetail-trouble',
    })

    const payload: ChanneltalkSellConInfoPayload = {
      conId: con.id,
      itemName: con.conItem?.item.name || '',
      conCategory2: con.conItem?.item.conCategory2.name || '',
      currentStatus: statusName || '',
      askingPrice: con?.askingPrice || 0,
      barcode: con?.barcode || '',
    }

    mutateChanneltalkUserReportedSellConInfo(payload)
  }

  return (
    <Wrapper onPress={handlePressWrapper}>
      <ProgressContainer>
        <Label>{statusName}</Label>

        {(currentStatus === 'waitSettlement' ||
          currentStatus === 'settled') && (
          <SellCancelTipPopup
            popoverVisible={popoverVisible}
            setPopoverVisible={setPopoverVisible}
          />
        )}

        {subTitle && <SubTitle>{subTitle}</SubTitle>}

        {(currentStatus === 'inReview' ||
          currentStatus === 'waitConfirm' ||
          currentStatus === 'waitSettlement' ||
          currentStatus === 'settled') && (
          <SellHistoryProgressBar
            currentStatus={currentStatus}
            isTroubleInProgress={troubleStatus === 'inProgress'}
          />
        )}
      </ProgressContainer>

      {troubleStatus && (
        <SellHistoryTroubleInfo
          troubleStatus={troubleStatus}
          troubleWaitExpireAt={troubleWaitExpireAt}
          handlePressContact={handlePressContact}
        />
      )}
    </Wrapper>
  )
}

export default SellHistoryProgress
