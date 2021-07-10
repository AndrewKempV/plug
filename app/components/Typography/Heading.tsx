import React from "react";
import {
  Platform,
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle
} from "react-native";

import { useTheme } from "app/theme";
import {
  FontWeight,
  HeadingSize,
  HeadingSizes,
  TextColor
} from "app/theme/Theme";
import { getStyle, OverrideStyle, Style } from "app/utils/Overrides";
import { dlv } from "app/utils/helpers";
import { getFontWeight, getTextColor } from "./Text";
import { TextAlign } from "./types";

export interface HeadingProps extends Omit<RNTextProps, "style"> {
  /** Text content */
  children?: React.ReactNode;

  /**
   * Size of the heading.
   * @default "medium"
   */
  size?: HeadingSize | number;

  /**
   * Alignment of the heading.
   * @default "left"
   */
  align?: TextAlign;

  /**
   * Color of the heading.
   * @default "default"
   */
  color?: TextColor;

  /**
   * Weight of the heading.
   * @default headingSize.fontWeight
   */
  weight?: FontWeight;

  lineHeight?: number;

  /**
   * Style callback or TextStyle object
   */
  style?: Style<HeadingProps, TextStyle>;

  /**
   * (Web only): Corresponding h1, h2, h3... levels
   */
  accessibilityLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

export type HeadingOverride = OverrideStyle<HeadingProps, TextStyle>;

export const Heading = (props: HeadingProps) => {
  const {
    children,
    accessibilityLevel,
    size = "h3",
    align = "left",
    color = "default",
    weight,
    style,
    lineHeight,
    ...textProps
  } = props;
  const theme = useTheme();
  const sizeStyle = getHeadingSize(theme.headingSizes)(size);

  return (
    <RNText
      // @ts-ignore
      accessibilityRole={"text"}
      aria-level={accessibilityLevel} // Web
      style={[
        {
          ...sizeStyle,
          lineHeight,
          color: getTextColor(theme.colors.text)(color),
          fontFamily: theme.fontFamilies.heading,
          fontWeight:
            getFontWeight(theme.fontWeights)(weight) || sizeStyle.fontWeight,
          textAlign: align
        },
        getStyle(props, style),
        getStyle(props, dlv(theme, "overrides.Heading.style"))
      ]}
      {...textProps}
    >
      {children}
    </RNText>
  );
};

export const getHeadingSize = (headingSizes: HeadingSizes) => (
  size: HeadingSize | number
): TextStyle => {
  // @ts-ignore
  const presetHeadingSize = headingSizes[size] as TextStyle;

  return presetHeadingSize || { fontSize: size };
};
