import { STORAGE } from '../../storage/config'

export type MMKVStorageKey = keyof typeof STORAGE

interface ValueTypeMap {
  boolean: boolean
  string: string
  number: number
  Uint8Array: Uint8Array
}

/**
 * MMKV에서 지원하는 값의 타입
 */
export type MMKVValueType = ValueTypeMap[keyof ValueTypeMap]

/**
 * `ValueType`을 문자열로 변경한 타입
 */
export type StringifiedMMKVValueType = keyof ValueTypeMap

type StorageTypeMap = {
  [K in MMKVStorageKey]: ValueTypeMap[(typeof STORAGE)[K]]
}

export type MMKVStorageValue<T extends MMKVStorageKey> = StorageTypeMap[T]
