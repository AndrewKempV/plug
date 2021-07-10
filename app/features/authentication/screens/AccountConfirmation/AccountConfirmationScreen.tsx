import _ from "lodash";
import {
  Body,
  Button as NativeButton,
  Container,
  Header,
  Left,
  Right
} from "native-base";
import * as React from "react";
import {
  Alert,
  Button,
  StatusBar,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import IoniconIcon from "react-native-vector-icons/Ionicons";
import { NavigationScreenProps } from "react-navigation";
import AuthApi from "api/auth";
import { ApiClient } from "api/client";
import VerificationForm from "components/VerificationForm";
import ApplicationStyles from "config/ApplicationStyles";
import Metrics from "config/metrics";
import { Colors, text } from "config/styles";
import Storage from "utils/storage";
import strings from "./strings";

const formContainerStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: verticalScale(300)
} as StyleProp<ViewStyle>;

export default class AccountConfirmationScreen extends React.Component<
  NavigationScreenProps
> {
  public state = {};
  public ref = React.createRef<VerificationForm>();

  public render(): JSX.Element {
    return (
      <Container>
        <Header
          style={{ backgroundColor: Colors.transparent }}
          iosBarStyle={"light-content"}
          translucent={true}
          androidStatusBarColor={Colors.burgundy}
          transparent={true}
          noShadow={true}
        >
          <StatusBar
            networkActivityIndicatorVisible={true}
            hidden={false}
            barStyle={"dark-content"}
            translucent={true}
          />
          <Left>
            <NativeButton
              transparent={true}
              onPressIn={() => this.props.navigation.navigate("SignUp")}
            >
              <IoniconIcon
                style={{ paddingLeft: scale(Metrics.margin) }}
                name={"ios-arrow-back"}
                color={Colors.black}
                size={Metrics.icons.small}
                onPress={() => this.props.navigation.navigate("SignUp")}
              />
            </NativeButton>
          </Left>
          <Body>
            <Text style={ApplicationStyles.screenTitle as StyleProp<TextStyle>}>
              {strings.screenTitle}
            </Text>
          </Body>
          <Right />
        </Header>
        <View style={formContainerStyle}>
          <VerificationForm
            ref={this.ref}
            onFulfill={code => {
              Storage.getUsername().then(username => {
                if (!_.isNil(username)) {
                  AuthApi.confirmAccount({ code, username })
                    .then(confirmationResponse => {
                      if (
                        confirmationResponse.state ===
                          "ConfirmAccountCodeAccepted" ||
                        confirmationResponse.state === "Unauthenticated"
                      ) {
                        // tslint:disable-next-line:no-console
                        Alert.alert(`Your account has been confirmed`);
                        ApiClient.instance
                          .createUserProfile({})
                          .then(response => {
                            console.log(response);
                            this.props.navigation.navigate("Welcome");
                          })
                          .catch(error => {
                            console.warn(error);
                            this.props.navigation.navigate("Welcome");
                          });
                      } else if (
                        confirmationResponse.state ===
                        "ConfirmAccountCodeExpired"
                      ) {
                        // tslint:disable-next-line:no-console
                        Alert.alert(
                          "Token Expired",
                          "Your confirmation token has expired",
                          [
                            {
                              text: "Resend",
                              onPress: () =>
                                AuthApi.resendConfirmationCode(username)
                                  .then(resendResponse => {
                                    if (
                                      resendResponse.state ===
                                        "Unauthenticated" ||
                                      resendResponse.state ===
                                        "ConfirmAccountCodeNotAccepted" ||
                                      resendResponse.state ===
                                        "ConfirmAccountCodeWaiting"
                                    ) {
                                      this.props.navigation.navigate("Welcome");
                                      // tslint:disable-next-line:no-console
                                      Alert.alert(
                                        "Success",
                                        `A confirmation code has been sent to  ${username}`
                                      );
                                    } else {
                                      // this.props.navigation.navigate('WelcomeScreen');
                                      // tslint:disable-next-line:no-console
                                      Alert.alert(`${resendResponse.error}`);
                                    }
                                  })
                                  .catch(error => {
                                    // tslint:disable-next-line:no-console
                                    console.log(error);
                                    //  this.props.navigation.navigate('WelcomeScreen');
                                  })
                            }
                          ],
                          { cancelable: false }
                        );
                      } else {
                        // tslint:disable-next-line:no-console
                        Alert.alert(`${confirmationResponse.error}`);
                      }
                    })
                    .catch(error => {
                      // tslint:disable-next-line:no-console
                      console.log(error);
                      Alert.alert(error);
                    });
                }
              });
            }}
          />
          <Button title="reset" onPress={() => this.ref.current!.reset()} />
        </View>
      </Container>
    );
  }
}
