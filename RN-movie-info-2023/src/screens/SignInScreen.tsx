import {KeyboardAvoidingView, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useState} from 'react';
import {DEEP_DARK, YOUTUBE_PLACEHOLDER} from '@/assets/color/colors';
import CommonAuthTouch from '@/component/CommonAuthTouch';
import {useNavigation} from '@react-navigation/native';
import CommonAuthTextInput from '@/component/CommonAuthTextInput';
import SignInUpTopView from '@/component/SignInUpTopView';
import {errorMessages} from '@/utils/errorMessages';
import LoaderView from '@/component/LoaderView';
import VerificationViewItem from '@/component/VerificationViewItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '@/AuthContext';
import {errorMessagesStyle} from '@/theme/errorMessagesStyle';

const SignInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {handleSignIn} = useContext(AuthContext);

  const onSignInPress = () => {
    if (!email || !password) {
      setErrorMessage('입력하지 않은 항목이 있습니다.');
      return;
    }
    setIsLoading(true);
    handleSignIn(
      email,
      password,
      response => {
        setIsLoading(false);
        navigation.navigate('Tabs', {screen: 'MenuScreen'});
      },
      error => {
        setIsLoading(false);
        errorMessages({error, setErrorMessage});
      },
    );
  };

  return (
    <KeyboardAvoidingView style={styles.mainView} behavior="padding">
      {isLoading && <LoaderView />}
      <SignInUpTopView />
      <CommonAuthTextInput
        value={email}
        setValue={setEmail}
        placeholder={'이메일'}
      />
      <CommonAuthTextInput
        value={password}
        setValue={setPassword}
        placeholder={'비밀번호'}
        isPassword
      />
      {errorMessage ? (
        <Text style={errorMessagesStyle.errorMessage}>{errorMessage}</Text>
      ) : null}
      <View style={styles.authTouchView}>
        <CommonAuthTouch title="로그인" onPress={onSignInPress} />
      </View>

      <View style={styles.authTouchView}>
        <Text style={styles.signUpText}>
          아직 회원으로 등록되지 않으셨나요?
        </Text>
        <CommonAuthTouch
          title="회원가입 →"
          onPress={() => {
            navigation.navigate('SignUpScreen');
          }}
        />
      </View>
      <Text style={styles.findPasswordText}>비밀번호를 잊어버리셨나요?</Text>
      <VerificationViewItem
        iconName="lock-closed-outline"
        text="비밀번호 재설정"
        onPress={() => {
          navigation.navigate('UserResetPasswordScreen');
        }}>
        <Ionicons name="arrow-forward" size={25} color={YOUTUBE_PLACEHOLDER} />
      </VerificationViewItem>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
 ...
});
