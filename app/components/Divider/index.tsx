import React from "react";
import { View, ViewProps, ViewStyle } from "react-native";

import { useTheme, ControlSize, BorderColor, BorderColors } from "app/theme";
import { isControlSize } from "app/theme/controlSize";
import { getStyle, OverrideStyle, Style } from "app/utils/Overrides";
import { dlv } from "app/utils/helpers";
import { randomHexColor } from "app/utils/LayoutDebugger";

type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps extends Omit<ViewProps, "style"> {
  /**
   * Size of the divider.
   * @default small
   */
  size?: ControlSize | number;

  /**
   * Color of the divider.
   * @default colors.border.default
   */
  color?: BorderColor | string;

  /**
   * Orientation of the divier
   * @default "horizontal"
   */
  orientation?: DividerOrientation;

  /**
   * Style callback or ViewStyle object
   */
  style?: Style<DividerProps, ViewStyle>;

  /**
   * Should this component render a debug border
   */
  debug?: boolean;
}

export type DividerOverride = OverrideStyle<DividerProps, ViewStyle>;

export const Divider = (props: DividerProps) => {
  const {
    size = "small",
    color = "default",
    orientation = "horizontal",
    style,
    debug,
    ...viewProps
  } = props;
  const theme = useTheme();

  const backgroundColor = getDividerColor(theme.colors.border)(
    color || theme.colors.border.default
  );

  const dividerSize = isControlSize(size) ? dividerScale[size] : size;

  const styleMap = {
    horizontal: {
      backgroundColor,
      height: dividerSize,
      width: "100%"
    },
    vertical: {
      backgroundColor,
      height: "100%",
      width: dividerSize
    }
  };

  return (
    <View
      style={[
        orientation
          ? !debug
            ? styleMap[orientation]
            : {
                ...styleMap[orientation],
                ...{ borderColor: randomHexColor(), borderWidth: 1 }
              }
          : !debug
          ? styleMap.horizontal
          : {
              ...styleMap.horizontal,
              ...{ borderColor: randomHexColor(), borderWidth: 1 }
            },
        getStyle(props, style),
        getStyle(props, dlv(theme, "overrides.Divider.style"))
      ]}
      {...viewProps}
    />
  );
};

const getDividerColor = (borderColors: BorderColors) => (
  borderColor: BorderColor
) => {
  // @ts-ignore
  const presetColor = borderColors[borderColor] as string | undefined;
  return presetColor || borderColor;
};

const dividerScale: { [size in ControlSize]: number } = {
  large: 3,
  medium: 2,
  small: 1
};
