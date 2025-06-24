import utils from '@doublenc-inc/ncnc-utils'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import dayjs from 'dayjs'
import { floor, fromPairs, round } from 'lodash'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import RNFS from 'react-native-fs'
import { PERMISSIONS } from 'react-native-permissions'
import Toast from 'react-native-toast-message'
import { SCREEN_WIDTH } from './constants'
import { handleError, recordError, recordLog } from './error-helper'
import {
  available,
  guidePhotoLibraryWritePermission,
  requestPermission,
} from './permission-helper'
import { AnyFunction, GridItemType, Nullable } from './types/global.types'

/**
 * 특정 실행 로직에 대한 타임아웃을 설정합니다.
 *
 * - `Promise.race([...])`와 같이 사용하는 것을 권장합니다.
 * - 지정한 시간(`ms`)을 초과하면 Promise rejection이 발생됩니다.
 */
export const timeout = (ms: number, target?: string) =>
  new Promise<never>((_, reject) => {
    setTimeout(() => reject(`${target ?? ''} timeout exceeded.`), ms)
  })

/**
 * 전달 받은 날짜에 대한 상대적 표현을 반환합니다.
 *
 * - `오늘`
 * - `내일`
 * - `M월 D일` | `YY년 M월 D일` (현재와 연도가 다른 경우)
 */
export const getRelativeDate = (dateString?: Nullable<string>) => {
  if (!dateString || !dayjs(dateString).isValid()) return '-'

  const today = dayjs().startOf('day')
  const targetDate = dayjs(dateString).startOf('day')
  const dayDiff = targetDate.diff(today, 'day')
  const isNotSameYear = targetDate.get('year') !== today.get('year')

  switch (dayDiff) {
    case 0:
      return '오늘'
    case 1:
      return '내일'
    default:
      return dayjs(dateString).format(
        isNotSameYear ? 'YY년 M월 D일' : 'M월 D일',
      )
  }
}

/**
 * 바코드를 4자리씩 구분하여 공백으로 구분된 문자열로 반환합니다.
 */
export const getTrimmedBarcode = (barcode: string): string => {
  return barcode.match(/.{1,4}/g)?.join(' ') ?? ''
}

/**
 * 전화번호를 `010-1234-5678` 형식으로 반환합니다.
 */
export const formatPhoneNumber = (phone: Nullable<string>): string => {
  if (!phone || !/^\d{11}$/.test(phone)) {
    return String(phone)
  }

  const areaCode = phone.slice(0, 3)
  const middle = phone.slice(3, 7)
  const last = phone.slice(7, 11)

  return `${areaCode}-${middle}-${last}`
}

//...