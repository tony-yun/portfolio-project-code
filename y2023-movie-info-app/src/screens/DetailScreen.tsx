/* eslint-disable react/no-unstable-nested-components */
import {Alert, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DetailMoviesProps, RootStackParamList} from '@/utils/types';
import {fetchDetailMovies} from '@/api/fetchMovies';
import {makeImagePath} from '@/utils/utils';
import {SCREEN_HEIGHT} from '@/utils/constants';
import {
  CLOUD_COLOR,
  DEEP_DARK,
  MIDNIGHT_BLUE,
  RED,
  YOUTUBE_SEARCH,
} from '@/assets/color/colors';
import {AuthContext} from '@/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';

type DetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'DetailScreen'
>;

const DetailScreen: React.FC<DetailScreenProps> = ({
  navigation: {setOptions},
  route: {
    params: {title, id},
  },
}) => {
  const [detailMovies, setDetailMovies] = useState<DetailMoviesProps>();
  const [isFavorite, setIsFavorite] = useState(false);
  const {userFavoriteArray, setUserFavoriteArray, currentUser} =
    useContext(AuthContext);

  useEffect(() => {
    setIsFavorite(userFavoriteArray.includes(id));

    console.log('id:', id);
    const getDetailMovies = async () => {
      const data = await fetchDetailMovies(id);
      console.log('data:', data);
      setDetailMovies(data);
    };

    setOptions({
      title: title,
      headerRight: () => (
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={25}
          color={isFavorite ? RED : CLOUD_COLOR}
          onPress={toggleFavorite}
        />
      ),
    });
    getDetailMovies();
  }, [id, title, isFavorite, userFavoriteArray]);

  const toggleFavorite = () => {
    if (!currentUser || !currentUser?.emailVerified) {
      Alert.alert(
        '알림',
        '로그인 및 이메일 인증을 완료해야 사용할 수 있습니다.',
      );
      return;
    }
    const updatedFavorites = isFavorite
      ? userFavoriteArray.filter(favId => favId !== id)
      : [...userFavoriteArray, id];

    setUserFavoriteArray(updatedFavorites);
    setIsFavorite(!isFavorite);

    const userFavoritesRef = database().ref(
      `/userFavorites/${currentUser.uid}`,
    );
    userFavoritesRef
      .set(updatedFavorites)
      .then(() => {
        console.log('Favorites updated successfully!');
      })
      .catch(error => {
        console.log('Error updating favorites:', error);
        Alert.alert('에러', error);
      });
  };

  return (
    <ScrollView style={styles.mainScrollView}>
     ...
      </View>
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  ...
});
