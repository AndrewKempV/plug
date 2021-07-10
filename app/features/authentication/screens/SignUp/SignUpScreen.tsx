import _ from "lodash";
import {
  Body,
  Button,
  Container,
  Header,
  Icon,
  Left,
  Right
} from "native-base";
import React, { Component } from "react";
import {
  Alert,
  NativeSyntheticEvent,
  StatusBar,
  Text,
  TextInputFocusEventData,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import IoniconIcon from "react-native-vector-icons/Ionicons";
import { NavigationScreenProps } from "react-navigation";
import AuthApi from "../../../../api/auth";
import strings from "../../../../components/SignUpForm/strings";
import styles from "../../../../components/SignUpForm/styles";
import Fonts from "../../../../config/Fonts";
import Metrics from "../../../../config/metrics";
import { Colors, Layout } from "../../../../config/styles";
import { APIActionStatus } from "../../../../models/ApiActionStatus";
import { IUser } from "../../../../models/IUser";
import Storage from "../../../../utils/storage";
import { emailForm, fullNameForm, passwordForm, steps } from "./Forms";

interface State {
  StepIndex: number;
  apiExecutorStatus: APIActionStatus;
  user: IUser;
}

interface Props {
  apiExecutorStatus: APIActionStatus;
}
const initVars = {
  username: "",
  password: ""
};

const initAttrs = {
  preferred_username: "",
  given_name: "",
  family_name: "",
  phone_number: "",
  gender: "",
  email: ""
};
const cognitoUser = {
  auth: initVars,
  attributes: initAttrs
};
const initState = {
  user: cognitoUser,
  StepIndex: 0,
  apiExecutorStatus: APIActionStatus.STARTED
};

export type SignUpScreenProps = Props & NavigationScreenProps;

class StagedSignUpScreen extends Component<SignUpScreenProps, State> {
  public scrollRef: KeyboardAwareScrollView | null = null;

  constructor(props: SignUpScreenProps) {
    super(props);
    this.state = initState;
    this.goToStep = this.goToStep.bind(this);
  }

  public goToStep = (step: number): void => this.setState({ StepIndex: step });

  public goToNextForm = (): void =>
    this.setState({ StepIndex: this.state.StepIndex + 1 });

  public goBackOneForm = (): void =>
    this.setState({ StepIndex: this.state.StepIndex - 1 });

  public onSubmit = (value: string, second?: string) => {
    switch (steps[this.state.StepIndex]) {
      case "email":
        this.state.user.auth.username = value.replace(" ", "");
        this.goToNextForm();
        break;
      case "password":
        this.state.user.auth.password = value;
        this.goToNextForm();
        break;
      case "name":
        this.state.user.attributes.given_name = value.replace(" ", "");
        this.state.user.attributes.family_name = second!.replace(" ", "");
        this.state.user.attributes.preferred_username = `${value}.${second!}`
          .toLowerCase()
          .replace(" ", "");
        this.state.user.attributes.email = this.state.user.auth.username!;
        AuthApi.signUp(this.state.user.auth, this.state.user.attributes)
          .then(result => {
            if (
              result.state === "ConfirmAccountCodeNotAccepted" ||
              result.state === "ConfirmAccountCodeWaiting"
            ) {
              Alert.alert(
                `A confirmation code has been sent to ${this.state.user.auth.username}`
              );
              Storage.setUserData(JSON.stringify(this.state.user)).then(() =>
                this.props.navigation.navigate("AccountConfirmation")
              );
            } else if (
              result.state === "Unauthenticated" ||
              result.state === "Authenticated" ||
              result.state === "ConfirmAccountCodeAccepted"
            ) {
              Alert.alert(
                `${this.state.user.auth.username} is already a registered member of PLUGG.\nPlease log in.`
              );
              this.props.navigation.navigate("SignIn");
            }
            return result;
          })
          // tslint:disable-next-line:no-console
          .catch(error => console.error(error.message));
      default:
        break;
    }
  };
  public scrollToY = (height: number) => {
    if (!_.isNil(this.scrollRef)) {
      this.scrollRef.scrollToPosition(0, height, true);
    }
  };

  public handleFocus = (target?: number) => this.scrollToY(target! - 60);
  public isInBounds = (): boolean => this.state.StepIndex < steps.length - 1;

  public isFirstStep = (): boolean => this.state.StepIndex === 0;

  public renderForm(): JSX.Element {
    if (this.isInBounds()) {
      switch (steps[this.state.StepIndex]) {
        case "email":
          return (
            <View style={{ marginTop: 30 }}>
              {emailForm(this.onSubmit, this.props.navigation)}
            </View>
          );

        case "password":
          return (
            <View style={{ marginTop: 30 }}>
              {passwordForm(this.onSubmit, this.props.navigation)}
            </View>
          );

        case "name":
          return fullNameForm(
            this.onSubmit,
            this.props.navigation,
            this.handleFocus
          );

        default:
          return <View />;
      }
    } else {
      return <View />;
    }
  }

  public render(): JSX.Element {
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
            <Button
              transparent={true}
              onPressIn={() =>
                this.isFirstStep()
                  ? this.props.navigation.navigate("Landing")
                  : this.goBackOneForm()
              }
            >
              <IoniconIcon
                style={{ paddingLeft: Metrics.margin }}
                name={"ios-arrow-back"}
                color={Colors.black}
                size={Metrics.icons.small}
                onPress={() =>
                  this.isFirstStep()
                    ? this.props.navigation.navigate("Landing")
                    : this.goBackOneForm()
                }
              />
            </Button>
          </Left>
          <Body>
            <Text
              style={[
                styles.formQuestionText,
                {
                  fontSize: Fonts.size.h7,
                  letterSpacing: -0.36,
                  fontWeight: "500"
                }
              ]}
            >
              {strings.signUpScreenTitle}
            </Text>
          </Body>
          <Right />
        </Header>
        {this.renderForm()}
      </Container>
    );
  }
}
export default StagedSignUpScreen;
