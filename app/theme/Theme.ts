import { TextStyle, ViewStyle } from "react-native";
import { Overrides } from "app/utils/Overrides";
import { DeepPartial } from "app/utils/types";
import { StringUnion } from "app/utils/helpers";
import {
  SpacingOverride,
  PositionerOverrides,
  RowOverride,
  AlertOverrides,
  ColumnOverride,
  ContainerOverride,
  DividerOverride,
  HeadingOverride,
  LabelOverrides,
  PickerOverrides,
  TextInputOverrides,
  TextOverride,
  PopoverOverrides
} from "components/index";

import { ButtonOverrides } from "components/Button/ThemedButton";

export interface Theme {
  // Colors
  colors: Colors;
  fills: Fills;

  // Layout
  layout: Layout;
  spacing: SpacingSizes;

  // Typography
  fontFamilies: FontFamilies;
  fontWeights: FontWeights;

  headingSizes: HeadingSizes;
  paragraphSizes: ParagraphSizes;
  textSizes: TextSizes;

  // Elevations
  elevations: Elevations;

  // Controls - Buttons, Pickers, Inputs etc.
  controlPaddings: ControlSizes;
  controlHeights: ControlSizes;
  controlBorderRadius: ControlSizes;

  // Containers
  containerShapes: ContainerShapes;

  overrides?: DeepPartial<ThemeOverrides>;
}

export interface ViewportSize {
  width: number;
  height: number;
  scale?: number;
  fontScale?: number;
}

export interface Breakpoints {
  small?: ViewportSize;
  medium?: ViewportSize;
  large?: ViewportSize;
  xlarge?: ViewportSize;
}

export interface ScreenSizes extends Breakpoints {
  xsmall?: ViewportSize;
}

export type ColumnCount =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24;

export interface ContainerSizes {
  small: number;
  medium: number;
  large: number;
  xlarge: number;
}

export type Breakpoint = keyof ScreenSizes;
export type ContainerSize = keyof ContainerSizes;
export type ScreenSize = keyof ScreenSizes;

export interface Layout {
  breakpoints: ScreenSizes;
  gridColumnCount: ColumnCount;
  gutterWidth: number;
  containerSizes: ContainerSizes;
}

export interface TextSizes {
  xsmall: TextStyle;
  small: TextStyle;
  medium: TextStyle;
  large: TextStyle;
}
export type TextSize = keyof TextSizes;

export interface HeadingSizes {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  h5: TextStyle;
  h6: TextStyle;

  [size: string]: TextStyle | undefined;
}

export type HeadingSize = keyof HeadingSizes;

export interface ParagraphSizes {
  small: TextStyle;
  medium: TextStyle;
  large: TextStyle;

  [size: string]: TextStyle | undefined;
}

export type ParagraphSize = keyof ParagraphSizes;

export interface SpacingSizes {
  xxxxlarge: number;
  xxxlarge: number;
  xxlarge: number;
  xlarge: number;
  large: number;
  medium: number;
  small: number;
  xsmall: number;
  xxsmall: number;
}

export type SpacingSize = keyof SpacingSizes;

export interface FontFamilies {
  heading: string;
  mono: string;
  text: string;
}

export type FontFamily = keyof FontFamilies;

export type RNFontWeight =
  | "normal"
  | "bold"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

export interface FontWeights {
  light?: RNFontWeight;
  normal?: RNFontWeight;
  bold?: RNFontWeight;
}

export type FontWeight = keyof FontWeights | RNFontWeight;

export interface TextColors {
  muted: string;
  default: string;

  link: string;
  white: string;
  selected: string;

  primary: string;
  secondary: string;

  danger: string;
  info: string;
  success: string;
  warning: string;
}

export const TextColorUnion = StringUnion(
  "muted",
  "link",
  "white",
  "selected",
  "primary",
  "secondary",
  "danger",
  "info",
  "warning",
  "success"
);

export type TextColor = keyof TextColors | string;

export interface ButtonColors {
  danger: string;
  default: string;
  disabled: string;
  primary: string;
  secondary: string;
}

export interface ButtonColorsWithText extends ButtonColors {
  dangerText: string;
  defaultText: string;
  disabledText: string;
  primaryText: string;
  secondaryText: string;
}

export type ButtonColor = keyof ButtonColors | string;

export interface BorderColors {
  danger: string;
  default: string;
  muted: string;
  info: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
}

export type BorderColor = keyof BorderColors | string;

export interface BackgroundColors {
  content: string;
  base: string;

  greyLight: string;
  greyDefault: string;
  greyDark: string;

  primaryLight: string;
  primaryDefault: string;
  primaryDark: string;

  secondaryLight: string;
  secondaryDefault: string;
  secondaryDark: string;

  dangerLight: string;
  dangerDefault: string;
  dangerDark: string;

  infoLight: string;
  infoDefault: string;
  infoDark: string;

  successLight: string;
  successDefault: string;
  successDark: string;

  warningLight: string;
  warningDefault: string;
  warningDark: string;
  [field: string]: string;
}

export type BackgroundColor = Exclude<keyof BackgroundColors, number>;

export interface Colors {
  background: BackgroundColors;
  border: BorderColors;
  button: ButtonColorsWithText;
  text: TextColors;
}
export type Elevation = ViewStyle;
export type Elevations = Elevation[];

export interface ControlSizes {
  small: number;
  medium: number;
  large: number;
}

export type ControlSize = keyof ControlSizes;

export interface FillColorProps {
  backgroundColor: string;
  color: string;
}

export interface FillColors {
  neutral: FillColorProps;
  blue: FillColorProps;
  red: FillColorProps;
  orange: FillColorProps;
  yellow: FillColorProps;
  green: FillColorProps;
  teal: FillColorProps;
  purple: FillColorProps;
}

export type FillColor = keyof FillColors;

export interface Fills {
  subtle: FillColors;
  solid: FillColors;
}

export interface ContainerShapes {
  circle: ViewStyle;
  pill: ViewStyle;
  rounded: ViewStyle;
  roundedBottom: ViewStyle;
  roundedLeft: ViewStyle;
  roundedRight: ViewStyle;
  roundedTop: ViewStyle;
  square: ViewStyle;
  ellipticalPill: ViewStyle;
}

export type ContainerShape = keyof ContainerShapes;

export interface ThemeOverrides {
  Container: ContainerOverride;
  Column: ColumnOverride;
  Row: RowOverride;
  Spacing: SpacingOverride;
  Alert: Overrides<any, AlertOverrides>;
  Button: Overrides<any, ButtonOverrides>;
  Divider: DividerOverride;
  Heading: HeadingOverride;
  Label: Overrides<any, LabelOverrides>;
  Positioner: Overrides<any, PositionerOverrides>;
  Popover: PopoverOverrides;
  Picker: Overrides<any, PickerOverrides<any, any, any>>;
  Text: TextOverride;
  TextInput: Overrides<any, TextInputOverrides>;
}
