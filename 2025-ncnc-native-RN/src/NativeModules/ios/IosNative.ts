import { NativeModules, Platform } from "react-native";

const { IosNative } = NativeModules;

/**
 * 앱을 강제로 종료합니다.
 *
 * 특수한 경우만 사용하세요.
 */
export const exitApp = () => {
  if (Platform.OS === "ios") {
    IosNative.exitApp();
  }
};

export const setBrightness = async (
  brightness: number
): Promise<boolean | undefined> => {
  if (Platform.OS === "ios") {
    try {
      await IosNative.setBrightness(brightness);
      return true;
    } catch (e) {
      return false;
    }
  }
};

export const getBrightness = async () => {
  if (Platform.OS === "ios") {
    return await IosNative.getBrightness();
  }
};
