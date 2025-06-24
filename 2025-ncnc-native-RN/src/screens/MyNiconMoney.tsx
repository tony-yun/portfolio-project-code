import { color } from '@doublenc-inc/nds-core'
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query'
import styled from '@emotion/native'
import { AxiosError } from 'axios'
import { flatten } from 'lodash'
import React, { useEffect } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { useRecoilValue } from 'recoil'
import Loading from '../components/Loading'
import {
  EmptyNiconMoney,
  NiconMoneyHeader,
  NiconMoneyList,
} from '../components/MyNiconMoney'
import NiconMoneySkeleton from '../components/MyNiconMoney/nicon-money/NiconMoneySkeleton'
import withAuth from '../hocs/WithAuth'
import useMe from '../hooks/useMe'
import { ErrorResponseData } from '../public/types/error.types'
import {
  MyNiconMoneyHistoryType,
  fetchNiconMoneyHistory,
  myNiconMoneyKey,
} from '../queries/my-nicon-money'
import { usersMeKey } from '../queries/users-me'
import {
  MyNiconMoneyFilterOptionKeyType,
  MyNiconMoneySortOptionKeyType,
  selectedMyNiconMoneyFilterOptionState,
  selectedMyNiconMoneySortOptionState,
} from '../stores/my-nicon-money'

const Wrapper = styled.View`
  flex: 1;

  background-color: ${color.gray.white};
`

const MyNiconMoney = () => {
  const queryClient = useQueryClient()

  const { token } = useMe()

  const monthOption = useRecoilValue<MyNiconMoneySortOptionKeyType>(
    selectedMyNiconMoneySortOptionState,
  )
  const filterOption = useRecoilValue<MyNiconMoneyFilterOptionKeyType>(
    selectedMyNiconMoneyFilterOptionState,
  )

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery<
      MyNiconMoneyHistoryType[],
      AxiosError<ErrorResponseData>,
      InfiniteData<MyNiconMoneyHistoryType[]>,
      QueryKey,
      number
    >({
      queryKey: myNiconMoneyKey.niconMoneyHistory(filterOption, monthOption),
      queryFn: ({ pageParam }) =>
        fetchNiconMoneyHistory(pageParam, monthOption, filterOption),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length) {
          return pages.length + 1
        }
      },
    })

  const fetchMore = () => {
    if (!hasNextPage) return

    fetchNextPage()
  }

  const myNiconMoneyData = data ? flatten(data.pages) : []

  return (
    <Wrapper>
      <FlatList
        data={myNiconMoneyData}
        keyExtractor={(item, index) => `nicon-money-list-${item.id}-${index}`}
        renderItem={({ item }) => <NiconMoneyList data={item} />}
        ListHeaderComponent={<NiconMoneyHeader />}
        ListHeaderComponentStyle={s.listHeaderComponentStyle}
        contentContainerStyle={s.contentContainerStyle}
        initialNumToRender={10}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.6}
        ListEmptyComponent={
          isLoading ? <NiconMoneySkeleton /> : <EmptyNiconMoney />
        }
      />

      {isFetchingNextPage && <Loading />}
    </Wrapper>
  )
}

const s = StyleSheet.create({
  contentContainerStyle: {
    paddingTop: 36,
    paddingBottom: 10,
    paddingHorizontal: 18,
    backgroundColor: color.gray.white,
  },
  listHeaderComponentStyle: {
    paddingBottom: 15,
  },
})

export default withAuth(MyNiconMoney)
