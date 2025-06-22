/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  BLACK,
  CLOUD_COLOR,
  DEEP_DARK,
  YOUTUBE_PLACEHOLDER,
  YOUTUBE_SEARCH,
} from '@/assets/color/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MovieInfoView from '@/component/MovieInfoView';
import {fetchSearchMovies} from '@/api/fetchMovies';
import {MovieInfoViewProps} from '@/utils/types';
import {useSortStore} from '@/zustand/store';
import ListFooterComponent from '@/component/ListFooterComponent';
import LoaderView from '@/component/LoaderView';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchedMovies, setSearchedMovies] = useState<MovieInfoViewProps[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const sortOption = useSortStore(state => state.sortOption);
  const onChangeText = (text: string) => setSearchText(text);
  const clearText = () => {
    setSearchText('');
  };
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const textInputRef = useRef<TextInput>(null);

  const getSearchMovies = async (query: string) => {
    setIsLoading(true);
    const data = await fetchSearchMovies(query, sortOption);

    if (data.length === 0) {
      setIsLoading(false);
      Alert.alert('알림', '해당 제목의 영화가 없습니다.');
    } else {
      setIsLoading(false);
      setSearchedMovies(data);
    }
  };

  const onSubmit = () => {
    if (searchText === '') {
      return;
    } else {
      dismissKeyboard();
      getSearchMovies(searchText);
    }
  };

  return (
    <View style={styles.searchView}>
      {isLoading && <LoaderView />}
      <View style={styles.textinputView}>
        <Ionicons
          name="search"
          size={20}
          color={YOUTUBE_PLACEHOLDER}
          style={styles.searchIcon}
        />
        <TextInput
          ref={textInputRef}
          placeholder="검색"
          placeholderTextColor={DEEP_DARK}
          style={styles.textinput}
          returnKeyType="search"
          onChangeText={onChangeText}
          value={searchText}
          onSubmitEditing={onSubmit}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={clearText} style={styles.clearTouch}>
            <Ionicons
              name="close-circle"
              size={20}
              color={YOUTUBE_PLACEHOLDER}
            />
          </TouchableOpacity>
        )}
      </View>
      {searchedMovies && (
        <FlatList
          ListHeaderComponent={<View style={{marginTop: 60}} />}
          data={searchedMovies}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={() => <View style={{height: 20}} />}
          renderItem={({item}) => (
            <MovieInfoView
              id={item.id}
              posterPath={item.poster_path}
              title={item.title}
              overview={item.overview}
              releaseDate={item.release_date}
              voteAverage={item.vote_average}
              backdropPath={item.backdrop_path}
            />
          )}
          ListFooterComponent={ListFooterComponent(searchedMovies.length)}
        />
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  ...
