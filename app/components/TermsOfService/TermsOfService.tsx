import _ from "lodash";
import React from "react";
import { Alert, StyleProp, Text, View, ViewStyle } from "react-native";
import { verticalScale } from "react-native-size-matters/extend";
import Fonts from "../../config/Fonts";
import { text } from "../../config/styles";
import strings from "./strings";

interface LegalProps {
  contextText: string;
  containerStyle?: StyleProp<ViewStyle>;
}
const showDialouge = (title: string, message: string): void =>
  Alert.alert(title, message, [{ text: "Ok" }]);

/**
 * @ Renders a terms of service component.
 *
 */
const Legal = ({ containerStyle, contextText }: LegalProps): JSX.Element => (
  <View
    style={
      !_.isNil(containerStyle)
        ? containerStyle
        : { marginTop: verticalScale(16), flexDirection: "column" }
    }
  >
    <Text style={[text.regularDark, { fontSize: Fonts.size.xSmall }]}>
      {" "}
      {contextText}{" "}
    </Text>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center"
      }}
    >
      <Text
        style={text.boldRed}
        onPress={() => showDialouge(strings.tos, "Going to Terms of Service")}
      >
        {strings.tos}
      </Text>
      <Text
        style={[
          text.regularDark,
          { marginLeft: -2, marginRight: 2, fontSize: Fonts.size.xSmall }
        ]}
      >
        {" "}
        {strings.and}{" "}
      </Text>
      <Text
        style={text.boldRed}
        onPress={() =>
          showDialouge(strings.privacyPolicy, "Going to Privacy Policy")
        }
      >
        {strings.privacyPolicy}
      </Text>
    </View>
  </View>
);

// tslint:disable-next-line:one-variable-per-declaration
const SignUpTermsOfService = (
  containerStyle?: StyleProp<ViewStyle>
): JSX.Element => {
  const contextText = strings.signUpTos;
  return Legal({ containerStyle, contextText });
};

// tslint:disable-next-line:one-variable-per-declaration
const SignInTermsOfService = (
  containerStyle?: StyleProp<ViewStyle>
): JSX.Element => {
  const contextText = strings.signInTos;
  return Legal({ containerStyle, contextText });
};

export { SignInTermsOfService };
export { SignUpTermsOfService };
export default SignUpTermsOfService;
