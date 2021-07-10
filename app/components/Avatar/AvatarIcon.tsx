import * as React from "react";
import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text as NativeText,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import { Colors, Layout } from "../../config/styles";
import PluggIcon from "../Icon";
// import { IconSource, ThemeShape } from '../Typings/Theme';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export default class Icon extends React.Component<IconProps> {
  public static displayName = "Avatar.Icon";

  public static defaultProps: Partial<IconProps> = {
    size: 64
  };

  public render() {
    const { name, size, style } = this.props;
    const { backgroundColor = Colors.snow, ...restStyle } =
      StyleSheet.flatten(style) || {};
    const textColor = this.props.color ? "rgba(0, 0, 0, .54)" : Colors.black;

    return (
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size! / 2,
            backgroundColor
          },
          Layout.alignCentered,
          restStyle
        ]}
      >
        <PluggIcon name={name} color={textColor} size={size! * 0.6} />
      </View>
    );
  }
}
