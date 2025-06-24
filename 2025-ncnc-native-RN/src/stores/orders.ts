// recoil 업데이트 종료되어 jotai 혹은 zustand 로 대체될 예정

import { atom } from 'recoil'
import { Nullable, SocketResult } from '../public/types/global.types'
import { MonthOptionKey } from '../public/types/month-option.types'

export const selectedMyOrdersMonthOptionState = atom<MonthOptionKey>({
  key: 'selected-my-orders-month-option',
  default: 'all',
})

export const orderIdState = atom<Nullable<number>>({
  key: 'order-id',
  default: null,
})

export const isVisibleOrderFilterState = atom<boolean>({
  key: 'is-visible-order-filter',
  default: false,
})

export const orderBookStatusState = atom<SocketResult>({
  key: 'order-book-status',
  default: null,
})
