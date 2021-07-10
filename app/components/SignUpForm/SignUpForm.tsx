import { Formik, FormikActions, FormikProps } from "formik";
import _ from "lodash";
import LottieView from "lottie-react-native";
import { Input } from "native-base";
import React, { Component } from "react";
import {
  Animated,
  Easing,
  KeyboardTypeOptions,
  Text,
  View
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { NavigationScreenProps } from "react-navigation";
import { Colors, Layout } from "../../config/styles";
import { IUser } from "../../models/IUser";
import { Button } from "./SignUpFormExt";
import strings from "./strings";
import styles from "./styles";
import Lottie from "assets/lottie";

interface FormValues {
  password?: string;
  email?: string;
}

export interface Props {
  defaultFieldValue: string;
  aboveFormDetail: string;
  belowFormDetail: string;
  formField: string;
  keyboardType: KeyboardTypeOptions;
  textContentType: TextContentType;
  isSecure: boolean;
  onSubmit: (value: string) => void;
  schema: object;
}
export interface SignUpFormState {
  user: IUser;
  animationProgress: Animated.Value;
  hideSecureInput: boolean;
}
const initVars = {
  username: "",
  password: ""
};

const initAttrs = {
  preferred_username: "",
  given_name: "",
  family_name: "",
  gender: "",
  phone_number: "",
  email: ""
};

const initState = {
  user: {
    auth: initVars,
    attributes: initAttrs
  },
  animationProgress: new Animated.Value(0),
  hideSecureInput: true
};

type SignUpFormProps = NavigationScreenProps & Props;
export default class SignUpForm extends Component<
  SignUpFormProps,
  SignUpFormState
> {
  public checkAnimation: LottieView | null = null;

  public constructor(props: SignUpFormProps) {
    super(props);
    this.startCheckAnimation.bind(this);
    this.stopCheckAnimation.bind(this);
    this.state = initState;
  }

  public componentDidMount() {
    this.setState(initState);
  }
  /**
   * @description Handles form submission and if necessary, invokes a callback at the end of the submission.
   *
   * Callback Use Cases
   * - Transition to the next form in a multi-stage form flow.
   * - Trigger the event which provides feedback to the user.
   */
  public handleSubmit = (
    values: FormValues,
    formikBag: FormikActions<FormValues>
  ) => {
    formikBag.setSubmitting(true);
    if (values.email || values.password) {
      setTimeout(() => {
        formikBag.setSubmitting(false);
        // this.props.navigation.navigate('HomeScreen');
      }, 3000);
      if (this.isEmailForm()) {
        this.state.user.auth.username = values.email!;
        this.props.onSubmit(values.email!);
      } else if (this.isPasswordForm()) {
        this.state.user.auth.password = values.password!;
        this.props.onSubmit(values.password!);
      }
    }
  };

  /**
   * @description Determines if this form is an email form
   */
  public isEmailForm = (): boolean =>
    this.props.textContentType === "emailAddress";
  /**
   * @description Determines if this form is a password form. If true this component will render input securely.
   */
  public isPasswordForm = (): boolean =>
    this.props.textContentType === "password";
  /**
   * @description Determines if the next form stage should be enabled.
   */
  public shouldEnableButton = (
    isValid: boolean,
    isSubmitting: boolean
  ): boolean => !(!isValid || isSubmitting);
  /**
   * @description Determines if the check mark animation should be enabled.
   */
  public shouldEnableCheckmark = (
    isValid: boolean,
    values: FormValues
  ): boolean => {
    if (!isValid) {
      this.stopCheckAnimation();
      return false;
    } else {
      if (this.isPasswordForm() && !_.isNil(values.password)) {
        const result = values.password.length > 0;
        if (!result) {
          this.stopCheckAnimation();
        } else {
          this.startCheckAnimation();
          return result;
        }
      } else if (this.isEmailForm()) {
        this.startCheckAnimation();
        return true;
      }
      return false;
    }
  };
  /**
   * @description Starts the checkmark animation.
   */
  public startCheckAnimation = (): void => {
    Animated.timing(this.state.animationProgress, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear
    }).start();
  };
  /**
   * @description Stops the checkmark animation.
   */
  public stopCheckAnimation = (): void => {
    this.state.animationProgress.stopAnimation();
    this.state.animationProgress.setValue(0);
  };
  /**
   * @description Hides input in a secured form.
   */
  public hideInput = (): void => this.setState({ hideSecureInput: true });
  /**
   * @description Show input in a secured form.
   */
  public showInput = (): void => this.setState({ hideSecureInput: false });
  /**
   * @description Toggle secure input display.
   */
  public toggleInputSecurity = (): void =>
    this.setState({ hideSecureInput: !this.state.hideSecureInput });
  /**
   * @description Toggle check mark animation.
   */
  public toggleCheckMark = () => {
    if (
      !_.isNil(this.checkAnimation) &&
      !_.isNil(this.checkAnimation.props.progress) &&
      this.checkAnimation.props.progress >= 0
    ) {
      this.stopCheckAnimation();
    } else {
      this.startCheckAnimation();
    }
  };
  public hasValue = (values: FormValues) => {
    if (this.isEmailForm()) {
      return !_.isNil(values.email) && values.email.length > 0; // values.email! !== '';
    } else if (this.isPasswordForm()) {
      return !_.isNil(values.password) && values.password.length > 0; // values.password !== '';
    } else {
      return false;
    }
  };
  /**
   * @description Renders the form.
   */
  public renderForm = ({
    values,
    setFieldValue,
    setFieldTouched,
    isValid,
    isSubmitting,
    touched,
    initialValues
  }: FormikProps<FormValues>) => (
    <View style={[Layout.containerTop, { top: verticalScale(40) }]}>
      <Text style={styles.formQuestionText}>{this.props.aboveFormDetail}</Text>
      <View
        style={[
          Layout.horizontalLeftAlign,
          { backgroundColor: Colors.whiteTwo }
        ]}
      >
        <Input
          selectionColor={Colors.darkMauve}
          placeholder={this.props.defaultFieldValue}
          placeholderTextColor={Colors.charcoalGreyA490}
          textContentType={this.props.textContentType}
          style={[
            touched || this.hasValue(values)
              ? styles.formInput
              : styles.formPlaceHolder,
            this.isEmailForm()
              ? { paddingLeft: scale(30) }
              : { paddingLeft: scale(50) }
          ]}
          autoCorrect={false}
          keyboardType={this.props.keyboardType}
          autoCapitalize="none"
          returnKeyType={"next"}
          blurOnSubmit={false}
          autoFocus={true}
          onFocus={() =>
            setFieldTouched(this.isEmailForm() ? "email" : "password", true)
          }
          onBlur={() =>
            setFieldTouched(this.isEmailForm() ? "email" : "password", false)
          }
          value={this.isEmailForm() ? values.email : values.password}
          editable={!isSubmitting}
          onChangeText={value =>
            setFieldValue(this.isEmailForm() ? "email" : "password", value)
          }
          secureTextEntry={this.props.isSecure && this.state.hideSecureInput}
        />
        <View
          style={[
            Layout.alignRight,
            { marginTop: 15, marginRight: 17.5, paddingRight: 5 }
          ]}
        >
          {this.isPasswordForm() &&
            !_.isNil(values.password) &&
            values.password.length > 0 && (
              <Text
                onPress={() => this.toggleInputSecurity()}
                style={{
                  paddingLeft: 0,
                  marginLeft: 0,
                  color: Colors.steelGrey
                }}
              >
                {this.state.hideSecureInput
                  ? strings.showPassword
                  : strings.hidePassword}
              </Text>
            )}
        </View>
        <View
          style={[
            {
              width: 16,
              height: 16,
              backgroundColor: Colors.whiteTwo,
              paddingRight: scale(25),
              marginRight: 0
            },
            Layout.alignRight
          ]}
        >
          {this.shouldEnableCheckmark(isValid, values) && (
            <LottieView
              ref={ref => (this.checkAnimation = ref)}
              source={Lottie.checkmarkBlue}
              progress={this.state.animationProgress}
              autoPlay={false}
              loop={false}
              cacheStrategy="strong"
              style={[
                { marginTop: 5.25, width: 16, height: 16 },
                Layout.alignRight
              ]}
            />
          )}
        </View>
      </View>
      <Text style={styles.emailSubText}>{this.props.belowFormDetail}</Text>
      <View style={{ paddingTop: verticalScale(75) }}>
        {Button(
          () =>
            this.props.onSubmit(
              this.isEmailForm() ? values.email! : values.password!
            ),
          this.isEmailForm()
            ? this.shouldEnableButton(isValid, isSubmitting)
            : this.shouldEnableButton(isValid, isSubmitting) &&
                this.hasValue(values),
          "Next"
        )}
      </View>
    </View>
  );
  /**
   * @description Null coalescent animation play handle.
   */
  public safePlay = (): void => {
    if (!_.isNil(this.checkAnimation)) {
      this.checkAnimation.play();
    }
  };

  public render() {
    return (
      <Formik
        initialValues={this.isEmailForm() ? { email: "" } : { password: "" }}
        onSubmit={(values: FormValues, formikBag: FormikActions<FormValues>) =>
          this.handleSubmit(values, formikBag)
        }
        validationSchema={this.props.schema}
        render={(formikBag: FormikProps<FormValues>) =>
          this.renderForm(formikBag)
        }
      />
    );
  }
}

export type TextContentType =
  | "none"
  | "URL"
  | "addressCity"
  | "addressCityAndState"
  | "addressState"
  | "countryName"
  | "creditCardNumber"
  | "emailAddress"
  | "familyName"
  | "fullStreetAddress"
  | "givenName"
  | "jobTitle"
  | "location"
  | "middleName"
  | "name"
  | "namePrefix"
  | "nameSuffix"
  | "nickname"
  | "organizationName"
  | "postalCode"
  | "streetAddressLine1"
  | "streetAddressLine2"
  | "sublocality"
  | "telephoneNumber"
  | "username"
  | "password"
  | "newPassword"
  | "oneTimeCode";
