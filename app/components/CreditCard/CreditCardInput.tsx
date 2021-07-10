import React, { createRef, PureComponent, RefObject } from "react";
import {
  KeyboardType,
  StyleProp,
  StyleSheet,
  Text,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";
import { IconNode, Input } from "react-native-elements";
import { Colors, Fonts } from "../../config/styles";
import { EditableCreditCardFieldType, ValidationStatus } from "./types";

export interface CreditCardInputProps {
  field: EditableCreditCardFieldType;
  label?: string;
  value?: string;
  placeholder?: string;
  keyboardType?: KeyboardType;

  status?: ValidationStatus;

  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;

  validColor?: string;
  invalidColor?: string;
  placeholderColor?: string;

  leftIcon?: IconNode;
  leftIconContainerStyle?: StyleProp<ViewStyle>;
  rightIcon?: IconNode;
  rightIconContainerStyle?: StyleProp<ViewStyle>;

  onFocus?: (field: EditableCreditCardFieldType) => void;
  onChange?: (field: EditableCreditCardFieldType, text: string) => void;
  onBecomeEmpty?: (field: EditableCreditCardFieldType) => void;
  onBecomeValid?: (field: EditableCreditCardFieldType) => void;

  additionalInputProps?: TextInputProps;
}

interface CCInputState {
  value: string;
}

const styles = StyleSheet.create({
  baseInputContainerStyle: {
    borderBottomColor: Colors.transparent,
    borderBottomWidth: 0
  },
  baseInputStyle: {
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500",
    textAlign: "left"
  }
});

export default class CreditCardInput extends PureComponent<
  CreditCardInputProps,
  CCInputState
> {
  public static defaultProps: Partial<CreditCardInputProps> = {
    label: "",
    value: "",
    status: "incomplete",
    containerStyle: {},
    inputStyle: {},
    labelStyle: {}
  };

  public readonly state = {
    value: ""
  };

  public inputRef: RefObject<Input> = createRef();

  public componentWillReceiveProps = (newProps: CreditCardInputProps) => {
    const { status, value, onBecomeEmpty, onBecomeValid, field } = this.props;
    const { status: newStatus, value: newValue } = newProps;
    // console.log(`${status} => ${newStatus}`);
    // console.log(`${value} => ${newValue}`);
    // console.log(field);
    if (onBecomeEmpty && value !== "" && newValue === "") {
      onBecomeEmpty(field);
    }
    if (onBecomeValid && status !== "valid" && newStatus === "valid") {
      onBecomeValid(field);
    }
  };

  public focus = () => {
    const input = this.getInputRef();
    if (input) {
      input.focus();
    }
  };

  public onFocus = () => {
    if (this.props.onFocus) {
      this.props.onFocus(this.props.field);
    }
  };

  public onChange = (value: string) => {
    if (this.props.onChange) {
      this.props.onChange(this.props.field, value);
    }
  };

  public render() {
    const {
      label,
      value,
      placeholder,
      status,
      keyboardType,
      containerStyle,
      inputContainerStyle,
      inputStyle,
      labelStyle,
      validColor,
      invalidColor,
      placeholderColor,
      leftIcon,
      rightIcon,
      leftIconContainerStyle,
      rightIconContainerStyle,
      additionalInputProps
    } = this.props;
    const textInputStyle = StyleSheet.flatten([
      styles.baseInputStyle,
      inputStyle,
      validColor && status === "valid"
        ? { color: validColor }
        : invalidColor && status === "invalid"
        ? { color: invalidColor }
        : {}
    ]);
    return (
      <TouchableOpacity onPress={this.focus} activeOpacity={0.99}>
        <View style={[containerStyle]}>
          {!!label && <Text style={[labelStyle]}>{label}</Text>}
          <Input
            ref={this.inputRef}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={placeholderColor}
            inputStyle={textInputStyle}
            inputContainerStyle={StyleSheet.flatten([
              styles.baseInputContainerStyle,
              inputContainerStyle
            ])}
            leftIcon={leftIcon}
            leftIconContainerStyle={leftIconContainerStyle}
            rightIcon={rightIcon}
            rightIconContainerStyle={rightIconContainerStyle}
            keyboardType={keyboardType}
            autoCorrect={false}
            underlineColorAndroid={"transparent"}
            onFocus={this.onFocus}
            onChangeText={this.onChange}
            {...additionalInputProps}
          />
        </View>
      </TouchableOpacity>
    );
  }

  private getInputRef = () => {
    return this.inputRef.current;
  };
}
