import React from 'react';
import {StyleSheet, Text} from 'react-native';

const HeadTitle = ({text}) => {
  return <Text style={styles.text}>{text}</Text>;
};

export default HeadTitle;

const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginVertical: 10,
  },
});
