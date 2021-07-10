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

export interface TextProps {
  label: string;
  size: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  // theme?: ThemeShape;
}

// tslint:disable-next-line:max-classes-per-file
export default class Text extends React.Component<TextProps> {
  public static displayName = "Avatar.Text";

  public static defaultProps = {
    size: 64
  };

  public render() {
    const { label, size, style } = this.props;

    const { backgroundColor = Colors.snow, ...restStyle } =
      StyleSheet.flatten(style) || {};
    const textColor = this.props.color || Colors.black;

    return (
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor
          },
          Layout.alignCentered,
          restStyle
        ]}
      >
        <NativeText
          style={[
            Layout.textFullCenter,
            {
              color: textColor,
              fontSize: size / 2,
              lineHeight: size
            }
          ]}
          numberOfLines={1}
        >
          {label}
        </NativeText>
      </View>
    );
  }
}
