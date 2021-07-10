import _ from "lodash";
import LottieView from "lottie-react-native";
import React from "react";
import {
  Animated,
  KeyboardTypeOptions,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import { Input } from "react-native-elements";
import { Colors, Layout } from "../../config/styles";
import { TextContentType } from "../SignUpForm/SignUpForm";
import strings from "./strings";
import styles from "./styles";

export interface InputProps {
  toggleInputSecurity?: () => void;
  showInput?: () => void;
  hideInput?: () => void;
  shouldEnableCheckmark?: (isValid: boolean) => boolean;

  keyboardType: KeyboardTypeOptions;
  textContentType: TextContentType;
  isSecure: boolean;
  hasCheckmark: boolean;
  textStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  placeHolder: string;
  field: string;
  hideSecureInput: true;
  animationProgress: Animated.Value | number;
}

export interface InputState {
  hideSecureInput: boolean;
  animationProgress: Animated.Value;
}

export interface FormikParams {
  fieldValue: string;
  setFieldValue: (field: string, value: any) => void;
  setFieldTouched: (field: string, isTouched?: boolean) => void;
  isValid: boolean;
  isSubmitting: boolean;
}

interface InputValueWrapper {
  value: string;
}

const initialState = {
  hideSecureInput: true,
  animationProgress: new Animated.Value(0)
};

/**
 *
 * @description Renders an input field with show/hidee secure text and check mark animation for validation feedback.
 * Can be used with the formik library for validation.
 *
 * @param InputState
 * @param InputProps
 * @param FormikParams
 */
const RenderFormInput = (
  { hideSecureInput, animationProgress }: InputState,
  {
    keyboardType,
    textContentType,
    field,
    placeHolder,
    inputStyle,
    textStyle,
    isSecure,
    hasCheckmark,
    toggleInputSecurity,
    showInput,
    hideInput,
    shouldEnableCheckmark
  }: InputProps,
  {
    fieldValue,
    setFieldValue,
    setFieldTouched,
    isValid,
    isSubmitting
  }: FormikParams
): JSX.Element => (
  <View
    style={[Layout.horizontalLeftAlign, { backgroundColor: Colors.whiteTwo }]}
  >
    <Input
      placeholder={placeHolder}
      textContentType={textContentType}
      style={[
        inputStyle !== undefined ? inputStyle : styles.formInput,
        { marginLeft: isValid ? 15 : 0 }
      ]}
      autoCorrect={false}
      keyboardType={keyboardType}
      autoCapitalize="none"
      returnKeyType={"next"}
      blurOnSubmit={false}
      onBlur={() => setFieldTouched(field)}
      value={fieldValue}
      editable={!isSubmitting}
      onChangeText={value => setFieldValue(field, value)}
      secureTextEntry={isSecure && hideSecureInput}
    />
    {hideSecureInput && !_.isNil(toggleInputSecurity) && (
      <Text
        onPress={toggleInputSecurity}
        style={[
          Layout.alignRight,
          {
            marginTop: 15,
            paddingRight: isValid ? 17.5 : 7.5,
            color: Colors.steelGrey
          }
        ]}
      >
        {hideSecureInput ? strings.showPassword : strings.hidePassword}
      </Text>
    )}
    {hasCheckmark && shouldEnableCheckmark!(isValid) && (
      <LottieView
        source={require("../../assets/check-mark-circle-blue.json")}
        progress={animationProgress}
        autoPlay={false}
        cacheStrategy="strong"
        style={[
          {
            width: 16,
            height: 16,
            backgroundColor: Colors.whiteTwo,
            marginTop: 7.5,
            paddingRight: 15
          },
          Layout.alignRight
        ]}
      />
    )}
  </View>
);
export default RenderFormInput;
