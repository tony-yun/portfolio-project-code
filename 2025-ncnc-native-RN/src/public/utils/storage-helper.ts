import { storage } from '../../storage'
import { STORAGE } from '../../storage/config'
import { recordError, recordLog } from './error-helper'
import {
  MMKVStorageKey,
  MMKVStorageValue,
  StringifiedMMKVValueType,
} from '../types/storage.types'

export const getValueFromStorage = <T extends MMKVStorageKey>(key: T) => {
  if (!(key in STORAGE)) {
    throw new Error('Invalid storage key')
  }

  const valueType = STORAGE[key] as StringifiedMMKVValueType
  const hasValue = storage.contains(key)

  if (!hasValue) return undefined

  recordLog('getValueFromStorage success', {
    key,
    valueType,
    hasValue,
  })

  switch (valueType) {
    case 'boolean':
      return storage.getBoolean(key) as unknown as MMKVStorageValue<T>
    case 'string':
      return storage.getString(key) as unknown as MMKVStorageValue<T>
    case 'number':
      return storage.getNumber(key) as unknown as MMKVStorageValue<T>
    case 'Uint8Array':
      return storage.getBuffer(key) as unknown as MMKVStorageValue<T>
    default:
      throw new Error('Invalid valueType')
  }
}

export const getParsedValueFromStorage = <T>(
  key: MMKVStorageKey,
): T | undefined => {
  const valueType = STORAGE[key] as StringifiedMMKVValueType
  const value = getValueFromStorage(key)

  if (valueType !== 'string' || (value && typeof value !== 'string')) {
    throw new Error('Invalid valueType')
  }

  if (value) {
    try {
      const parsedValue = JSON.parse(value)

      recordLog('getParsedValueFromStorage success', {
        key,
        value: parsedValue,
      })

      return parsedValue
    } catch (err) {
      recordError(err, 'getParsedValueFromStorage JSON.parse Error')

      return undefined
    }
  } else {
    return undefined
  }
}

export const setValueToStorage = <T extends MMKVStorageKey>(
  key: T,
  value: MMKVStorageValue<T>,
) => {
  if (!(key in STORAGE)) {
    throw new Error('Invalid storage key')
  }

  storage.set(key, value)
}

export const setStringifiedValueToStorage = <T>(
  key: MMKVStorageKey,
  value: T,
) => {
  const valueType = STORAGE[key] as StringifiedMMKVValueType

  if (valueType !== 'string') {
    throw new Error('Invalid valueType')
  }

  const stringifiedValue = JSON.stringify(value)

  storage.set(key, stringifiedValue)
}

export const deleteValueFromStorage = <T extends MMKVStorageKey>(key: T) => {
  storage.delete(key)

  recordLog('deleteValueFromStorage success', {
    key,
  })
}
