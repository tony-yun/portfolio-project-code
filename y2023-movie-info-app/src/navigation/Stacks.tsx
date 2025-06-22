/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DetailScreen from '@/screens/DetailScreen';
import {RootStackParamList} from '@/utils/types';
import {TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {WHITE} from '@/assets/color/colors';
import SettingScreen from '@/screens/SettingScreen';
import SignInScreen from '@/screens/SignInScreen';
import SignUpScreen from '@/screens/SignUpScreen';
import UserSettingScreen from '@/screens/UserSettingScreen';
import UserMovieScreen from '@/screens/UserMovieScreen';
import UserDeleteScreen from '@/screens/UserDeleteScreen';
import UserChangePasswordScreen from '@/screens/UserChangePasswordScreen';
import UserResetPasswordScreen from '@/screens/UserResetPasswordScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const HeaderLeft = ({navigation}) => (
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Ionicons name="arrow-back" color={WHITE} size={25} />
  </TouchableOpacity>
);

const Stacks: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DetailScreen"
        component={DetailScreen}
        options={({navigation}) => ({
          headerLeft: () => <HeaderLeft navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={({navigation}) => ({
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerTitle: '환경설정',
        })}
      />
      <Stack.Screen
        name="SignInScreen"
        component={SignInScreen}
        options={({navigation}) => ({
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerTitle: '로그인',
        })}
      />
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={({navigation}) => ({
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerTitle: '회원가입',
        })}
      />
      <Stack.Screen
        name="UserMovieScreen"
        component={UserMovieScreen}
        options={({navigation}) => ({
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerTitle: '관심 영화',
        })}
      />
      <Stack.Screen
        name="UserSettingScreen"
        component={UserSettingScreen}
        options={({navigation}) => ({
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerTitle: '사용자 설정',
        })}
      />
      <Stack.Screen
        name="UserDeleteScreen"
        component={UserDeleteScreen}
        options={({navigation}) => ({
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerTitle: '회원탈퇴',
        })}
      />
      <Stack.Screen
        name="UserChangePasswordScreen"
        component={UserChangePasswordScreen}
        options={({navigation}) => ({
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerTitle: '비밀번호 변경',
        })}
      />
      <Stack.Screen
        name="UserResetPasswordScreen"
        component={UserResetPasswordScreen}
        options={({navigation}) => ({
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerTitle: '비밀번호 찾기',
        })}
      />
    </Stack.Navigator>
  );
};

export default Stacks;
