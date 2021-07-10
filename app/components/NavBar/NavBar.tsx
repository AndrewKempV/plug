import {
  Body,
  Button,
  Container,
  Header,
  Icon,
  Left,
  Right,
  Text
} from "native-base";
import React, { Component } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { NavigationScreenProps } from "react-navigation";
import Metrics from "../../config/metrics";
import { Colors, Layout } from "../../config/styles";
import strings from "./strings";
import styles from "./styles";

export interface NavBarProps {
  title?: string;
  titleStyle?: StyleProp<ViewStyle>;
  leftComponent?: JSX.Element;
  rightComponent?: JSX.Element;
  centerComponent?: JSX.Element;
  isKeyboardShowing: boolean;
  onPress?: () => void;
}

const additionalStyles = {
  marginHorizontal: 100,
  width: 190,
  height: Metrics.navBarHeight
};

// <View style={[Layout.horizontal, {alignContent: 'space-between'}]}></View>

export default class NavBar extends Component<
  NavigationScreenProps & NavBarProps,
  {}
> {
  public render(): JSX.Element {
    return (
      <Container>
        <Header
          style={{ backgroundColor: Colors.transparent }}
          iosBarStyle={"light-content"}
          androidStatusBarColor={Colors.burgundy}
          transparent={false}
          noShadow={false}
        >
          {this.props.leftComponent !== null ? (
            this.props.leftComponent
          ) : (
            <Left>
              <Button transparent={true} onPressIn={this.props.onPress}>
                <Icon
                  name={this.props.isKeyboardShowing ? "x" : "arrow-back"}
                  fontSize={Metrics.icons.medium}
                  style={{ color: Colors.black }}
                  onPress={this.onPress}
                />
              </Button>
            </Left>
          )}
          {this.props.centerComponent !== null ? (
            this.props.centerComponent
          ) : (
            <Body>
              <Text
                style={
                  this.props.titleStyle === null
                    ? styles.defaultTitleStyle
                    : this.props.titleStyle
                }
              >
                {this.props.title !== null
                  ? this.props.title
                  : strings.titlePlaceholder}
              </Text>
            </Body>
          )}
          {this.props.rightComponent !== null ? (
            this.props.rightComponent
          ) : (
            <Right />
          )}
        </Header>
      </Container>
    );
  }

  public onPress = () =>
    this.props.onPress !== null
      ? this.props.navigation.navigate("LandingScreen")
      : this.props.onPress!();
}
