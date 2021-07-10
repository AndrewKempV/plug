import React, { PureComponent } from "react";
import {
  ActivityIndicatorProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableHighlight,
  View,
  ViewStyle
} from "react-native";
import getIconType, { IconType } from "../../utils/getIconType";
import { Colors, Layout } from "../../config/styles";
import { ValueOrDefault } from "../../utils/helpers";
import Icon from "../Icon";
import { Box } from "../Box";
import { TouchableDebounce } from "../TouchableDebounce/TouchableDebounce";
import { scale, verticalScale } from "react-native-size-matters/extend";

type ElementAlignment = "right" | "left"; //| 'center';
export interface BetterButtonProps {
  label?: string;
  onPress?: (params?: any) => void;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<TextStyle>;
  underlayColor?: string;
  active?: boolean;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
  iconSetName?: "Plugg" | IconType;
  iconPosition: ElementAlignment;
  labelPosition: ElementAlignment;
  /*
   * Duration delay for the next action. Default = 500ms
   */
  interval?: number;
  loading?: boolean;
  loadingProps?: ActivityIndicatorProps;
}

// tslint:disable-next-line:no-empty-interface
interface BetterButtonState {
  //
}

class BetterButton extends PureComponent<BetterButtonProps, BetterButtonState> {
  public static defaultProps: Partial<BetterButtonProps> = {
    loading: false,
    iconSetName: "Plugg"
  };

  public render() {
    const {
      label: title,
      onPress,
      style,
      labelStyle,
      underlayColor,
      active = true,
      iconSetName,
      iconName,
      iconSize,
      iconColor,
      iconStyle,
      loading,
      loadingProps,
      interval,
      iconPosition = "left",
      labelPosition = "right"
    }: BetterButtonProps = this.props;

    if (iconName && iconSetName) {
      const SelectedIcon =
        iconSetName === "Plugg" ? Icon : getIconType(iconSetName);
      if (iconPosition === "left" && labelPosition === "right") {
        return (
          <TouchableDebounce
            loading={loading}
            loadingProps={loadingProps}
            interval={interval}
            onPress={onPress}
            disabled={!active}
          >
            <Box
              {...ValueOrDefault(
                StyleSheet.flatten(style),
                styles.buttonContainer
              )}
            >
              <SelectedIcon
                style={iconStyle}
                name={iconName}
                size={iconSize}
                color={iconColor}
              />
              <Text style={ValueOrDefault(labelStyle, styles.buttonText)}>
                {title}
              </Text>
            </Box>
          </TouchableDebounce>
        );
      }
      if (iconPosition === "right" && labelPosition === "left") {
        return (
          <TouchableDebounce
            loading={loading}
            loadingProps={loadingProps}
            interval={interval}
            onPress={onPress}
            disabled={!active}
          >
            <Box
              {...ValueOrDefault(
                StyleSheet.flatten(style),
                styles.buttonContainer
              )}
            >
              <Text style={ValueOrDefault(labelStyle, styles.buttonText)}>
                {title}
              </Text>
              <SelectedIcon
                style={iconStyle}
                name={iconName}
                size={iconSize}
                color={iconColor}
              />
            </Box>
          </TouchableDebounce>
        );
      }
    }
    return (
      <TouchableDebounce
        loading={loading}
        loadingProps={loadingProps}
        interval={interval}
        onPress={onPress}
        disabled={!active}
      >
        <Box
          {...ValueOrDefault(StyleSheet.flatten(style), styles.buttonContainer)}
        >
          <Text
            style={[
              ValueOrDefault(labelStyle, styles.buttonText),
              { marginTop: 12 }
            ]}
          >
            {title}
          </Text>
        </Box>
      </TouchableDebounce>
    );
  }
}

const Button = (
  text: string,
  buttonStyle: StyleProp<ViewStyle>,
  textStyle: StyleProp<TextStyle>,
  underlayColor?: string,
  onPress?: () => void
) => (
  <TouchableHighlight
    style={buttonStyle}
    onPress={onPress}
    underlayColor={underlayColor}
  >
    <Text style={textStyle}> {text} </Text>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  buttonContainer: {
    ...Layout.horizontalLeftAlign,
    backgroundColor: Colors.transparent,
    borderRadius: 8,
    paddingBottom: verticalScale(10),
    paddingLeft: scale(40),
    paddingRight: scale(40),
    paddingTop: verticalScale(10)
  },
  buttonText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center"
  }
});

export { BetterButton };
export default Button;
