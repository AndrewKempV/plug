import React, { PureComponent } from "react";
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import Metrics from "../../config/metrics";
import { Colors } from "../../config/styles";
import Icon from "../Icon";

interface IconButtonProps {
  label?: string;
  onPress?: (params?: any) => void;
  style?: ViewStyle;
  iconStyle?: ViewStyle;
  backgroundColor?: string;
  // labelStyle?: StyleProp<TextStyle>;
  // underlayColor?: string;
  active?: boolean;
  iconName: string;
  iconSize: number;
  iconColor?: string;
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 15,
    borderWidth: 1,
    height: Metrics.icons.medium,
    width: Metrics.icons.medium
  },
  icon: {
    paddingLeft: scale(7.5),
    paddingTop: verticalScale(1.5)
  }
});

export default class IconButton extends PureComponent<IconButtonProps> {
  public static defaultProps: IconButtonProps = {
    style: styles.button,
    backgroundColor: Colors.snow,
    iconStyle: styles.icon,
    iconColor: Colors.black,
    iconName: "cancel",
    iconSize: Metrics.icons.small
  };

  public render() {
    const {
      style,
      backgroundColor,
      iconStyle,
      iconName,
      iconSize,
      iconColor,
      label,
      onPress
    } = this.props;
    if (label) {
      return (
        <Icon.Button
          style={style}
          backgroundColor={backgroundColor}
          iconStyle={iconStyle}
          name={iconName}
          size={iconSize}
          color={iconColor}
          onPress={onPress}
        >
          {label}
        </Icon.Button>
      );
    } else {
      return (
        <Icon.Button
          style={style}
          backgroundColor={backgroundColor}
          iconStyle={iconStyle}
          name={iconName}
          size={iconSize}
          color={iconColor}
          onPress={onPress}
        />
      );
    }
  }
}
