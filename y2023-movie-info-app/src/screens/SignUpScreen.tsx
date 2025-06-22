import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import CommonAuthTouch from '@/component/CommonAuthTouch';
import CommonAuthTextInput from '@/component/CommonAuthTextInput';
import SignInUpTopView from '@/component/SignInUpTopView';
import {errorMessages} from '@/utils/errorMessages';
import LoaderView from '@/component/LoaderView';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '@/AuthContext';
import {errorMessagesStyle} from '@/theme/errorMessagesStyle';

const SignUpScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [checkPassword, setCheckPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const {handleSignUp} = useContext(AuthContext);

  const onSignUpPress = () => {
    if (!email || !password || !checkPassword) {
      setErrorMessage('입력하지 않은 항목이 있습니다.');
      return;
    } else if (password !== checkPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    setIsLoading(true);
    handleSignUp(
      email,
      password,
      response => {
        setIsLoading(false);
        Alert.alert(
          '회원가입 완료!',
          '이메일 인증을 완료하고 좋아하는 영화를 저장하세요.',
          [
            {
              text: '확인',
              onPress: () => {
                navigation.navigate('Tabs', {screen: 'MenuScreen'});
              },
            },
          ],
        );
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
      <CommonAuthTextInput
        value={checkPassword}
        setValue={setCheckPassword}
        placeholder={'비밀번호 확인'}
        isPassword
      />
      {errorMessage ? (
        <Text style={errorMessagesStyle.errorMessage}>{errorMessage}</Text>
      ) : null}
      <View style={styles.authTouchView}>
        <CommonAuthTouch title="회원가입" onPress={onSignUpPress} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  ...
});
