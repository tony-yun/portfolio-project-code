import {Alert, KeyboardAvoidingView, StyleSheet, Text} from 'react-native';
import React, {useContext, useState} from 'react';
import CommonAuthTextInput from '@/component/CommonAuthTextInput';
import {AuthContext} from '@/AuthContext';
import VerificationViewItem from '@/component/VerificationViewItem';
import {useNavigation} from '@react-navigation/native';
import LoaderView from '@/component/LoaderView';
import {errorMessagesStyle} from '@/theme/errorMessagesStyle';
import {errorMessages} from '@/utils/errorMessages';

const UserDeleteScreen = () => {
  const {currentUser, handleDeleteUser} = useContext(AuthContext);
  const [email, setEmail] = useState<string>(currentUser?.email);
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onDeleteUserPress = () => {
    if (!password) {
      setErrorMessage('입력하지 않은 항목이 있습니다.');
      return;
    }
    Alert.alert(
      '회원탈퇴',
      '정말 회원탈퇴를 하시겠습니까?',
      [
        {
          text: '취소',
          onPress: () => console.log('회원탈퇴 취소'),
          style: 'destructive',
        },
        {
          text: '확인',
          onPress: async () => {
            setIsLoading(true);
            handleDeleteUser(
              email,
              password,
              response => {
                Alert.alert('성공', '계정이 성공적으로 삭제되었습니다.', [
                  {
                    text: '확인',
                    onPress: () => {
                      setIsLoading(false);
                      navigation.navigate('Tabs', {screen: 'HomeScreen'});
                    },
                  },
                ]);
              },
              error => {
                setIsLoading(false);
                errorMessages({error, setErrorMessage});
              },
            );
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <KeyboardAvoidingView style={styles.mainView} behavior="padding">
      {isLoading ? <LoaderView /> : null}
      <CommonAuthTextInput
        value={email}
        setValue={setEmail}
        placeholder={'이메일'}
        unEditable
      />
      <CommonAuthTextInput
        value={password}
        setValue={setPassword}
        placeholder={'비밀번호 재확인'}
        isPassword
      />
      {errorMessage ? (
        <Text style={errorMessagesStyle.errorMessage}>{errorMessage}</Text>
      ) : null}
      <VerificationViewItem
        iconName="exit-outline"
        text="회원탈퇴 하기"
        onPress={onDeleteUserPress}
      />
    </KeyboardAvoidingView>
  );
};

export default UserDeleteScreen;

const styles = StyleSheet.create({
  ...
});
