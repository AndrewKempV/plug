import { Formik, FormikActions, FormikProps } from "formik";
import _ from "lodash";
import { Input } from "native-base";
import React, { Component } from "react";
import {
  Animated,
  Image,
  ImageSourcePropType,
  ImageStyle,
  KeyboardTypeOptions,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  StyleProp,
  Text,
  TextInput,
  TextInputFocusEventData,
  TouchableHighlight,
  View,
  ViewStyle
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { NavigationScreenProps } from "react-navigation";
import { object as yupObject, string as yupString } from "yup";
import { Colors, Layout } from "../../config/styles";
import { ValueOrDefault } from "../../utils/helpers";
import { SignUpTermsOfService } from "../TermsOfService";
import { TextContentType } from "./SignUpForm";
import strings from "./strings";
import styles from "./styles";

const FOCUS_TARGET_OFFSET = 8;
interface FormValues {
  firstName: string;
  lastName: string;
}

export interface Props {
  defaultFieldValueA: string;
  defaultFieldValueB: string;
  aboveFormDetail?: string;
  belowFormDetail?: string;
  formFieldA: string;
  formFieldB: string;
  keyboardType: KeyboardTypeOptions;
  textContentType: TextContentType;
  isSecure: boolean;
  onSubmit: (user: FormValues) => void;
  onFocus?: (target?: number) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  schema: any;
  hasViewAbove: boolean;
  hasViewBelow: boolean;
  buttonText?: string;
  component?: JSX.Element;
  containerStyle?: StyleProp<ViewStyle>;
  buttonContainerStyle?: StyleProp<ViewStyle>;
  autofocus?: boolean;
}
const initVars = {
  username: "",
  password: ""
};

const initAttrs = {
  preferred_username: "",
  given_name: "",
  family_name: "",
  email: ""
};

const initState = {
  user: {
    cognitoVariables: initVars,
    cognitoAttributes: initAttrs
  },
  animationProgress: new Animated.Value(0),
  hideSecureInput: true
};

type SignUpFormProps = NavigationScreenProps & Props;
interface ToggleableInputState {
  isHidden: boolean;
}
export const Button = (
  onPress: () => void,
  isEnabled: boolean,
  buttonText?: string
) => (
  <TouchableHighlight
    style={[
      styles.nextButton,
      { backgroundColor: isEnabled ? Colors.burgundy : Colors.darkMauve }
    ]}
    underlayColor={Colors.darkMauve}
    disabled={!isEnabled}
    onPress={() => onPress()}
  >
    <Text style={styles.nextText}>
      {" "}
      {buttonText !== undefined ? buttonText : "Create"}{" "}
    </Text>
  </TouchableHighlight>
);

export const ImageButton = (
  onNext: () => void,
  isEnabled: boolean,
  imageStyle: StyleProp<ImageStyle>,
  source: ImageSourcePropType
) => (
  <TouchableHighlight
    style={styles.nextButton}
    underlayColor={Colors.bordeauxA650}
    disabled={!isEnabled}
    onPress={() => onNext()}
  >
    <Image style={imageStyle} source={source} />
  </TouchableHighlight>
);

const renderInputSeperator = (
  <View style={styles.separatorContainer}>
    <Text style={styles.hairline} />
  </View>
);
export default class SignUpFormExt extends Component<
  SignUpFormProps,
  FormValues & ToggleableInputState
> {
  public state = { firstName: "", lastName: "", isHidden: true };

  public ToggleSecureInput = () =>
    this.setState((prevState, props) => {
      return { isHidden: !prevState.isHidden };
    });

  public handleSubmit = (
    values: FormValues,
    formikBag: FormikActions<FormValues>
  ) => {
    formikBag.setSubmitting(true);
    if (values.firstName.length > 0 && values.lastName.length > 0) {
      this.props.onSubmit({
        firstName: values.firstName,
        lastName: values.lastName
      });
      formikBag.setSubmitting(false);
    }
    formikBag.setSubmitting(false);
  };

  public renderForm = ({
    values,
    handleSubmit,
    setFieldValue,
    touched,
    errors,
    setFieldTouched,
    isValid,
    isSubmitting,
    initialValues
  }: FormikProps<FormValues>) => (
    <View
      style={ValueOrDefault(this.props.containerStyle, [
        styles.container,
        { marginTop: verticalScale(40) }
      ])}
    >
      {this.props.hasViewAbove && (
        <Text style={styles.formQuestionText}>
          {this.props.aboveFormDetail}
        </Text>
      )}
      {this.props.hasViewAbove && (
        <View
          style={{
            paddingTop: verticalScale(25),
            paddingBottom: 0,
            marginTop: 0,
            marginBottom: 0
          }}
        />
      )}

      <Input
        selectionColor={Colors.darkMauve}
        placeholder={this.props.defaultFieldValueA}
        textContentType={this.props.textContentType}
        style={[
          touched.firstName || values.firstName !== initialValues.firstName
            ? styles.formInput
            : styles.formPlaceHolder,
          undefined
        ]}
        autoCorrect={false}
        keyboardType={this.props.keyboardType}
        autoCapitalize="none"
        returnKeyType={"next"}
        onBlur={() => setFieldTouched("firstName", false)}
        onFocus={event => {
          if (!_.isNil(this.props.onFocus)) {
            this.props.onFocus(event.nativeEvent.target + FOCUS_TARGET_OFFSET); // This allows us to ensure the screen scrolls as if it is focusing on the bottom input.
          }
          setFieldTouched("firstName", true);
        }}
        blurOnSubmit={true}
        value={values.firstName}
        editable={!isSubmitting}
        autoFocus={ValueOrDefault(this.props.autofocus, false)}
        onChangeText={value => setFieldValue("firstName", value)}
        secureTextEntry={false}
      />
      {renderInputSeperator}
      <View
        style={[{ flexDirection: "row", backgroundColor: Colors.whiteTwo }]}
      >
        <Input
          selectionColor={Colors.darkMauve}
          onLayout={this.props.onLayout}
          placeholder={this.props.defaultFieldValueB}
          textContentType={this.props.textContentType}
          style={[
            touched.lastName || values.lastName !== initialValues.lastName
              ? styles.formInput
              : styles.formPlaceHolder,
            this.props.isSecure ? { paddingLeft: scale(72) } : undefined
          ]}
          autoCorrect={false}
          autoFocus={false}
          keyboardType={this.props.keyboardType}
          autoCapitalize="none"
          returnKeyType={"next"}
          onBlur={() => setFieldTouched("lastName", false)}
          onFocus={event => {
            if (!_.isNil(this.props.onFocus)) {
              this.props.onFocus(event.nativeEvent.target);
            }
            setFieldTouched("lastName", true);
          }}
          blurOnSubmit={false}
          value={values.lastName}
          editable={!isSubmitting}
          onChangeText={value => setFieldValue("lastName", value)}
          secureTextEntry={this.props.isSecure && this.state.isHidden}
        />
        {this.props.isSecure && (
          <View
            style={[
              Layout.alignRight,
              { width: 50, marginTop: 15, marginRight: 17.5, paddingRight: 5 }
            ]}
          >
            {!_.isNil(values.lastName) && values.lastName.length > 0 && (
              <Text
                onPress={() => this.ToggleSecureInput()}
                style={[
                  Layout.alignRight,
                  { paddingLeft: 0, marginLeft: 0, color: Colors.steelGrey }
                ]}
              >
                {this.state.isHidden
                  ? strings.showPassword
                  : strings.hidePassword}
              </Text>
            )}
          </View>
        )}
      </View>

      {this.props.component !== undefined && this.props.component}

      <View style={ValueOrDefault(this.props.buttonContainerStyle, undefined)}>
        {Button(
          () => {
            this.props.onSubmit(values);
          },
          !(!isValid || isSubmitting),
          this.props.buttonText
        )}
        {this.props.hasViewBelow && SignUpTermsOfService()}
      </View>
    </View>
  );

  public render() {
    return (
      <Formik
        initialValues={{ firstName: "", lastName: "" }}
        onSubmit={(values: FormValues, formikBag: FormikActions<FormValues>) =>
          this.handleSubmit(values, formikBag)
        }
        validationSchema={yupObject()
          .shape({
            firstName: yupString()
              .min(2)
              .max(50)
              .required(strings.nameRequired)
          })
          .shape({
            lastName: yupString()
              .min(1)
              .max(50)
              .required(strings.nameRequired)
          })}
        render={(formikBag: FormikProps<FormValues>) =>
          this.renderForm(formikBag)
        }
      />
    );
  }
}
