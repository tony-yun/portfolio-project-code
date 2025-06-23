import type { TextStyle, ViewStyle } from "react-native";
import type { ButtonConfig, PDTButtonProps } from "./general.types";

const basicButtonVariant = {
  primary: "primary",
  secondaryLineRed: "secondary-line-red",
  secondaryLineGray: "secondary-line-gray",
  secondaryFillGray: "secondary-fill-gray",
  secondaryFillOrange: "secondary-fill-orange",
} as const;

export type BasicButtonVariant =
  (typeof basicButtonVariant)[keyof typeof basicButtonVariant];

export interface BasicButtonConfig extends ButtonConfig<BasicButtonVariant> {
  text: string;
}

export interface BasicButtonBaseOption {
  viewStyle: ViewStyle;
  textStyle: TextStyle;
}

export type BasicButtonProps = PDTButtonProps & BasicButtonConfig;

export type BasicButtonBaseProps = BasicButtonProps & BasicButtonBaseOption;
