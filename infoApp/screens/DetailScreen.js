import { useNavigation } from "@react-navigation/native";
import { DARK_GREY, GREY_COLOR } from "assets/color/Palette";
import Copyright from "assets/fonts/Copyright";
import axios from "axios";
import HeadTitle from "assets/fonts/HeadTitle";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const DetailScreen = ({
  navigation: { setOptions },
  route: {
    params: { props },
  },
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const navigation = useNavigation();
  const goBackHome = () => {
    navigation.goBack();
  };
  const wateraiInfoImgPath = useCallback(async () => {
    await axios
      .post(`${BASE_URL}/api`, {
        id,
      })
      .then((res) => {
        console.log("res:", res);
        if (res?.data?.ok === true) {
          {
            /* ... */
          }
        } else {
          Alert.alert(`${res?.data?.error}`);
        }
      })
      .catch((e) => Alert.alert(e));
  }, [id]);

  const wateraiInfoUserlike = useCallback(async () => {
    await axios
      .post(`${BASE_URL}/api`, {
        props,
      })
      .then((res) => {
        console.log("res:", res);
        if (res?.data?.ok === true) {
          {
            /* ... */
          }
        } else {
          Alert.alert(`${res?.data?.error}`);
        }
      })
      .catch((e) => Alert.alert(e));
  }, [userId, id, isLiked]);

  const onRefresh = async () => {
    setRefreshing(true);
    await wateraiInfoImgPath();
    setRefreshing(false);
  };

  useEffect(() => {
    setOptions({
      title: props,
    });
    wateraiInfoImgPath();
  }, [props1, props2, props3]);

  return (
    //update: ScrollView => FlatList
    <ScrollView
      style={styles.view}
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
      }
    >
      <Copyright text="text" />
      <View style={styles.hearticonfullview}>
        <View style={styles.headtitleview}>
          <HeadTitle text="text" />
        </View>
        <View style={styles.hearticonview}>
          <TouchableOpacity
            style={styles.hearticon}
            onPress={() => {
              setIsLiked(!isLiked);
            }}
          >
            {isLiked === false ? (
              <Ionicons name="heart-outline" size={20} color={DARK_GREY} />
            ) : (
              <Ionicons name="heart" size={20} color="red" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      {/* { ... } */}
    </ScrollView>
    //update: ScrollView => FlatList
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  view: { flex: 1 },
  image: {
    height: SCREEN_HEIGHT / 3.8,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: GREY_COLOR,
    marginHorizontal: 10,
  },
  headtitleview: {
    flexDirection: "row",
  },
  hearticonview: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
