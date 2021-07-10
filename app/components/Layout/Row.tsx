import { dlv } from "../../utils/helpers";
import React from "react";
import { View, ViewProps, ViewStyle, StyleSheet } from "react-native";
import { Box, BoxProps } from "app/components/Box";
import { useTheme } from "app/theme";
import { getStyle, OverrideStyle, Style } from "app/utils/Overrides";

export interface RowProps extends Omit<BoxProps, "style"> {
  /**
   * When true, there will be gutter between columns
   * @default true
   */
  hasGutter?: boolean;

  /**
   * `Column` components
   */
  children?: React.ReactNode;

  /**
   * Style callback or ViewStyle object
   */
  style?: Style<RowProps, ViewStyle>;
}

export type RowOverride = OverrideStyle<RowProps, ViewStyle>;

export const GutterWidthContext = React.createContext(0);

export const Row = (props: RowProps) => {
  const { children, hasGutter = true, style, ...viewProps } = props;
  const {
    layout: { gutterWidth }
  } = useTheme();
  const theme = useTheme();

  return (
    <Box
      {...StyleSheet.flatten([
        {
          flexDirection: "row",
          flexWrap: "wrap",
          marginLeft: hasGutter ? -gutterWidth / 2 : 0,
          marginRight: hasGutter ? -gutterWidth / 2 : 0
        },
        getStyle(props, style),
        getStyle(props, dlv(theme, "overrides.Row.style"))
      ])}
      {...viewProps}
    >
      <GutterWidthContext.Provider value={hasGutter ? gutterWidth : 0}>
        {children}
      </GutterWidthContext.Provider>
    </Box>
  );
};
