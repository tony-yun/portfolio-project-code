import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import CommonAuthTouch from '@/component/CommonAuthTouch';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {
  CLOUD_COLOR,
  GREEN,
  RED,
  YOUTUBE_PLACEHOLDER,
} from '@/assets/color/colors';
import {AuthContext} from '@/AuthContext';
import {obscureEmailDomain} from '@/utils/utils';
import VerificationViewItem from '@/component/VerificationViewItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoaderView from '@/component/LoaderView';
import {errorMessages} from '@/utils/errorMessages';
import {errorMessagesStyle} from '@/theme/errorMessagesStyle';
import SignInUpTopView from '@/component/SignInUpTopView';

const MenuScreen = () => {
  const navigation = useNavigation();
  const {currentUser, sendEmailVerification, refreshUser} =
    useContext(AuthContext);
  const [showFullEmail, setShowFullEmail] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const isFocused = useIsFocused();

  const toggleShowFullEmail = () => {
    setShowFullEmail(!showFullEmail);
  };

  const handleSendVerifyEmail = () => {
    if (!currentUser?.emailVerified) {
      setIsLoading(true);
      sendEmailVerification(
        response => {
          setIsLoading(false);
          Alert.alert(
            '이메일 인증 링크를 보냈습니다.',
            '이메일로 이동하셔서 인증을 완료해주세요.',
          );
        },
        error => {
          setIsLoading(false);
          errorMessages({error, setErrorMessage});
        },
      );
    } else {
      Alert.alert('인증 완료', '이미 인증 완료된 이메일입니다.');
    }
  };

  useEffect(() => {
    if (isFocused) {
      refreshUser();
    }
    console.log('currentUser:', currentUser);
    console.log('emailVerified:', currentUser?.emailVerified);
  }, [isFocused]);

  return (
    <View style={styles.mainView}>
      {isLoading && <LoaderView />}
      {!currentUser && (
        <View style={styles.beforeSignInView}>
          <CommonAuthTouch
            title="로그인 / 회원가입"
            onPress={() => {
              navigation.navigate('Stacks', {screen: 'SignInScreen'});
            }}
          />
          <Text style={styles.infoText}>
            로그인하시고 마음에 드는 영화를 저장하세요.{'\n'}개인화된 찜
            목록으로 더 풍부한 영화 경험을 즐기실 수 있습니다!
          </Text>
        </View>
      )}
      {currentUser && (
        <>
          <SignInUpTopView fromMenuScreen />
          <VerificationViewItem
            iconName="person-outline"
            text={
              showFullEmail
                ? currentUser?.email
                : obscureEmailDomain(currentUser?.email)
            }
            onPress={toggleShowFullEmail}>
            <Ionicons
              name={showFullEmail ? 'eye-outline' : 'eye-off-outline'}
              size={25}
              color={YOUTUBE_PLACEHOLDER}
            />
          </VerificationViewItem>
          <VerificationViewItem
            iconName="mail-outline"
            text="이메일 인증"
            onPress={handleSendVerifyEmail}>
            <>
              <Text style={styles.verifyText}>
                {currentUser?.emailVerified ? '완료' : '미완료'}
              </Text>
              {currentUser?.emailVerified ? (
                <Ionicons name="checkmark-circle" size={25} color={GREEN} />
              ) : (
                <Ionicons name="close-circle-sharp" size={25} color={RED} />
              )}
            </>
          </VerificationViewItem>
          {errorMessage ? (
            <Text style={errorMessagesStyle.errorMessage}>{errorMessage}</Text>
          ) : null}
          <VerificationViewItem
            iconName="heart-outline"
            text="관심 영화"
            onPress={() => {
              currentUser?.emailVerified
                ? navigation.navigate('Stacks', {screen: 'UserMovieScreen'})
                : Alert.alert(
                    '알림',
                    '이메일 인증을 완료해야 사용할 수 있습니다.',
                  );
            }}>
            <Ionicons
              name="arrow-forward"
              size={25}
              color={YOUTUBE_PLACEHOLDER}
            />
          </VerificationViewItem>
          <VerificationViewItem
            iconName="people-outline"
            text="사용자 설정"
            onPress={() => {
              navigation.navigate('Stacks', {screen: 'UserSettingScreen'});
            }}>
            <Ionicons
              name="arrow-forward"
              size={25}
              color={YOUTUBE_PLACEHOLDER}
            />
          </VerificationViewItem>
        </>
      )}
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  ...
});
