import React, { Component, createRef, ReactNode, RefObject } from "react";
import {
  Animated,
  NativeSyntheticEvent,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInputFocusEventData,
  View,
  ViewStyle
} from "react-native";
import Fonts from "../../config/Fonts";
import Metrics from "../../config/metrics";
import { Colors } from "../../config/styles";
import { Input, InputProps } from "react-native-elements";

interface FloatingLabelProps {
  visible: string;
  initialPadding?: number;
  initialOpacity?: number;
}
interface FloatingLabelState {
  paddingAnim: Animated.Value;
  opacityAnim: Animated.Value;
}

class FloatingLabel extends Component<FloatingLabelProps, FloatingLabelState> {
  public static defaultProps: FloatingLabelProps = {
    initialOpacity: 0,
    initialPadding: 5,
    visible: ""
  };

  constructor(props: FloatingLabelProps) {
    super(props);

    let initialPadding = 9;
    let initialOpacity = 0;

    if (this.props.visible) {
      initialPadding = 5;
      initialOpacity = 1;
    }

    this.state = {
      paddingAnim: new Animated.Value(initialPadding),
      opacityAnim: new Animated.Value(initialOpacity)
    };
  }

  public componentWillReceiveProps(newProps: FloatingLabelProps) {
    Animated.parallel([
      Animated.timing(this.state.paddingAnim, {
        toValue: newProps.visible
          ? -5
          : FloatingLabel.defaultProps.initialPadding!,
        duration: 150
      }),
      Animated.timing(this.state.opacityAnim, {
        toValue: newProps.visible ? 1 : 0,
        duration: 150
      })
    ]).start();
  }

  public render() {
    return (
      <Animated.View
        style={[
          styles.floatingLabel,
          {
            paddingTop: this.state.paddingAnim,
            opacity: this.state.opacityAnim
          }
        ]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

interface TextFieldHolderProps {
  withValue: string;
  children: ReactNode;
  animated?: boolean;
}

interface TextFieldHolderState {
  marginAnim: Animated.Value;
}

// tslint:disable-next-line:max-classes-per-file
class TextFieldHolder extends Component<
  TextFieldHolderProps,
  TextFieldHolderState
> {
  constructor(props: TextFieldHolderProps) {
    super(props);
    this.state = {
      marginAnim: new Animated.Value(this.props.withValue ? 10 : 0)
    };
  }

  public componentWillReceiveProps(newProps: TextFieldHolderProps) {
    if (this.props.animated) {
      return Animated.timing(this.state.marginAnim, {
        toValue: newProps.withValue ? 10 : 0,
        duration: 230
      }).start();
    }
  }

  public render() {
    return (
      <Animated.View style={[{ marginTop: this.state.marginAnim }]}>
        {this.props.children}
      </Animated.View>
    );
  }
}

type FloatingLabelInputMode = "animated" | "fixed";

interface FloatingLabelTextFieldProps extends InputProps {
  value: string;
  containerStyle?: StyleProp<ViewStyle>;
  leftPadding?: number;
  noBorder?: boolean;
  onChangeTextValue?: (value: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData> | void) => void;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData> | void) => void;
  mode?: FloatingLabelInputMode;
}

interface FloatingLabelTextFieldState {
  text: string;
  focused: boolean;
}

// tslint:disable-next-line:max-classes-per-file
class LabeledInput extends Component<
  FloatingLabelTextFieldProps,
  FloatingLabelTextFieldState
> {
  public input: RefObject<Input> = createRef();

  constructor(props: FloatingLabelTextFieldProps) {
    super(props);
    this.state = {
      focused: false,
      text: this.props.value
    };
  }

  public componentWillReceiveProps(newProps: FloatingLabelTextFieldProps) {
    if (
      newProps.hasOwnProperty("value") &&
      newProps.value !== this.state.text
    ) {
      this.setState({ text: newProps.value });
    }
  }

  public leftPadding() {
    return { width: this.props.leftPadding || 0 };
  }

  public withBorder() {
    if (!this.props.noBorder) {
      return styles.withBorder;
    }
  }

  public render() {
    console.log(this.state);

    return (
      <View style={styles.container}>
        <View style={[styles.viewContainer, this.props.containerStyle]}>
          <View style={[styles.paddingView, this.leftPadding()]} />
          <View style={[styles.fieldContainer, this.withBorder()]}>
            <FloatingLabel
              visible={this.props.mode !== "fixed" ? this.state.text : ""}
            >
              <Text style={[styles.fieldLabel, this.labelStyle()]}>
                {this.placeholderValue()}
              </Text>
            </FloatingLabel>
            <TextFieldHolder withValue={this.state.text}>
              <Input
                {...this.props}
                ref={this.input}
                underlineColorAndroid="transparent"
                defaultValue={this.props.defaultValue}
                value={this.state.text}
                maxLength={this.props.maxLength}
                onFocus={this.setFocus}
                onBlur={this.unsetFocus}
                onChangeText={this.setText}
                inputStyle={[styles.valueText, this.props.style]}
                containerStyle={styles.inputLayoutContainer}
                inputContainerStyle={styles.inputContainer}
              />
            </TextFieldHolder>
          </View>
        </View>
      </View>
    );
  }

  public inputRef() {
    return this.input.current!;
  }

  public focus() {
    this.inputRef().focus();
  }

  public blur() {
    this.inputRef().blur();
  }

  public isFocused() {
    return this.inputRef().isFocused();
  }

  public clear() {
    this.inputRef().clear();
  }

  public setFocus = () => {
    this.setState({ focused: true });
    if (this.props.onFocus) {
      return this.props.onFocus();
    }
  };

  public unsetFocus = () => {
    this.setState({ focused: false });
    if (this.props.onBlur) {
      return this.props.onBlur();
    }
  };

  public labelStyle() {
    if (this.state.focused) {
      return styles.focused;
    }
  }

  public placeholderValue() {
    if (this.state.text) {
      return this.props.placeholder;
    }
  }

  public setText = (value: string) => {
    this.setState({ text: value });
    if (this.props.onChangeTextValue) {
      return this.props.onChangeTextValue(value);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    height: 70,
    justifyContent: "center",
    width: Metrics.DEVICE_WIDTH
  },
  fieldContainer: {
    flex: 1,
    justifyContent: "center",
    position: "relative"
  },
  fieldLabel: {
    color: Colors.charcoalGrey,
    fontFamily: Fonts.type.base,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    width: 100
    // height: 15,
    // width: 100,
    // fontSize: 10,
    // color: colors.charcoalGreyA350
  },
  floatingLabel: {
    left: 0,
    position: "absolute",
    top: 0
  },
  focused: {
    color: Colors.charcoalGrey,
    fontFamily: Fonts.type.base,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left",
    width: 100
  },
  inputContainer: {
    borderBottomWidth: 0
  },
  inputLayoutContainer: {
    paddingHorizontal: 0,
    paddingRight: 0
  },
  paddingView: {
    width: 15
  },
  placeholderText: {
    color: Colors.darkA500,
    fontFamily: Fonts.type.bold,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "700",
    height: Platform.select({ ios: 20, android: 60 }),
    letterSpacing: 0,
    textAlign: "left"
  },
  valueText: {
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500",
    height: Platform.select({ ios: 20, android: 60 }),
    letterSpacing: 0,
    textAlign: "left"
  },
  viewContainer: {
    flex: 1,
    flexDirection: "row",
    marginLeft: Metrics.margin
  },
  withBorder: {
    borderBottomWidth: 1 / 2,
    borderColor: "#C8C7CC"
  }
});

export default LabeledInput;
