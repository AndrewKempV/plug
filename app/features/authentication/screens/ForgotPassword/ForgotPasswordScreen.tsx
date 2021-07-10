import React from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  StatusBar,
  Text
} from "react-native";

import {
  Body,
  Button as NativeButton,
  Container,
  Header,
  Icon,
  Input,
  Left,
  Right
} from "native-base";

import { Auth } from "aws-amplify";
import { scale, verticalScale } from "react-native-size-matters/extend";
import IoniconIcon from "react-native-vector-icons/Ionicons";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import AuthApi, { forgotPassword } from "../../../../api/auth";
import { Button } from "../../../../components/SignUpForm/SignUpFormExt";
import Fonts from "../../../../config/Fonts";
import Metrics, { isIPhoneX } from "../../../../config/metrics";
import { Colors, Layout, text } from "../../../../config/styles";
import { GetPropsFromDispatch } from "../../../../store/ActionCreators";
import AppActions from "../../../../store/AppActions";
import { StateStore } from "../../../../store/AppReducer";
import Storage from "../../../../utils/storage";
import strings from "./strings";
import styles from "./styles";

interface State {
  username: string;
  authCode: string;
  newPassword: string;
  fadeIn: Animated.Value;
  fadeOut: Animated.Value;
  isHidden: boolean;
}

const initialState = {
  username: "",
  authCode: "",
  newPassword: "",
  fadeIn: new Animated.Value(0), // Initial value for opacity: 0
  fadeOut: new Animated.Value(1), // Initial value for opacity: 1
  isHidden: false
};

type TStateProps = ReturnType<typeof mapStateToProps>;
// needed to properly type dispatch props type
type TBindActionCreators = typeof AppActions;
type TDispatchProps = GetPropsFromDispatch<TBindActionCreators>;
type APIProps = TStateProps & TDispatchProps;
type ForgotPasswordProps = NavigationScreenProps & APIProps;

const FormHeaderSection: JSX.Element = (
  <Text
    style={[
      text.regularDark,
      {
        fontWeight: "500",
        fontSize: Fonts.size.medium,
        marginHorizontal: scale(Metrics.margin + 2),
        marginVertical: verticalScale(Metrics.margin),
        color: Colors.blackTwo
      }
    ]}
  >
    {strings.inputPrompt}
  </Text>
);

class ForgetPasswordScreen extends React.Component<ForgotPasswordProps, State> {
  constructor(props: ForgotPasswordProps) {
    super(props);
    this.state = initialState;
  }

  public componentDidMount() {
    this.setState(initialState);
  }

  public fadeIn() {
    Animated.timing(this.state.fadeIn, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();
    this.setState({ isHidden: true });
  }

  public fadeOut() {
    Animated.timing(this.state.fadeOut, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true
    }).start();
    this.setState({ isHidden: false });
  }

  public onChangeText(key: string, value: string) {
    switch (key) {
      case "username":
        this.setState({ username: value });
        break;
      case "authCode":
        this.setState({ authCode: value });
        break;
      case "newPassword":
        this.setState({ newPassword: value });
    }
  }
  // Request a new password
  public forgotPassword(input: string) {
    AuthApi.forgotPassword(input)
      .then(result => {
        if (result.state === "NEW_PASSWORD_REQUIRED") {
          Storage.setTempValue(input);
          this.props.navigation.navigate("EmailNotification");
        } else {
          Alert.alert(`${input} is not a registered member of PLUGG`);
        }
      })
      .catch(error => {
        if (!error.message) {
          Alert.alert("Error while setting up the new password: ", error);
        } else {
          Alert.alert(
            "Error while setting up the new password: ",
            error.message
          );
        }
      });
  }
  // Upon confirmation redirect the user to the Sign In page
  public async forgotPasswordSubmit() {
    const { username, authCode, newPassword } = this.state;
    await Auth.forgotPasswordSubmit(username, authCode, newPassword)
      .then(() => {
        this.props.navigation.navigate("SignIn");
        // console.log('the New password submitted successfully')
      })
      .catch(err => {
        if (!err.message) {
          // console.log('Error while confirming the new password: ', err)
          Alert.alert("Error while confirming the new password: ", err);
        } else {
          // console.log('Error while confirming the new password: ', err.message)
          Alert.alert("Error while confirming the new password: ", err.message);
        }
      });
  }
  public render() {
    return (
      <Container>
        <Header
          style={{ backgroundColor: Colors.transparent }}
          iosBarStyle={"light-content"}
          translucent={true}
          androidStatusBarColor={Colors.burgundy}
          transparent={true}
          noShadow={false}
        >
          <StatusBar
            networkActivityIndicatorVisible={true}
            hidden={false}
            barStyle={"default"}
            translucent={true}
          />
          <Left>
            <NativeButton
              transparent={true}
              onPressIn={() => this.props.navigation.navigate("SignIn")}
            >
              <IoniconIcon
                style={{ paddingLeft: scale(Metrics.margin) }}
                name={"ios-arrow-back"}
                color={Colors.black}
                size={Metrics.icons.small}
                onPress={() => this.props.navigation.navigate("SignIn")}
              />
            </NativeButton>
          </Left>
          <Body>
            <Text style={styles.screenTitle}>
              {strings.forgotPasswordTitle}
            </Text>
          </Body>
          <Right />
        </Header>
        <KeyboardAvoidingView
          style={[
            Layout.container,
            Layout.alignCentered,
            { marginBottom: verticalScale(isIPhoneX() ? 315 : 300) }
          ]}
          behavior={"padding"}
          enabled={true}
          keyboardVerticalOffset={23}
        >
          {FormHeaderSection}
          <Input
            selectionColor={Colors.darkMauve}
            placeholder={strings.emailOrUsername}
            textContentType={"emailAddress"}
            style={styles.formInput}
            autoCorrect={false}
            keyboardType={"email-address"}
            autoCapitalize={"none"}
            returnKeyType={"next"}
            blurOnSubmit={false}
            value={this.state.username}
            editable={true}
            onChangeText={value => this.onChangeText("username", value)}
            secureTextEntry={false}
            autoFocus={true}
          />
          {Button(
            () => this.forgotPassword(this.state.username),
            this.state.username.length > 3,
            strings.sendEmail
          )}
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

const mapStateToProps = (state: StateStore) => ({
  AuthState: state.authReducer
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<TBindActionCreators, TDispatchProps>(AppActions, dispatch);

export default connect<TStateProps, TDispatchProps, {}, StateStore>(
  mapStateToProps,
  mapDispatchToProps
)(ForgetPasswordScreen);
