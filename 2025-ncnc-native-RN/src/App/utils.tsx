import { color, typography } from '@doublenc-inc/nds-core'
import { BlurView } from '@react-native-community/blur'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import type { RouteProp } from '@react-navigation/native'
import { StackNavigationOptions } from '@react-navigation/stack'
import { StackHeaderOptions } from '@react-navigation/stack/lib/typescript/src/types'
import { omit } from 'lodash'
import React from 'react'
import {
  Dimensions,
  Platform,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import { EdgeInsets } from 'react-native-safe-area-context'
import HeaderLeft from '../components/public/HeaderLeft'
import HeaderRight from '../components/public/HeaderRight'
import NcncText from '../components/public/NcncText'
import NdsIcon from '../components/public/NdsIcon'
import { HEADER_HEIGHT } from '../public/constants'
import {
  AllScreenList,
  MainStackScreenList,
  TabStackScreenList,
} from '../public/types/navigations.types'

export const getHeaderOptions = (
  insetTop: number,
  routeName: keyof AllScreenList,
): StackHeaderOptions => ({
  headerLeft: HeaderLeft,
  headerRight: HeaderRight,
  headerTitle: '',
  headerBackTitleVisible: false,
  headerShadowVisible: false,
  headerTintColor: color.gray.gray900,
  headerStyle: [
    s.header,
    {
      height: insetTop + HEADER_HEIGHT,
      backgroundColor:
        color.gray[
          ['MyTab', 'NiconMoneyReward'].includes(routeName) ? 'gray50' : 'white'
        ],
    },
  ],
  headerTitleStyle: s.headerTitle,
})

export const getTabBarStyles = (insetBottom: number) => {
  const spacing = 8
  const paddingBottom = insetBottom > 0 ? insetBottom : spacing
  const height = spacing + TAB_ITEM_HEIGHT + paddingBottom

  const styles: StyleProp<ViewStyle> = {
    position: 'absolute',
    height,
    paddingTop: spacing,
    paddingBottom: paddingBottom, // override default paddingBottom value (30px)
    borderTopWidth: 1,
    borderColor: color.gray.gray400,
  }

  return styles
}

export const getTabViewScreenOptions = (
  route: RouteProp<TabStackScreenList, keyof TabStackScreenList>,
  insets: EdgeInsets,
) => {
  const { top: insetTop, bottom: insetBottom } = insets

  const getTabName = (screenName: keyof TabStackScreenList) => {
    switch (screenName) {
      case 'HomeTab':
        return '홈'
      case 'SearchTab':
        return '검색'
      case 'SellTab':
        return '판매'
      case 'RewardTab':
        return '혜택'
      case 'MyTab':
        return '마이'
      default:
        return
    }
  }

  const options: BottomTabNavigationOptions = {
    ...getHeaderOptions(insetTop, route.name),
    tabBarIcon: (tab) => {
      const { focused } = tab
      const keyFromRouteName = route.name
        .replace(/Tab$/, '')
        .toLowerCase() as keyof TabStackScreenList extends `${infer U}Tab`
        ? Lowercase<U>
        : never

      switch (keyFromRouteName) {
        case 'home':
          return focused ? (
            <NdsIcon group="navigation" name="home" color="gray900" size={32} />
          ) : (
            <NdsIcon group="navigation" name="home" color="gray400" size={32} />
          )
        case 'reward':
          //...
        case 'search':
          // ...
        case 'sell':
          // ...
        case 'my':
          // ...
      }
    },
    tabBarLabel: (tab) => {
      const { focused } = tab

      return (
        <NcncText
          style={[
            s.tabBarLabelText,
            {
              color: focused ? color.gray.gray900 : color.gray.gray500,
            },
            focused && { fontWeight: '700' },
          ]}
        >
          {getTabName(route.name)}
        </NcncText>
      )
    },
    tabBarBackground:
      Platform.OS === 'ios'
        ? () => (
            <BlurView
              blurType="light"
              style={s.tabBarBlurView}
              reducedTransparencyFallbackColor="white"
            />
          )
        : undefined,
    tabBarStyle: getTabBarStyles(insetBottom),
    tabBarItemStyle: s.tabBarItem,
    tabBarIconStyle: s.tabBarIcon,
  }

  return options
}

export const getStackScreenOptions = (
  insetTop: number,
  route: RouteProp<MainStackScreenList>,
) => {
  const options: StackNavigationOptions = {
    ...getHeaderOptions(insetTop, route.name),
    cardStyle: {
      backgroundColor: color.gray.white,
    },
  }

  return options
}

export const webViewScreenOptions: StackNavigationOptions = {
  headerShown: false,
  animationEnabled: Platform.select({
    ios: true,
    android: false,
  }),
}

const s = StyleSheet.create({
  tabBarLabelText: {
    ...typography.caption['caption3-12-regular'],
  },
  tabBarBlurView: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.87)',
  },
  tabBarItem: {
    height: TAB_ITEM_HEIGHT,
    flexDirection: 'column',
  },
  tabBarIcon: {
    width: TAB_ICON_SIZE,
    height: TAB_ICON_SIZE,
  },
  header: {
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    ...omit(typography.subtitle['subtitle2-16-bold'], 'fontWeight'),
    maxWidth: Dimensions.get('window').width * 0.45,
    fontFamily: 'SpoqaHanSansNeo-Bold',
  },
  modalHeaderTitle: {
    ...Platform.select({
      ios: {
        marginTop: 0,
      },
      android: {
        marginTop: 18,
      },
    }),
  },
  headerBackIcon: {
    ...Platform.select({
      ios: {
        marginLeft: 18,
        marginTop: 0,
      },
      android: {
        marginLeft: 12,
        marginTop: 20,
      },
    }),
  },
})
