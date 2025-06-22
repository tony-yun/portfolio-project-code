import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {BUTTON_BLUE, CLOUD_COLOR} from '@/assets/color/colors';

type CommonAuthTouchProps = {
  title: string;
  onPress: () => void;
};

const CommonAuthTouch = ({title, onPress}: CommonAuthTouchProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonTouch}>
      <Text style={styles.buttonTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CommonAuthTouch;

const styles = StyleSheet.create({
 ...
});
