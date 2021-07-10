import React, { Component } from "react";

import {
  Image,
  LayoutAnimation,
  StyleProp,
  StyleSheet,
  Text,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  InteractionManager
} from "react-native";

import CreditCardInput from "./CreditCardInput";
import { InjectedProps } from "./ConnectToState";
import Icons from "./Icons";

import _ from "lodash";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Metrics from "../../config/metrics";
import { Colors, Fonts, Layout } from "../../config/styles";
import { Dictionary } from "../../types/collections";
import {
  CreditCardFieldType,
  EditableCreditCardFieldType,
  Issuer
} from "./types";

export interface FormProps {
  valid: boolean; // will be true once all fields are "valid" (time to enable the submit button)
  inputStyle?: StyleProp<TextStyle>;
  validColor?: string;
  invalidColor?: string;
  placeholderColor?: string;
  additionalInputsProps: TextInputProps;
  onChange?: (field: EditableCreditCardFieldType, value: string) => void;
}

const initialFormProps: Pick<FormProps, "valid"> &
  Pick<InjectedProps, "values" | "status" | "placeholders"> = {
  valid: true, // will be true once all fields are "valid" (time to enable the submit button)
  values: {
    // will be in the sanitized and formatted form
    number: "2321",
    expiry: "0471",
    cvc: "",
    issuer: "placeholder", // will be one of [null, "visa", "master-card", "american-express", "diners-club", "discover", "jcb", "unionpay", "maestro"]
    name: "Sam",
    postalCode: "34567"
  },
  status: {
    number: "incomplete",
    expiry: "incomplete",
    cvc: "incomplete",
    name: "incomplete",
    postalCode: "incomplete",
    issuer: "incomplete"
  },
  placeholders: {
    number: "",
    name: "",
    issuer: "",
    cvc: "CVC",
    postalCode: "",
    expiry: ""
  }
};

type CreditCardFormProps = Omit<InjectedProps, "onChange"> & FormProps;

export default class CreditCardForm extends Component<CreditCardFormProps> {
  public static defaultProps: CreditCardFormProps = {
    ...initialFormProps,
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    additionalInputsProps: {},
    focused: "number",
    onBecomeEmpty: () => {
      return;
    },
    onBecomeValid: () => {
      return;
    }
  };

  public inputRefs: Dictionary<
    CreditCardFieldType,
    CreditCardInput
  > = new Dictionary<CreditCardFieldType, CreditCardInput>();

  public componentDidMount = () => {
    InteractionManager.runAfterInteractions(() => {
      if (!_.isNil(this.props.focused)) {
        this.focus(this.props.focused);
      }
    });
  };

  public componentWillReceiveProps = (newProps: CreditCardFormProps) => {
    if (!_.isNil(newProps.focused) && this.props.focused !== newProps.focused) {
      this.focus(newProps.focused);
    }
  };

  public focus = (field: CreditCardFieldType) => {
    if (!field) {
      return;
    }
    const input = this.inputRefs.tryGetValue(field);
    if (!_.isNil(input)) {
      input.focus();
      LayoutAnimation.easeInEaseOut();
    }
  };

  public render() {
    const { containerStyle } = this.props;
    return (
      <View style={[styles.formContainer, containerStyle]}>
        <CreditCardInput
          {...this.inputProps("number")}
          containerStyle={styles.numberInputContainer}
          inputStyle={styles.numberInput}
          labelStyle={styles.numberPlaceholder}
          keyboardType={"numeric"}
          leftIcon={
            <TouchableOpacity onPress={this.focusNumber}>
              <Image style={styles.icon} source={Icons[this.iconToShow()]} />
            </TouchableOpacity>
          }
        />
        <View style={styles.inputContainer}>
          <View style={styles.expirationInputContainer}>
            <CreditCardInput
              {...this.inputProps("expiry")}
              containerStyle={styles.expiryInput}
              labelStyle={styles.numberPlaceholder}
              keyboardType={"numeric"}
            />
          </View>
          <View style={styles.inputDivider} />
          <View style={styles.cvcInputContainer}>
            <CreditCardInput
              {...this.inputProps("cvc")}
              containerStyle={styles.cvcInput}
              labelStyle={styles.numberPlaceholder}
              keyboardType={"numeric"}
            />
          </View>
          <View style={styles.inputDivider} />
          <View style={styles.postalInputContainer}>
            <CreditCardInput
              {...this.inputProps("postalCode")}
              containerStyle={styles.postalInput}
              labelStyle={styles.numberPlaceholder}
              keyboardType={"numeric"}
            />
          </View>
        </View>

        {this.shouldShowNameInput() ? (
          <View style={styles.nameInputContainer}>
            <CreditCardInput
              {...this.inputProps("name")}
              containerStyle={styles.nameInput}
              labelStyle={styles.numberPlaceholder}
              keyboardType={"default"}
              additionalInputProps={{
                clearButtonMode: "always",
                selectionColor: Colors.burgundy
              }}
            />
          </View>
        ) : (
          <Text style={styles.formBottomLabel}>
            {"We are currently not accepting foreign bank cards."}
          </Text>
        )}
      </View>
    );
  }

  private setInputRef = (
    field: EditableCreditCardFieldType,
    ref: CreditCardInput
  ) => {
    if (!this.inputRefs.containsKey(field)) {
      this.inputRefs.add(field, ref);
    } else {
      this.inputRefs.remove(item => item.key === field);
      this.inputRefs.add(field, ref);
    }
  };

  private inputProps = (field: EditableCreditCardFieldType) => {
    const {
      validColor,
      invalidColor,
      placeholderColor,
      placeholders,
      values,
      status,
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid
    } = this.props;

    return {
      ref: (ref: CreditCardInput) => this.setInputRef(field, ref),
      field,
      value: values[field],
      status: status[field],
      placeholder: placeholders ? placeholders[field] : "",
      inputStyle: StyleSheet.flatten([this.props.inputStyle]) as StyleProp<
        TextStyle
      >,
      validColor,
      invalidColor,
      placeholderColor,
      onChange,
      onFocus,
      onBecomeEmpty,
      onBecomeValid
    };
  };

  private iconToShow = (): Issuer => {
    const {
      values: { issuer }
    } = this.props;
    if (Issuer.guard(issuer)) {
      return issuer;
    }
    return "placeholder";
  };

  private focusNumber = () => this.focus("number");

  private shouldShowNameInput = () => {
    const { status } = this.props;
    return (
      status.number === "valid" &&
      status.cvc === "valid" &&
      status.expiry === "valid" &&
      status.postalCode === "valid"
    );
  };
}

const styles = StyleSheet.create({
  cvcInput: {
    width: 121
  },
  cvcInputContainer: {
    width: 121,
    ...Layout.alignCenterLeft
  },
  expanded: {
    flex: 1
  },
  expirationInputContainer: {
    width: 124,
    ...Layout.alignCenterLeft
  },
  expiryInput: {
    width: 124
  },
  formBottomLabel: {
    color: Colors.charcoalGrey,
    fontFamily: "HelveticaNeue",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "300",
    height: 21,
    marginTop: 15,
    textAlign: "center",
    width: "90%"
  },
  formContainer: {
    ...Layout.container,
    ...Layout.alignTop
  },
  hidden: {
    width: 0
  },
  icon: {
    height: 24,
    resizeMode: "contain",
    width: 24
  },
  inputContainer: {
    alignItems: "center",
    backgroundColor: Colors.snow,
    borderColor: Colors.lightBlueGrey,
    borderStyle: "solid",
    borderWidth: 1,
    flexDirection: "row",
    height: 44,
    marginTop: 17,
    overflow: "hidden",
    width: 375
  },
  inputDivider: {
    borderColor: Colors.lightBlueGrey,
    borderStyle: "solid",
    borderWidth: 1,
    height: 24,
    width: 0
  },
  nameInput: {},
  nameInputContainer: {
    backgroundColor: Colors.snow,
    borderColor: Colors.lightBlueGrey,
    borderStyle: "solid",
    borderWidth: 1,
    height: 44,
    marginTop: 16,
    width: 375
  },
  numberInput: {
    paddingLeft: 16
  },
  numberInputContainer: {
    backgroundColor: Colors.snow,
    borderColor: Colors.lightBlueGrey,
    borderStyle: "solid",
    borderWidth: 1,
    height: 44,
    width: 375
  },
  numberPlaceholder: {
    backgroundColor: Colors.whiteTwo,
    color: Colors.charcoalGrey,
    fontFamily: Fonts.type.medium,
    fontSize: 20,
    fontWeight: "bold",
    maxHeight: verticalScale(57.1),
    opacity: 0.79,
    textAlign: "center",
    width: Metrics.DEVICE_WIDTH
  },
  postalInput: {
    width: 130
  },
  postalInputContainer: {
    width: 130,
    ...Layout.alignCenterLeft
  }
});
