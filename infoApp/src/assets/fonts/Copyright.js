import React from 'react';
import {StyleSheet, Text} from 'react-native';
import PropTypes from 'prop-types';
import {COPYRIGHT} from 'assets/color/Palette';

const Copyright = ({
  text,
  isUnderLine,
  onSignUpScreen,
  isItalic,
  isLoading,
}) => {
  return (
    <Text style={styles(isUnderLine, onSignUpScreen, isItalic, isLoading).text}>
      {text}
    </Text>
  );
};

Copyright.prototype = {
  text: PropTypes.string.isRequired,
};

export default Copyright;

const styles = (isUnderLine, onSignUpScreen, isItalic, isLoading) =>
  StyleSheet.create({
    text: {
      fontSize: onSignUpScreen ? 13 : 15,
      fontWeight: '600',
      color: COPYRIGHT,
      marginLeft: onSignUpScreen ? 0 : 10,
      marginTop: onSignUpScreen ? 0 : isLoading ? 10 : 5,
      textAlign: 'center',
      textDecorationLine: isUnderLine ? 'underline' : 'none',
      fontStyle: isItalic ? 'italic' : 'normal',
    },
  });
