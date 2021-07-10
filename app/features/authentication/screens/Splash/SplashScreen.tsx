import { Auth } from "aws-amplify";
import React, { Component } from "react";
import { Animated, Easing, Image, View } from "react-native";
import { verticalScale } from "react-native-size-matters/extend";
import SplashScreenController from "react-native-splash-screen";
import { NavigationScreenProps } from "react-navigation";
import { ApiClient } from "../../../../api/client";
import images from "../../../../assets/images";
import styles from "./styles";

interface State {
  userToken: string;
}
const initState = {
  userToken: ""
};

class SplashScreen extends Component<NavigationScreenProps, State> {
  public readonly state: State = initState;

  private animatedLogoHeight: Animated.Value = new Animated.Value(0);

  // Get the logged in users and remember them
  public loadApp = async () => {
    await Auth.currentAuthenticatedUser()
      .then(user => {
        // tslint:disable-next-line:no-console
        ApiClient.instance
          .createUserProfile({})
          .then(response => console.log(response))
          .catch(error => console.warn(error));
        // tslint:disable-next-line:no-console
        console.log(user);
        this.setState({
          userToken: user.signInUserSession.accessToken.jwtToken
        });
      })
      .catch(err => err);
  };

  public async componentDidMount() {
    SplashScreenController.hide();
    await this.loadApp();
    Animated.sequence([
      Animated.delay(800),
      Animated.timing(this.animatedLogoHeight, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }),
      Animated.delay(100)
    ]).start(() =>
      this.props.navigation.navigate(this.state.userToken ? "Home" : "Landing")
    );
  }

  public render() {
    // interpolate the vertical position of the logo
    const translate = this.animatedLogoHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -verticalScale(280)]
    });
    const logoTransform = {
      transform: [{ translateY: translate }]
    };

    return (
      <View style={styles.container}>
        <Animated.View style={[logoTransform, styles.image]}>
          <Image source={images.pluggLogo} resizeMode="contain" />
        </Animated.View>
      </View>
    );
  }
}

export default SplashScreen;
