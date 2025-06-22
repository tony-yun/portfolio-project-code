/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {View, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import TopCategorySelect from '@/component/TopCategorySelect';
import {MAINVIEW_TOPCATEGORY} from '@/utils/constants';
import {useCategoryStore, useScrollStore, useSortStore} from '@/zustand/store';
import LoaderView from '@/component/LoaderView';
import MovieInfoView from '@/component/MovieInfoView';
import RefreshCheckModal from '@/component/RefreshCheckModal';
import FloatingTouch from '@/component/FloatingTouch';
import {fetchMovies} from '@/api/fetchMovies';
import {getCurrentDate} from '@/utils/utils';
import ListFooterComponent from '@/component/ListFooterComponent';

const HomeScreen: React.FC<NativeStackScreenProps<any, 'HomeScreen'>> = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [movies, setMovies] = useState({
    now_playing: [],
    popular: [],
    top_rated: [],
    upcoming: [],
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const category = useCategoryStore(state => state.category);
  const sortOption = useSortStore(state => state.sortOption);
  const scrollOption = useScrollStore(state => state.scrollOption);

  const flatListRef = useRef<FlatList>(null);

  const scrollDirection = () => {
    if (scrollOption === 'scroll_top') {
      flatListRef.current?.scrollToOffset({animated: true, offset: 0});
    } else if (scrollOption === 'scroll_bottom') {
      flatListRef.current?.scrollToEnd({animated: true});
    }
  };

  useEffect(() => {
    const fetchAndSetMovies = async () => {
      const sortedData = await fetchMovies(category, sortOption);
      setMovies(prevMovies => ({...prevMovies, [category]: sortedData}));
      setIsLoading(false);
    };

    fetchAndSetMovies();
  }, [category, sortOption]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMovies(category, sortOption);
    setRefreshing(false);
    setLastUpdated(getCurrentDate());
    showSuccessModal();
  };

  const showSuccessModal = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
    }, 1000);
  };

  return isLoading ? (
    <LoaderView />
  ) : (
    <View style={styles.mainView}>
      <TopCategorySelect buttonCategory={MAINVIEW_TOPCATEGORY} />
      <FlatList
        ref={flatListRef}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListHeaderComponent={<View style={{marginTop: 60}} />}
        data={movies[category]}
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
        ListFooterComponent={ListFooterComponent(lastUpdated)}
      />
      <RefreshCheckModal
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
      />
      <FloatingTouch onPress={scrollDirection} iconName={scrollOption} />
    </View>
  );
};

const styles = StyleSheet.create({
  ...
});

export default HomeScreen;
