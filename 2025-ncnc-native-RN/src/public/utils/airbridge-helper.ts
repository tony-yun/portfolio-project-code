import Airbridge, { AirbridgeCategory } from 'airbridge-react-native-sdk'
import { Platform } from 'react-native'
import { ChannelIO } from 'react-native-channel-plugin'
import { URL, URLSearchParams } from 'react-native-url-polyfill'
import linking from './deeplink-helper'
import { handleChannelTalkMode } from './channeltalk-helper'
import { recordError, recordLog } from './error-helper'
import { LinkingPathConfigMap } from './types/linking.types'

type AirbridgeStandardCategory = keyof typeof airbridgeStandardEventCategories
type AirbridgeCustomCategory = keyof typeof airbridgeCustomEventCategories

export type EventOption = {
  action?: string
  label?: string
  value?: number
  customAttributes?: {
    [key: string]: string
  }
  semanticAttributes?: {
    [key: string]: string
  }
}

type User = {
  ID?: string
  email?: string
  phone?: string
  alias?: {
    [key: string]: string
  }
  attributes?: {
    [key: string]: string
  }
}

/**
 * deeplink url로부터 query string을 추출하여 key:value 쌍의 객체로 반환합니다.
 */
const getQueryString = (originalUrl: string) => {
  const url = new URL(originalUrl)
  const urlSearchParams = new URLSearchParams(url.search)

  const params: Record<string, string> = {}

  for (const [key, value] of urlSearchParams.entries()) {
    params[key] = value
  }

  return params
}

/**
 * key:value 쌍의 query string 객체의 값을 parsing하여 반환합니다.
 *
 * @tip `config`의 parse 함수가 존재하는 경우에만 진행됩니다.
 */
const getParsedQueryString = (
  queryParams: Record<string, string>,
  config: LinkingPathConfigMap,
): Record<string, unknown> => {
  for (const key in queryParams) {
    if (
      config?.parse &&
      key in config.parse &&
      typeof config.parse[key] === 'function'
    ) {
      queryParams[key] = config.parse[key](queryParams[key])
    }
  }

  return queryParams
}

/**
 * `linking`의 pathConfigMap중 `path`를 이용하여 path variables를 parsing하여 반환합니다.
 */
const getParsedPathVariables = (
  linkSegments: string[],
  config: LinkingPathConfigMap,
) => {
  const { path } = config
  const pathSegments = path.split('/:')
  const params: Record<string, unknown> = {}

  for (let i = 1; i < pathSegments.length; i++) {
    let key = pathSegments[i]
    if (key.slice(-1) === '?') {
      if (!linkSegments[i]) {
        break
      }

      key = key.slice(0, -1)
    }

    params[key] =
      config.parse && key in config.parse
        ? config.parse[key](linkSegments[i])
        : linkSegments[i]
  }

  return params
}

/**
 * @description 딥링크로 접근 시 Airbridge를 통해 전달받은 deeplink url을 파싱하여 해당 스크린으로 이동시킵니다.
 */
export const handleDeepLink = (navigation: NavigationProp) => {
  Airbridge.deeplink.setDeeplinkListener(async (deeplink) => {
    if (!deeplink) return

    const linkSegments = deeplink.split('?')[0].split('/').slice(2)
    const path = linkSegments[0]
    const selected = linking[path]

    if (path === '') return

    if (!selected) {
      navigation.replace('NotFound')

      return
    }

    if (typeof selected === 'string') {
      navigation.navigate(selected)

      return
    }

    const queryParams = getQueryString(deeplink)
    const parsedQueryParams = getParsedQueryString(queryParams, selected)
    const parsedPathVariables = getParsedPathVariables(linkSegments, selected)

    handleChannelTalkMode(parsedQueryParams)

    navigation.navigate(selected.screen, {
      ...parsedQueryParams,
      ...parsedPathVariables,
    })
  })
}
