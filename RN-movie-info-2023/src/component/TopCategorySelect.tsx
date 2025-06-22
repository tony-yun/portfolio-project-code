/* eslint-disable react-native/no-inline-styles */
import {ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {BLACK, BUTTON_BLUE, CLOUD_COLOR, WHITE} from '@/assets/color/colors';
import {useCategoryStore} from '@/zustand/store';

interface TopCategorySelectProps {
  buttonCategory: string[];
}

const TopCategorySelect: React.FC<TopCategorySelectProps> = ({
  buttonCategory,
}) => {
  const [selectedButton, setSelectedButton] = useState<string>('now_playing');
  const setCategory = useCategoryStore(state => state.setCategory);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingLeft: 15,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}>
      {buttonCategory.map(buttonId => (
        <TouchableOpacity
          key={buttonId}
          style={[
            styles.categoryButton,
            selectedButton === buttonId
              ? styles.selectedButton
              : styles.unselectedButton,
          ]}
          onPress={() => {
            setSelectedButton(buttonId);
            setCategory(buttonId);
          }}>
          <Text
            style={
              selectedButton === buttonId
                ? styles.selectedButtonText
                : styles.unselectedButtonText
            }>
            {buttonId === 'now_playing'
              ? '🎬현재상영'
              : buttonId === 'popular'
              ? '🔥인기차트'
              : buttonId === 'top_rated'
              ? '⭐️극찬영화'
              : buttonId === 'upcoming'
              ? '🎥상영예정'
              : null}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default TopCategorySelect;

const styles = StyleSheet.create({
  ...
});
