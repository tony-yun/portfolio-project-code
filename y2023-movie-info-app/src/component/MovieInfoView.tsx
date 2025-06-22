import React from 'react';
import PosterImage from './PosterImage';
import VotesText from './VotesText';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GRAY, TEXT_BACK_BLUR_COLOR, WHITE} from '@/assets/color/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MovieInfoViewProps, RootStackParamList} from '@/utils/types';
import {makeImagePath} from '@/utils/utils';

const MovieInfoView: React.FC<MovieInfoViewProps> = ({
  id,
  posterPath,
  title,
  overview,
  releaseDate,
  voteAverage,
  backdropPath,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const goDetailView = () => {
    navigation.navigate('Stacks', {
      screen: 'DetailScreen',
      params: {
        title: title,
        id: id,
      },
    });
  };

  return (
    <ImageBackground
      source={{uri: makeImagePath(backdropPath)}}
      style={styles.backgroundImage}
      blurRadius={2}>
      <View style={styles.infoMainView}>
        <PosterImage path={posterPath} />
        <View style={styles.rightTextView}>
          <Text style={styles.titleText}>
            {title.length > 25 ? `${title.slice(0, 25)}...` : title}
          </Text>
          <View style={styles.dateAndVoteView}>
            {releaseDate ? (
              <Text style={styles.releaseText}>
                {new Date(releaseDate).toLocaleDateString('ko', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            ) : null}
            {voteAverage ? <VotesText votes={voteAverage} /> : null}
          </View>
          <Text style={styles.overviewText}>
            {overview !== '' && overview.length > 80
              ? `${overview.slice(0, 80)}...`
              : overview}
          </Text>
          <TouchableOpacity
            style={styles.viewDetailTouch}
            onPress={goDetailView}>
            <Text style={styles.viewDetailTouchText}>상세정보 보기</Text>
            <Ionicons name="arrow-forward" color={GRAY} size={17} />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  ...
});

export default MovieInfoView;
