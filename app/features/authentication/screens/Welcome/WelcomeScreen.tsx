import { Container, Header, Input } from "native-base";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import { verticalScale } from "react-native-size-matters/extend";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import AuthApi from "../../../../api/auth";
import Button from "../../../../components/Button";
import Fonts from "../../../../config/Fonts";
import { buttons, Colors, text } from "../../../../config/styles";
import { Layout } from "../../../../config/styles";
import { IUser } from "../../../../models/IUser";
import { GetPropsFromDispatch } from "../../../../store/ActionCreators";
import AppActions from "../../../../store/AppActions";
import { StateStore } from "../../../../store/AppReducer";
import { IUsername } from "../../../../types/auth";
import Storage from "../../../../utils/storage";
import strings from "./strings";
import styles from "./styles";
import NavigationService from "utils/NavigationService";

type TStateProps = ReturnType<typeof mapStateToProps>;
type TBindActionCreators = typeof AppActions;
type TDispatchProps = GetPropsFromDispatch<TBindActionCreators>;
type APIProps = TStateProps & TDispatchProps;
type Props = NavigationScreenProps & APIProps;
type State = IUsername;

class WelcomeScreen extends React.Component<Props, State> {
  state = {
    username: ""
  };

  async componentDidMount() {
    const username = await Storage.getPreferredUsername();
    if (username) {
      this.setState({ username });
    }
    const userInfo = (await Storage.getUserData()) as IUser;
    this.props.signIn(userInfo.auth);
  }

  render(): JSX.Element {
    return (
      <SafeAreaView style={Layout.verticalTopCenter}>
        <Header
          style={{ backgroundColor: Colors.transparent }}
          iosBarStyle={"light-content"}
          androidStatusBarColor={Colors.burgundy}
          transparent={true}
          noShadow={true}
        />
        <Text style={text.bold}> {strings.welcome} </Text>
        <Text style={[text.regularDark, { fontSize: Fonts.size.input }]}>
          {"@".concat(this.state.username)}
        </Text>
        <Text style={text.regularDark}> {strings.subtitleA} </Text>
        <Text style={text.regularDark}> {strings.subtitleB} </Text>
        <View
          style={[
            Layout.horizontalLeftAlign,
            { backgroundColor: Colors.whiteTwo, alignContent: "space-between" }
          ]}
        />
        <View
          style={{
            marginTop: 50,
            marginBottom: 300
          }}
        >
          {Button(
            strings.nextButton,
            buttons.mainButton,
            styles.signUpText,
            Colors.lightBurgundy,
            () => {
              NavigationService.navigate("SignIn");
            }
          )}
          <Text
            style={[text.regularRed, { marginTop: verticalScale(20) }]}
            onPress={() => {
              NavigationService.navigate("ChangeUsername");
            }}
          >
            {` ${strings.changeUsername} `}
          </Text>
        </View>
      </SafeAreaView>
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
)(WelcomeScreen);
