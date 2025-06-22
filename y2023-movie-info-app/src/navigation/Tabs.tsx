import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '@/screens/HomeScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchScreen from '@/screens/SearchScreen';
import {useSortStore} from '@/zustand/store';
import {CLOUD_COLOR} from '@/assets/color/colors';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MenuScreen from '@/screens/MenuScreen';

const Tab = createBottomTabNavigator();

type TabBarIconProps = {
  name?: string;
  focused: boolean;
  color: string;
  size: number;
};

const TabBarIcon: React.FC<TabBarIconProps> = ({
  name = '',
  focused,
  color,
  size,
}) => (
  <Ionicons
    name={focused ? name : `${name}-outline`}
    color={color}
    size={size}
  />
);

const createTabBarIcon =
  (name: string) => (props: Omit<TabBarIconProps, 'name'>) =>
    <TabBarIcon name={name} {...props} />;

const Tabs: React.FC = () => {
  const navigation = useNavigation();
  const sortOption = useSortStore(state => state.sortOption);

  const navigateToSettingScreen = () => {
    return (
      <Ionicons
        name="settings-outline"
        size={25}
        color={CLOUD_COLOR}
        style={{marginRight: 15}}
        onPress={() => {
          navigation.navigate('Stacks', {screen: 'SettingScreen'});
        }}
      />
    );
  };

  const getSortOptionKorean = option => {
    switch (option) {
      case 'date_desc':
        return '날짜 최신순';
      case 'date_asc':
        return '날짜 오래된 순';
      case 'rating':
        return '평점 순';
      case 'none':
      default:
        return '기본 순서';
    }
  };
  const renderHeaderRightIcon = () => {
    let iconName;

    switch (sortOption) {
      case 'date_desc':
        iconName = 'sort-calendar-descending';
        break;
      case 'date_asc':
        iconName = 'sort-calendar-ascending';
        break;
      case 'rating':
        iconName = 'star';
        break;
      case 'none':
      default:
        iconName = 'origin';
        break;
    }

    const sortOptionKorean = getSortOptionKorean(sortOption);
    return (
      <MaterialCommunityIcons
        name={iconName}
        size={25}
        color={CLOUD_COLOR}
        style={{marginRight: 15}}
        onPress={() => {
          Alert.alert(
            `현재는 '${sortOptionKorean}' 정렬입니다.`,
            '확인 버튼을 누르면 환경설정으로 이동합니다.',
            [
              {
                text: '취소',
                onPress: () => {},
                style: 'destructive',
              },
              {
                text: '확인',
                onPress: () => {
                  navigation.navigate('Stacks', {screen: 'SettingScreen'});
                },
              },
            ],
            {cancelable: false},
          );
        }}
      />
    );
  };
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 20,
        },
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: '영화',
          tabBarIcon: createTabBarIcon('film'),
          headerTitle: '월드무비',
          headerRight: renderHeaderRightIcon,
        }}
      />
      <Tab.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          tabBarLabel: '찾기',
          tabBarIcon: createTabBarIcon('search'),
          headerTitle: '영화찾기',
          headerRight: renderHeaderRightIcon,
        }}
      />
      <Tab.Screen
        name="MenuScreen"
        component={MenuScreen}
        options={{
          tabBarLabel: '메뉴',
          tabBarIcon: createTabBarIcon('menu'),
          headerTitle: '전체메뉴',
          headerRight: navigateToSettingScreen,
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
