import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  BackHandler,
  Alert,
  Platform,
  View,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import messaging from "@react-native-firebase/messaging";
import PermissionsAndroid from "react-native/Libraries/PermissionsAndroid/PermissionsAndroid";

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      await setupPermissions();

      const token = await messaging().getToken();

      setFcmToken(token);

      await AsyncStorage.setItem("fcmToken", token);

      setIsReady(true);
    };

    init();

    const backAction = () => {
      Alert.alert("종료", "앱을 종료하시겠습니까?", [
        { text: "취소", style: "cancel" },
        { text: "확인", onPress: () => BackHandler.exitApp() },
      ]);

      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  const setupPermissions = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
    }
  };

  if (!isReady) return null;

  return <SafeAreaView>{/* 앱 내용 추가 */}</SafeAreaView>;
};

export default App;
