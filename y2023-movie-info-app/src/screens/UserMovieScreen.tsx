/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '@/AuthContext';
import {MovieInfoViewProps} from '@/utils/types';
import LoaderView from '@/component/LoaderView';
import {fetchfavoriteMovies} from '@/api/fetchMovies';
import MovieInfoView from '@/component/MovieInfoView';
import {YOUTUBE_PLACEHOLDER} from '@/assets/color/colors';

const UserMovieScreen = () => {
  const {userFavoriteArray} = useContext(AuthContext);
  const [favoriteMovies, setFavoriteMovies] = useState<MovieInfoViewProps[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('User Favorite Movies IDs:', userFavoriteArray);
  }, [userFavoriteArray]);

  useEffect(() => {
    const fetchAndSetMovies = async () => {
      const data = await fetchfavoriteMovies(userFavoriteArray);
      console.log('fetchedData:', data);
      setFavoriteMovies(data);
      setIsLoading(false);
    };

    fetchAndSetMovies();
  }, [userFavoriteArray]);

  return (
    <View style={styles.mainView}>
      {isLoading && <LoaderView />}
      {!isLoading && favoriteMovies.length > 0 ? (
        <FlatList
          data={favoriteMovies}
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
        />
      ) : (
        !isLoading && (
          <View style={styles.announceView}>
            <Text style={styles.announceText}>
              마음에 드는 영화를 선별하여 {'\n'}나만의 컬렉션을 만들어 보세요.
            </Text>
          </View>
        )
      )}
    </View>
  );
};

export default UserMovieScreen;

const styles = StyleSheet.create({
  ...
});
