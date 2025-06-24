import { color, typography } from '@doublenc-inc/nds-core'
import styled from '@emotion/native'
import { useFocusEffect } from '@react-navigation/native'
import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { flatMap } from 'lodash'
import React, { useCallback, useEffect } from 'react'
import { FlatList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Loading from '../components/Loading'
import NcncText from '../components/public/NcncText'
import EmptySettlementHistory from '../components/SettlementHistory/EmptySettlementHistory'
import SettlementHistoryHeader from '../components/SettlementHistory/SettlementHistoryHeader'
import SettlementHistoryItem from '../components/SettlementHistory/SettlementHistoryItem'
import SettlementHistorySkeleton from '../components/SettlementHistory/SettlementHistorySkeleton'
import useMe from '../hooks/useMe'
import { trackAmplitudeEvent } from '../public/amplitude-helper'
import { trackChanneltalkEvent } from '../public/channeltalk-helper'
import { MAX_SCREEN_WIDTH, SCREEN_WIDTH } from '../public/constants'
import { recordLog } from '../public/error-helper'
import { ErrorResponseData } from '../public/types/error.types'
import { InfiniteQueryResponse } from '../public/types/global.types'
import { MainStackScreen } from '../public/types/navigations.types'
import { SettlementLog } from '../public/types/sell/settlement.types'
import { TransferStatus } from '../public/types/sell/status.types'
import { fetchSettlementLogs, sellerUsersKey } from '../queries/seller-users'

const Wrapper = styled.View`
  position: relative;

  flex: 1;
  align-items: center;

  background-color: ${color.gray.white};
`

const FullContainer = styled.View`
  width: ${Math.min(MAX_SCREEN_WIDTH, SCREEN_WIDTH) + 'px'};

  flex: 1;
`

const YearHeader = styled(NcncText)`
  ${typography.caption['caption2-13-regular']}
  color: ${color.gray.gray800};

  padding: 8px 0 8px 20px;
`

const SettlementHistory: MainStackScreen<'SettlementHistory'> = ({ route }) => {
  const { initialHighlightStatus } = route.params || {}

  const { bottom: insetBottom } = useSafeAreaInsets()

  const { me, token } = useMe()

  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery<
      InfiniteQueryResponse<
        SettlementLog,
        'settlementLogs',
        { cursor: string }
      >,
      AxiosError<ErrorResponseData>,
      InfiniteData<
        InfiniteQueryResponse<
          SettlementLog,
          'settlementLogs',
          { cursor: string }
        >
      >,
      QueryKey,
      string | undefined // 첫 요청의 경우 cursor를 전달하지 않습니다.
    >({
      queryKey: sellerUsersKey.settlementLogs(token),
      queryFn: ({ pageParam: initialCursor }) =>
        fetchSettlementLogs(initialCursor),
      enabled: Boolean(me?.selfAuth),
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => {
        if (lastPage.hasNext) {
          return lastPage.cursor
        }
      },
      meta: {
        errorToastText: '정산 내역을 불러오지 못했어요 😢',
        needRecordError: true,
      },
    })

  const settlementLogs = flatMap(data?.pages, 'settlementLogs')

  useFocusEffect(
    useCallback(() => {
      trackAmplitudeEvent('viewed SettlementHistory', undefined)

      trackChanneltalkEvent({ name: '정산내역 화면 노출' })
    }, []),
  )

  useEffect(() => {
    recordLog('[SettlementHistory] mounted')
  }, [])

  const fetchMore = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  const hasTransferFailed = settlementLogs.some(
    (log) =>
      log.status === ('transferFailed' as TransferStatus) ||
      log.status === ('partialDeductedTransferFailed' as TransferStatus),
  )

  return (
    <Wrapper>
      <FullContainer>
        {isFetchingNextPage && <Loading />}
        {settlementLogs && (
          <FlatList
            data={settlementLogs}
            keyExtractor={(item, index) => `point-log-${item.id}-${index}`}
            renderItem={({ item, index }) => {
              const currentYear = dayjs(item.date).year()
              const prevYear =
                index > 0 ? dayjs(settlementLogs[index - 1].date).year() : null
              const thisYear = dayjs().year()

              const showYearHeader =
                currentYear !== thisYear && currentYear !== prevYear

              return (
                <>
                  {showYearHeader && <YearHeader>{currentYear}</YearHeader>}

                  <SettlementHistoryItem
                    settlementLog={item}
                    initialHighlightStatus={initialHighlightStatus}
                  />
                </>
              )
            }}
            ListHeaderComponent={
              <SettlementHistoryHeader hasTransferFailed={hasTransferFailed} />
            }
            ListEmptyComponent={
              isLoading ? (
                <SettlementHistorySkeleton />
              ) : (
                <EmptySettlementHistory />
              )
            }
            onEndReached={fetchMore}
            onEndReachedThreshold={0.3}
            scrollIndicatorInsets={{ right: 1 }}
            contentContainerStyle={{
              paddingBottom: insetBottom + 16,
              flex: settlementLogs.length === 0 ? 1 : 0,
            }}
          />
        )}
      </FullContainer>
    </Wrapper>
  )
}

export default SettlementHistory
