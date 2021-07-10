import _ from "lodash";
import LottieView from "lottie-react-native";
import { Container, Header, Input } from "native-base";
import React from "react";
import {
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import AuthApi from "api/auth";
import { isIPhoneX } from "config/metrics";
import { Layout } from "config/styles";
import { Colors, text } from "config/styles";
import { GetPropsFromDispatch } from "store/ActionCreators";
import AppActions from "store/AppActions";
import { StateStore } from "store/AppReducer";
import { IUsername } from "../../../../types/auth";
import Storage from "utils/storage";
import strings from "../Welcome/strings";
import styles from "../Welcome/styles";
import otherStyles from "./styles";

type StateFromDispatch = ReturnType<typeof mapStateToProps>;
// needed to properly type dispatch props type
type ActionCreators = typeof AppActions;
type PropsFromDispatch = GetPropsFromDispatch<ActionCreators>;
type APIProps = StateFromDispatch & PropsFromDispatch;
type ChangeUserNameScreenProps = NavigationScreenProps & APIProps;
interface ProgressState {
  animationProgress: Animated.Value;
}

type State = IUsername & ProgressState;

const initialState = {
  username: "",
  animationProgress: new Animated.Value(0)
};

const Button = (
  onPress: () => void,
  isEnabled: boolean,
  buttonText?: string
) => (
  <TouchableHighlight
    style={[
      otherStyles.nextButton,
      { backgroundColor: isEnabled ? Colors.burgundy : Colors.darkMauve }
    ]}
    underlayColor={Colors.darkMauve}
    disabled={!isEnabled}
    onPress={() => onPress()}
  >
    <Text style={otherStyles.nextText}>
      {" "}
      {buttonText !== undefined ? buttonText : "Create"}{" "}
    </Text>
  </TouchableHighlight>
);
class ChangeUserNameScreen extends React.Component<
  ChangeUserNameScreenProps,
  State
> {
  public counter: number = 0;
  public checkAnimation: LottieView | null = null;
  public state = initialState;

  public constructor(props: ChangeUserNameScreenProps) {
    super(props);
    this.startCheckAnimation.bind(this);
    this.resetCheckAnimation.bind(this);
  }

  public componentDidMount = async () => {
    await this.refresh();
  };

  public onChangeUsername = (username: string) => {
    this.setState({ username });
    AuthApi.updatePreferredUsername(username)
      .then(result => {
        this.resetCheckAnimation();
        this.checkAnimation!.play();
        this.startCheckAnimation();
      })
      .catch(err => {
        // tslint:disable-next-line:no-console
        console.error(err);
      });
  };

  public shouldEnableCheckmark = async (isValid: boolean): Promise<boolean> => {
    if (!isValid) {
      this.resetCheckAnimation();
      return Promise.resolve(false);
    } else {
      await this.startCheckAnimation();
      return Promise.resolve(true);
    }
  };
  /**
   *  Starts the checkmark animation.
   */
  public startCheckAnimation = (): Promise<void> => {
    return new Promise<void>((resolve: () => void) => {
      Animated.timing(this.state.animationProgress, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear
      }).start(() => resolve());
    });
  };

  /**
   * @description Stops the checkmark animation.
   */
  public resetCheckAnimation = (): void => {
    this.state.animationProgress.stopAnimation();
    this.state.animationProgress.setValue(0);
  };

  public render = (): JSX.Element => {
    return (
      <Container style={[Layout.container, { flexDirection: "column" }]}>
        <Header
          style={{ backgroundColor: Colors.transparent }}
          iosBarStyle={"light-content"}
          androidStatusBarColor={Colors.burgundy}
          transparent={true}
          noShadow={true}
        >
          <StatusBar
            networkActivityIndicatorVisible={true}
            hidden={false}
            barStyle={"default"}
            translucent={true}
          />
        </Header>
        <Text style={text.bold}> {strings.welcome} </Text>
        <Text style={text.regularDark}> {strings.subtitleA} </Text>
        <Text style={text.regularDark}> {strings.subtitleB} </Text>
        <View style={{ marginTop: verticalScale(50) }}>
          <View
            style={[
              Layout.horizontalLeftAlign,
              { backgroundColor: Colors.whiteTwo }
            ]}
          >
            <Input
              selectionColor={Colors.darkMauve}
              placeholder={"Username"}
              textContentType={"username"}
              style={[styles.formInput, { paddingLeft: scale(60) }]}
              autoCorrect={false}
              keyboardType={"name-phone-pad"}
              autoCapitalize={"none"}
              returnKeyType={"next"}
              blurOnSubmit={false}
              autoFocus={true}
              value={this.state.username}
              editable={true}
              onChangeText={this.onChangeUsername}
              secureTextEntry={false}
            />
            <View
              style={[
                {
                  width: 16,
                  height: verticalScale(isIPhoneX() ? 50 : 57),
                  backgroundColor: Colors.whiteTwo,
                  paddingRight: 0,
                  marginRight: 0
                },
                Layout.alignRight
              ]}
            >
              {this.shouldEnableCheckmark(true) && (
                <LottieView
                  ref={ref => (this.checkAnimation = ref)}
                  source={require("../../../../assets/check-mark-circle-blue.json")}
                  progress={this.state.animationProgress}
                  autoPlay={false}
                  loop={false}
                  cacheStrategy="strong"
                  style={[
                    {
                      marginTop: verticalScale(5.25),
                      marginRight: 0,
                      width: 16,
                      height: 16,
                      backgroundColor: Colors.whiteTwo
                    },
                    Layout.alignRight
                  ]}
                />
              )}
            </View>
            <View
              style={{
                width: 40,
                height: verticalScale(isIPhoneX() ? 50 : 57),
                backgroundColor: Colors.whiteTwo,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <TouchableHighlight
                underlayColor={Colors.whiteTwo}
                style={[
                  {
                    flex: 1,
                    backgroundColor: Colors.whiteTwo,
                    paddingRight: scale(15),
                    marginRight: 0,
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "center"
                  }
                ]}
                onPress={() => this.generateNextUsername()}
              >
                <EntypoIcon name={"cw"} size={16} color={Colors.black} />
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <View style={{ marginTop: verticalScale(20) }}>
          {Button(
            () => this.props.navigation.navigate("SignIn"),
            true,
            `Let's Go`
          )}
        </View>
      </Container>
    );
  };

  private generateNextUsername = () => {
    const end = (this.counter++).toString();
    if (this.counter === 1) {
      this.setState({ username: this.state.username + end });
    } else {
      const str = this.state.username.substring(
        0,
        this.state.username.length - 1
      );
      this.setState({ username: str + end });
    }
    this.resetCheckAnimation();
    this.checkAnimation!.play();
    this.startCheckAnimation();
  };

  private refresh = async () => {
    const username = await Storage.getPreferredUsername();
    if (username) {
      this.setState({ username });
    }
  };
}

const mapStateToProps = (state: StateStore) => ({
  AuthState: state.authReducer
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<ActionCreators, PropsFromDispatch>(AppActions, dispatch);

export default connect<StateFromDispatch, PropsFromDispatch, {}, StateStore>(
  mapStateToProps,
  mapDispatchToProps
)(ChangeUserNameScreen);
