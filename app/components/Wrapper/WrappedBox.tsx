import React from "react";
import { ViewStyle, StyleProp } from "react-native";
import { Box, BoxProps } from "app/components";

type Props = {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
} & BoxProps;

export const WrappedBox = ({ style, children, ...rest }: Props) => {
  return (
    <Box {...rest} {...style}>
      {children}
    </Box>
  );
};
