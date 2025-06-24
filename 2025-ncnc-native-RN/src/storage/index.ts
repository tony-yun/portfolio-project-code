import { STORAGE_ENCRYPTION_KEY } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MMKV } from 'react-native-mmkv'
import { recordError, recordLog } from '../public/error-helper'

export const storage = new MMKV({
  id: 'ncnc-storage',
  encryptionKey: STORAGE_ENCRYPTION_KEY,
})

/**
 * **웹뷰 기반 프로젝트 전용**
 *
 *  NATIVE 환경에서는 반드시 상단 `storage`를 사용하세요.
 */
export const webStorage = new MMKV({
  id: 'ncnc-web-storage',
  encryptionKey: STORAGE_ENCRYPTION_KEY,
})
