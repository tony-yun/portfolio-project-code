import { NativeModules, Platform } from "react-native";

const { AndroidNative } = NativeModules;

/**
 * 앱을 백그라운드 상태로 변경합니다.
 */
export const goBackground = () => {
  if (Platform.OS === "android") {
    AndroidNative.goBackground();
  }
};

/**
 * 앱을 강제로 종료합니다.
 *
 * 특수한 경우만 사용하세요.
 */
export const exitApp = () => {
  if (Platform.OS === "android") {
    AndroidNative.exitApp();
  }
};

/**
 * @description 기기 밝기를 설정합니다.
 */
export const setBrightnessAsync = async (brightness: number) => {
  if (Platform.OS === "android") {
    try {
      await AndroidNative.setBrightnessAsync(brightness);
      return true;
    } catch (e) {
      return false;
    }
  }
};

/**
 * @description 설정한 기기 밝기를 불러옵니다. default Brightness === 0
 */
export const getBrightnessAsync = async () => {
  return await AndroidNative.getBrightness();
};
