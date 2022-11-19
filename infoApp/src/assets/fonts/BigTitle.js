import React from 'react';
import {StyleSheet, Text} from 'react-native';
import PropTypes from 'prop-types';
import {BLUE_COLOR} from 'assets/color/Palette';

const BigTitle = ({text}) => {
  return <Text style={styles.text}>{text}</Text>;
};

BigTitle.prototype = {
  text: PropTypes.string.isRequired,
};

export default BigTitle;

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: BLUE_COLOR,
    fontStyle: 'italic',
    // textDecorationLine: 'underline',
  },
});
