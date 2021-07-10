import React, { Component } from "react";
import CCFieldFormatter from "./CCFieldFormatter";
import CCFieldValidator from "./CCFieldValidator";

import { compact } from "lodash";
import _ from "lodash";
import { StyleProp, ViewStyle } from "react-native";
import { delay } from "../../utils/helpers";
import CreditCardForm from "./CreditCardForm";
import {
  CreditCardFieldType,
  EditableCreditCardFieldType,
  FieldTransition,
  FormFieldPlaceholders,
  FormFieldStatus,
  FormFieldValues,
  ValidationStatus
} from "./types";

export interface InjectedProps {
  autofocus?: boolean;
  focused?: CreditCardFieldType;
  values: FormFieldValues;
  status: FormFieldStatus;
  placeholders?: FormFieldPlaceholders;
  onFocus?: (field: CreditCardFieldType) => void;
  onChange?: (values: InjectedState) => void;
  onBecomeEmpty: (field: EditableCreditCardFieldType) => void;
  onBecomeValid: (field: EditableCreditCardFieldType) => void;
  requiresName?: boolean;
  requiresCVC?: boolean;
  requiresPostalCode?: boolean;
  validatePostalCode?: (postalCode: string) => ValidationStatus;
  containerStyle?: StyleProp<ViewStyle>;
}

export interface InjectedState {
  values: FormFieldValues;
  status: FormFieldStatus;
  focused: CreditCardFieldType;
  valid: boolean;
}

export default function connectToState(Form: typeof CreditCardForm) {
  class StateConnection extends Component<InjectedProps, InjectedState> {
    public static defaultProps: InjectedProps = {
      autofocus: false,
      focused: "number",
      onChange: (values: Omit<InjectedState, "focused">) => {
        return;
      },
      onFocus: (field: CreditCardFieldType) => {
        return;
      },
      onBecomeEmpty: (field: CreditCardFieldType) => {
        return;
      },
      onBecomeValid: (field: CreditCardFieldType) => {
        return;
      },
      requiresName: false,
      requiresCVC: true,
      requiresPostalCode: false,
      validatePostalCode: (postalCode = "") => {
        return postalCode.match(/^\d{6}$/)
          ? "valid"
          : postalCode.length > 6
          ? "invalid"
          : "incomplete";
      },
      values: {
        // will be in the sanitized and formatted form
        number: "",
        expiry: "",
        cvc: "",
        issuer: "", // will be one of [null, "visa", "master-card", "american-express", "diners-club", "discover", "jcb", "unionpay", "maestro"]
        name: "",
        postalCode: ""
      },
      status: {
        number: "incomplete",
        expiry: "incomplete",
        cvc: "incomplete",
        name: "incomplete",
        postalCode: "incomplete",
        issuer: "valid"
      },
      placeholders: {
        number: "Card number",
        expiry: "Expiry date",
        cvc: "CVV",
        postalCode: "Zip code",
        name: "Name on card",
        issuer: ""
      }
    };

    constructor(props: InjectedProps) {
      super(props);
      const { status, values } = props;
      this.state = {
        values,
        status,
        valid: false,
        focused: props.focused || "number"
      };
    }

    public componentDidMount = () => {
      // Delay because componentDidMount happens before component is rendered
      if (this.props.autofocus) {
        delay(500)
          .then(() => this.focus("number"))
          .catch(error => error);
      }
    };

    public setValues = (values: FieldTransition) => {
      const newValues = { ...this.state.values, ...values } as FormFieldValues;
      const displayedFields = this.displayedFields();
      const formattedValues = new CCFieldFormatter(
        displayedFields
      ).formatValues(newValues);
      const validation = new CCFieldValidator(displayedFields).validateValues(
        formattedValues
      );
      const newState = {
        values: formattedValues,
        focused: this.state.focused,
        ...validation
      };
      this.setState(newState);
      if (this.props.onChange) {
        this.props.onChange(newState);
      }
    };

    public focus = (field: CreditCardFieldType = "number") => {
      this.setState({ focused: field });
    };

    public displayedFields = () => {
      const {
        requiresName,
        requiresCVC,
        requiresPostalCode,
        values
      } = this.props;
      return compact([
        "number",
        "expiry",
        requiresCVC ? "cvc" : null,
        requiresPostalCode ? "postalCode" : null,
        requiresName ? "name" : null
      ]);
    };

    public focusPreviousField = (field: EditableCreditCardFieldType) => {
      if (field === "number") {
        return;
      }
      const displayedFields = this.displayedFields();
      const fieldIndex = displayedFields.indexOf(field);
      const previousField = displayedFields[fieldIndex - 1];
      if (previousField) {
        this.focus(previousField);
      }
    };

    public focusNextField = (field: EditableCreditCardFieldType) => {
      if (field === "name") {
        return;
      }

      const displayedFields = this.displayedFields();
      const fieldIndex = displayedFields.indexOf(field);
      const nextField = displayedFields[fieldIndex + 1];
      if (nextField) {
        this.focus(nextField);
      }
    };

    public change = (field: CreditCardFieldType, value: string) => {
      const transition = { [field]: value } as FieldTransition;
      this.setValues(transition);
    };

    public onFocus = (field: CreditCardFieldType) => {
      this.focus(field);
      if (!_.isNil(this.props.onFocus)) {
        this.props.onFocus(field);
      }
    };

    public onKeyPress = ({ nativeEvent: { key } }: any) => {
      const { focused } = this.state;
      if (
        key === "Backspace" &&
        this.state.values[focused].length === 0 &&
        focused !== "issuer"
      ) {
        this.focusPreviousField(focused);
      }
    };

    public render() {
      return (
        <Form
          autofocus={true}
          focused={this.state.focused}
          values={this.state.values}
          status={this.state.status}
          placeholders={this.props.placeholders}
          onFocus={this.onFocus}
          onChange={this.change}
          onBecomeValid={this.focusNextField}
          containerStyle={this.props.containerStyle}
          additionalInputsProps={{
            onKeyPress: this.onKeyPress
          }}
        />
      );
    }
  }

  return StateConnection;
}
