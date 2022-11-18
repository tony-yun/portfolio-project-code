import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IMAGE_URL } from "api/Url";
import { DARK_GREY, GREY_COLOR } from "assets/color/Palette";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Hmedia = ({ props }) => {
  const navigation = useNavigation();
  const GoToDetail = () => {
    navigation.navigate("DetailStack", {
      screen: "DetailScreen",
      params: { props },
    });
  };
  return (
    <TouchableOpacity onPress={GoToDetail}>
      <View style={styles.Hview}>
        <View>
          <Image
            style={styles.image}
            source={{ uri: `${IMAGE_URL + thumbnailPath}` }}
          />
        </View>
        <View style={styles.Hcolumn}>
          <Text style={styles.title}>text</Text>
          <Text style={styles.location}>text</Text>
          <View style={styles.recordtypeview}>
            <Text style={styles.recordtype}>text</Text>
          </View>
          <View style={styles.icon}>
            <Ionicons name="heart" size={20} color="red" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Hmedia;

const styles = StyleSheet.create({
  Hview: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: GREY_COLOR,
    borderRadius: 5,
    marginHorizontal: 15,
  },
  location: {
    color: DARK_GREY,
    width: "75%",
    fontSize: 15,
    paddingRight: 12,
  },
  recordtypeview: {
    paddingTop: "5%",
  },
  recordtype: { color: DARK_GREY, fontStyle: "italic" },
  icon: { justifyContent: "center", alignSelf: "center", flexDirection: "row" },
});
