import _ from "lodash";
import { Body, Footer, Right } from "native-base";
import React, { Component } from "react";
import {
  Image,
  ImageStyle,
  StatusBar,
  StyleProp,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import { NavigationScreenProps } from "react-navigation";
import Images from "assets/images";
import HairlineSeparatorWithText from "components/HairlineSeperator";
import { SocialProviderAuthCarousel } from "components/SocialIconCarousel/SocialIconCarousel";
import { Colors } from "config/styles";
import strings from "./strings";
import styles from "./styles";
import { Box } from "app/components";
export default class LandingScreen extends Component<
  NavigationScreenProps,
  {}
> {
  constructor(props: NavigationScreenProps) {
    super(props);
    this.goToScreen = this.goToScreen.bind(this);
  }

  public goToScreen(screenId: string) {
    this.props.navigation.navigate(screenId);
  }

  public render() {
    return (
      <Box flex={1}>
        <StatusBar
          networkActivityIndicatorVisible={true}
          hidden={true}
          barStyle={"default"}
          translucent={true}
        />
        <Box>
          <Image
            style={styles.skipButton as StyleProp<ImageStyle>}
            source={Images.skip}
          />
          <Image
            style={styles.pluggLogo as StyleProp<ImageStyle>}
            source={Images.pluggLogo}
          />
          <Image
            style={styles.landingImage as StyleProp<ImageStyle>}
            source={Images.landingBackground}
          />
          <View style={styles.imageOverlayTextContainer}>
            <Text style={styles.imageOverlayTextA}>{strings.overlayLineA}</Text>
            <Text style={styles.imageOverlayTextB}>{strings.overlayLineB}</Text>
          </View>
        </Box>
        <TouchableHighlight
          style={styles.signUpButton}
          underlayColor={Colors.bordeauxA650}
          onPress={() => this.goToScreen("SignUp")}
        >
          <Text style={styles.signUpText}> {strings.signUpWithEmail} </Text>
        </TouchableHighlight>
        {HairlineSeparatorWithText({ separatorText: strings.hairlineSep })}
        <SocialProviderAuthCarousel
          onSuccess={() => this.goToScreen("Home")}
          // tslint:disable-next-line:no-console
          onFailure={err => console.error(err)}
          navigation={this.props.navigation}
        />
        <Footer style={styles.footer}>
          <Body>
            <Text style={styles.footerBody}>{strings.mainFooter}</Text>
          </Body>
          <Right>
            <Text
              onPress={() => this.goToScreen("SignIn")}
              style={styles.footerRight}
            >
              {strings.login}
            </Text>
          </Right>
        </Footer>
      </Box>
    );
  }
}

export const AuthFooter = (onPress: () => void) => (
  <Footer style={styles.footer}>
    <Body>
      <Text style={styles.footerBody}>{strings.mainFooter}</Text>
    </Body>
    <Right>
      <Text onPress={onPress} style={styles.footerRight}>
        {strings.login}
      </Text>
    </Right>
  </Footer>
);
