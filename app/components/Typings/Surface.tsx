import * as React from "react";
import { Animated, StyleSheet, ViewProps } from "react-native";
import { Colors, shadow } from "../../config/styles";

export interface SurfaceProps extends ViewProps {
  children: React.ReactNode;
}

export class Surface extends React.Component<SurfaceProps> {
  public render = () => {
    const { style, ...rest } = this.props;
    const flattenedStyles = StyleSheet.flatten(style) || {};
    const { elevation } = flattenedStyles;

    return (
      <Animated.View
        {...rest}
        style={[
          { backgroundColor: Colors.snow },
          elevation && shadow(elevation),
          style
        ]}
      />
    );
  };
}
