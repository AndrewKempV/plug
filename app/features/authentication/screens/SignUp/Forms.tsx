import React, { Component } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  Platform,
  Text,
  TextInputFocusEventData,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { verticalScale } from "react-native-size-matters/extend";
import {
  NavigationActions,
  NavigationParams,
  NavigationRoute,
  NavigationScreenProp,
  NavigationScreenProps,
  ScrollView,
} from "react-navigation";
import AuthApi from "../../../../api/auth";
import SignUpForm from "../../../../components/SignUpForm";
import {
  emailSchema,
  firstNameSchema,
  passwordSchema,
} from "../../../../components/SignUpForm/schemas";
import SignUpFormExt from "../../../../components/SignUpForm/SignUpFormExt";
import strings from "../../../../components/SignUpForm/strings";
import Metrics, { isIPhoneX } from "../../../../config/metrics";
import { Colors, Layout } from "../../../../config/styles";
import { IUser } from "../../../../models/IUser";

export type StepName = "email" | "password" | "name" | "welcome";
export const steps = ["email", "password", "name", "welcome"];

const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : 0;

export const passwordForm = (
  onSubmit: (value: string) => void,
  navigation: NavigationScreenProp<
    NavigationRoute<NavigationParams>,
    NavigationParams
  >
): JSX.Element => (
  <KeyboardAvoidingView
    style={Layout.container}
    behavior={"padding"}
    keyboardVerticalOffset={keyboardVerticalOffset}
  >
    <SignUpForm
      defaultFieldValue={strings.password}
      formField={strings.password}
      aboveFormDetail={strings.passwordPrompt}
      belowFormDetail={strings.passwordDetailText}
      schema={passwordSchema}
      keyboardType={"default"}
      textContentType={"password"}
      onSubmit={(formValue) => {
        onSubmit(formValue);
      }}
      navigation={navigation}
      isSecure={true}
    />
  </KeyboardAvoidingView>
);

export const emailForm = (
  onSubmit: (value: string) => void,
  navigation: NavigationScreenProp<
    NavigationRoute<NavigationParams>,
    NavigationParams
  >
): JSX.Element => (
  <KeyboardAvoidingView
    style={Layout.container}
    behavior={"padding"}
    keyboardVerticalOffset={keyboardVerticalOffset}
  >
    <SignUpForm
      defaultFieldValue={strings.emailAddress}
      formField={"email"}
      aboveFormDetail={strings.emailPrompt}
      belowFormDetail={strings.emailSubText}
      schema={emailSchema}
      keyboardType={"email-address"}
      textContentType={"emailAddress"}
      onSubmit={(formValue) => {
        onSubmit(formValue);
      }}
      navigation={navigation}
      isSecure={false}
    />
  </KeyboardAvoidingView>
);

export const fullNameForm = (
  onSubmit: (firstName: string, lastName: string) => void,
  navigation: NavigationScreenProp<
    NavigationRoute<NavigationParams>,
    NavigationParams
  >,
  onFocus: (target?: number) => void
): JSX.Element => (
  <KeyboardAvoidingView
    style={Layout.container}
    behavior={"padding"}
    keyboardVerticalOffset={keyboardVerticalOffset}
  >
    <SignUpFormExt
      containerStyle={{
        flex: 1,
        marginTop: verticalScale(30),
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
      }}
      buttonContainerStyle={{
        paddingTop: isIPhoneX() ? verticalScale(50) : verticalScale(15),
      }}
      hasViewAbove={true}
      hasViewBelow={true}
      formFieldA={"First name"}
      formFieldB={"Last name"}
      defaultFieldValueA={"First name"}
      defaultFieldValueB={"Last name"}
      aboveFormDetail={`What's your name?`}
      belowFormDetail={strings.passwordDetailText}
      schema={firstNameSchema}
      keyboardType={"default"}
      textContentType={"name"}
      onSubmit={(result) => onSubmit(result.firstName, result.lastName)}
      navigation={navigation}
      onFocus={onFocus}
      isSecure={false}
      autofocus={true}
    />
  </KeyboardAvoidingView>
);
export const loginForm = (
  onSubmit: (username: string, password: string) => void,
  navigation: NavigationScreenProp<
    NavigationRoute<NavigationParams>,
    NavigationParams
  >,
  buttonText: string,
  component?: JSX.Element,
  onFocus?: (target?: number) => void,
  onLayout?: (event: LayoutChangeEvent) => void
): JSX.Element => (
  <SignUpFormExt
    containerStyle={[
      {
        flex: 1,
        flexDirection: "column",
        width: Metrics.DEVICE_WIDTH,
        alignContent: "center",
        justifyContent: "center",
      },
    ]}
    component={component}
    hasViewAbove={false}
    hasViewBelow={false}
    formFieldA={"username"}
    formFieldB={"password"}
    defaultFieldValueA={"Email or username"}
    defaultFieldValueB={"Password"}
    belowFormDetail={strings.passwordDetailText}
    schema={firstNameSchema}
    keyboardType={"default"}
    textContentType={"name"}
    onLayout={onLayout}
    onFocus={onFocus}
    onSubmit={(fields) => onSubmit(fields.firstName, fields.lastName)} // TODO: create generic form that accepts field type so incorrect member semantics don't need to be used
    navigation={navigation}
    isSecure={true}
    buttonText={buttonText}
  />
);
