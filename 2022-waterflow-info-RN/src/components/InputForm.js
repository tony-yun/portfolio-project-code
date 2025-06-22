import React from "react";
import { Platform, StyleSheet, TextInput, View } from "react-native";
import PropTypes from "prop-types";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { GREY_COLOR } from "assets/color/Palette";

const InputForm = ({ props }) => {
  return (
    <View style={styles.view}>
      {isUsername ? (
        <FontAwesome name="user" size={20} color="black" />
      ) : isEmail ? (
        <MaterialCommunityIcons name="email" size={20} color="black" />
      ) : isPhonenumber ? (
        <FontAwesome name="phone" size={20} color="black" />
      ) : isPassword || isVerifyPassword ? (
        <FontAwesome name="lock" size={20} color="black" />
      ) : null}
      <TextInput
        style={styles.textinput}
        placeholder={placeholder}
        placeholderTextColor="grey"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        value={value}
        onChangeText={
          isUsername
            ? (text) => setUsername(text)
            : isEmail
            ? (text) => setEmail(text)
            : isPhonenumber
            ? (text) => setPhonenumber(text)
            : isPassword
            ? (text) => setPassword(text)
            : isVerifyPassword
            ? (text) => setVerifyPassword(text)
            : null
        }
        secureTextEntry={isPassword || isVerifyPassword ? true : false}
        keyboardType={
          isPhonenumber ? "number-pad" : isEmail ? "email-address" : "default"
        }
        maxLength={isPhonenumber ? 11 : null}
      />
    </View>
  );
};

export const MemoInputForm = React.memo(InputForm);
InputForm.prototype = {
  placeholder: PropTypes.string,
  isPassword: PropTypes.bool,
};

const styles = StyleSheet.create({
  view: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  textinput: {
    backgroundColor: GREY_COLOR,
    padding: Platform.OS === "android" ? 10 : 15,
    borderRadius: 50,
    width: "70%",
    margin: 10,
    borderWidth: 0.2,
    borderColor: "grey",
  },
});
