import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import SubmitButton from "components/SubmitButton";
import Hmedia from "components/Hmedia";
import HeadTitle from "assets/fonts/HeadTitle";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const HomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [resultInfo, setResultInfo] = useState([]); //getting the whole data

  /* getting the token information */
  const [info, setInfo] = useState("");
  const getData = () => {
    try {
      AsyncStorage.getItem("userToken").then((value) => {
        if (value != null) {
          setInfo(jwt_decode(value));
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  console.log(info);
  /* getting the token information finish*/

  const wateraiInfo = async () => {
    await axios
      .post(`${BASE_URL}/api`, {
        props,
      })
      .then((res) => {
        console.log("res:", res);
        if (res?.data?.ok === true) {
          {
            /* { ... } */
          }
        } else {
          Alert.alert(`${res?.data?.error}`);
        }
      })
      .catch((e) => Alert.alert(e));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await wateraiInfo();
    wait(600).then(() => setRefreshing(false));
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
      }
    >
      <HeadTitle text={`{/* { ... } */}`} />
      {resultInfo.map((item) => (
        <Hmedia
          key={item.id} //필수값,unique
          id={item.id}
          path={item.thumbnailPath}
          name={item.rivername}
          recordtype={item.recordtype}
        />
      ))}

      <View style={styles.button}>
        <SubmitButton
          text="text"
          onPress={() => {
            {
              /* { ... } */
            }
          }}
        />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: "23%",
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
