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
import React from "react";
import {
  Image,
  StatusBar,
  StyleProp,
  Text,
  TextStyle,
  View
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import IoniconIcon from "react-native-vector-icons/Ionicons";
import { NavigationScreenProps } from "react-navigation";
import Images from "../../../../assets/images";
import Fonts from "../../../../config/Fonts";
import Metrics from "../../../../config/metrics";
import { Colors, Layout, text } from "../../../../config/styles";
import { IUsername } from "../../../../types/auth";
import Storage from "../../../../utils/storage";
import { AuthFooter } from "../Landing/LandingScreen";
import strings from "./strings";
import styles from "./styles";

const FormHeaderItem = (sectionText: string, style?: StyleProp<TextStyle>) => (
  <Text style={[text.regularDark, { fontSize: Fonts.size.medium }, style]}>
    {sectionText}
  </Text>
);

const UsernameSection = (username: string) => (
  <View style={[Layout.horizontalLeftAlign, styles.notificationA]}>
    {FormHeaderItem(username, [text.bold, { fontSize: Fonts.size.medium }])}
    {FormHeaderItem(strings.notificationInfoB)}
  </View>
);

const CallToAction = (
  <Text
    style={[
      text.bold,
      { marginTop: verticalScale(10), marginBottom: verticalScale(10) }
    ]}
  >
    {" "}
    {strings.callToAction}{" "}
  </Text>
);
const MailingImage = (
  <Image source={Images.mailing} style={styles.inboxImage} />
);

type State = IUsername;
const initialState: State = { username: "" };
export default class EmailNotificationScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  public state = initialState;

  public componentWillMount = async () => {
    const username = await Storage.getTempValue();
    if (!_.isNil(username)) {
      this.setState({ username });
    }
  };

  public render = (): JSX.Element => {
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
            <Button
              transparent={true}
              onPressIn={() => this.props.navigation.navigate("ForgotPassword")}
            >
              <IoniconIcon
                style={{ paddingLeft: scale(Metrics.margin) }}
                name={"ios-arrow-back"}
                color={Colors.black}
                size={Metrics.icons.small}
                onPress={() => this.props.navigation.navigate("ForgotPassword")}
              />
            </Button>
          </Left>
          <Body>
            <Text style={styles.screenTitle}>{strings.screenTitle}</Text>
          </Body>
          <Right />
        </Header>

        {MailingImage}
        {CallToAction}
        <View
          style={[Layout.verticalLeftAlign, { alignContent: "space-between" }]}
        >
          {FormHeaderItem(strings.notificationInfoA, styles.notificationA)}
          {UsernameSection(this.state.username)}
          {FormHeaderItem(strings.notificationInfoC, styles.notificationB)}
        </View>
        {AuthFooter(() => {
          this.props.navigation.navigate("SignIn");
        })}
      </Container>
    );
  };
}
