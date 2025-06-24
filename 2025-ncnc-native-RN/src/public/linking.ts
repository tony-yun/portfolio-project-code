import { LinkingPathConfigMap } from './public/types/linking.types'
import {
  MainStackScreenList,
  TabStackScreenList,
} from './public/types/navigations.types'
import { AfterSellStatus } from './public/types/sell/status.types'
import { TroubleProgressStatusType } from './public/types/trouble.types'

type ScreenList = keyof TabStackScreenList | keyof MainStackScreenList
type Linking = Record<string, ScreenList | LinkingPathConfigMap>

const linking: Linking = {
  home: 'HomeTab',
  search: {
    screen: 'SearchTab',
    path: 'search',
    parse: {
      query: (query: string) => decodeURIComponent(query),
    },
  },
  'nicon-money-reward': {
    screen: 'NiconMoneyReward',
    path: 'nicon-money-reward',
    parse: {
      module: (module: string) => module,
    },
  },
  'my-page': 'MyTab',
  sell: 'SellTab',
  categories: {
    screen: 'Categories',
    path: 'categories/:category1Id',
    parse: {
      category1Id: (category1Id: string) =>
        category1Id === 'soon' || category1Id === 'new'
          ? category1Id
          : Number(category1Id),
    },
  },
  'all-categories': 'AllCategories',
  brands: {
    screen: 'ItemList',
    path: 'brands/:conCategory2Id',
    parse: {
      conCategory2Id: (conCategory2Id: string) => Number(conCategory2Id),
    },
  },
  items: {
    screen: 'ItemDetail',
    path: 'items/:itemId/:conCategory2Id?',
    parse: {
      itemId: (itemId: string) => Number(itemId),
      conCategory2Id: (conCategory2Id: string) => Number(conCategory2Id),
    },
  },
  // ...
  '*': 'NotFound',
}

export default linking
