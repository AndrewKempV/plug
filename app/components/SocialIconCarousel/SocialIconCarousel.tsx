import { Auth } from "aws-amplify";
import _ from "lodash";
import { stringify } from "querystring";
import React from "react";
import {
  Alert,
  Image,
  ImageStyle,
  Linking,
  Platform,
  StyleProp,
  TouchableHighlight,
  ViewStyle,
} from "react-native";
import DeepLinking from "react-native-deep-linking";
import { NavigationScreenProps } from "react-navigation";
import AuthApi, { IdentityProviderSignInRequest } from "../../api/auth";
import config from "../../config/aws-exports";
import Theme from "../../config/Theme";
import { ValueOrDefault } from "../../utils/helpers";
import { extract, parse } from "../../utils/QueryUtils";
import { Storage } from "../../utils/storage";
import Carousel from "../Carousel";
import { ImageButtonType } from "../Carousel/Carousel";
import { SocialIcons, SocialIdentityProviderType } from "./constants";
import styles from "./styles";
import InAppBrowser from "react-native-inappbrowser-reborn";

const type = "token";
const scope = "openid+profile";
const callback = "com.pluggnation.plugg://login";
const domain = "plugg-dev.auth.us-east-1.amazoncognito.com";
// const HOSTED_UI_LOGIN_URL = `https://plugg-dev.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=s9rq2n70qf7n350m67hqd6gnu&redirect_uri=com.pluggnation.plugg://login`;
const encodeIdentityProviderLoginUri = (
  provider: SocialIdentityProviderType
) => {
  const verification = generateVerification();
  return `https://${domain}/authorize?identity_provider=${provider}&response_type=${type}&client_id=${config.userPoolWebClientId}&redirect_uri=${callback}&state=${verification}&scope=${scope}`;
};
DeepLinking.addScheme("com.pluggnation.plugg://");
// tslint:disable-next-line:no-console
DeepLinking.addRoute("/login", (response: any) => {
  console.log(response.url);
});
interface IdentityProviderLoginEvent {
  url: string;
}
interface SocialIconCarouselProps {
  containerStyle?: StyleProp<ViewStyle>;
  scrollViewContainerStyle?: StyleProp<ViewStyle>;
  marginRight?: number;
  viewSize?: number;
  onPress?: (url: string) => void;
}

const defaultSize = 3;
class SocialIconCarousel extends React.Component<SocialIconCarouselProps> {
  public render = () => (
    <Carousel
      style={ValueOrDefault(this.props.containerStyle, styles.buttonCarousel)}
      contentContainerStyle={this.props.scrollViewContainerStyle}
      marginRight={this.props.marginRight}
      data={SocialIcons}
      viewSize={ValueOrDefault(this.props.viewSize, defaultSize)}
      renderItem={this.renderItem}
    />
  );

  public renderItem = ({
    item,
    index,
  }: {
    item: ImageButtonType;
    index: number;
  }) => (
    <TouchableHighlight
      style={styles.imageContainer}
      onPress={() => this.handlePress({ item, index })}
    >
      <Image
        style={styles.socialIcon as StyleProp<ImageStyle>}
        source={item.source}
      />
    </TouchableHighlight>
  );

  private handlePress = ({
    item,
    index,
  }: {
    item: ImageButtonType;
    index: number;
  }) => {
    if (
      !_.isNil(this.props.onPress) &&
      (item.type === "Facebook" || item.type === "Google")
    ) {
      this.props.onPress(encodeIdentityProviderLoginUri(item.type));
    } else {
      Alert.alert(`${item.type} sign in is not available.`);
    }
  };
}

interface AuthCallbackProps {
  onSuccess: () => void;
  onFailure: (error: any) => void;
}
type AuthWrapperProps = SocialIconCarouselProps & AuthCallbackProps;
// tslint:disable-next-line:max-classes-per-file
class SocialProviderAuthCarousel extends React.Component<
  AuthWrapperProps & NavigationScreenProps
> {
  public componentDidMount() {
    if (Platform.OS === "android") {
      Linking.addEventListener("url", this.eventHandler);
    } else {
      Linking.addEventListener("url", this.eventHandler);
    }
  }

  public componentWillUnmount() {
    Linking.removeEventListener("url", this.eventHandler);
  }

  public openLink = async (url: string) => {
    if (Platform.OS === "android") {
      try {
        if (await InAppBrowser.isAvailable()) {
          InAppBrowser.open(url, {
            dismissButtonStyle: "cancel",
            showTitle: false,
            enableUrlBarHiding: true,
            enableDefaultShare: true,
            forceCloseOnRedirection: true,
          })
            .then((value) => {
              console.log(value);
            })
            .catch((error) => console.warn(error));
        } else Linking.openURL(url);
      } catch (error) {
        Linking.openURL(url);
      }
    } else {
      if (await InAppBrowser.isAvailable()) {
        InAppBrowser.open(url, {
          dismissButtonStyle: "cancel",
          showTitle: true,
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: true,
        })
          .then((value) => {
            console.log(value);
          })
          .catch((error) => console.warn(error));
      }

      console.log(url);
    }
  };

  public eventHandler = (event: IdentityProviderLoginEvent) => {
    console.log(event);
    InAppBrowser.close();
    const qs = extract(event.url, "#");
    const response = parse(qs);
    const flowError = _.get(response, "error", undefined);
    if (flowError !== undefined) {
      Alert.alert("Social sign in has been cancelled");
    } else {
      const credentials = parse(qs) as Omit<
        IdentityProviderSignInRequest,
        "refresh_token"
      >;
      console.log(credentials);
      AuthApi.identityProviderSignIn(credentials)
        .then((result) => {
          if (result.state === "Authenticated") {
            Storage.RefreshCurrentUser();
            this.props.onSuccess();
          } else if (!_.isNil(result.error)) {
            this.props.onFailure(`Failed with error: ${result.error} `);
          } else {
            this.props.onFailure("Failed without an error");
          }
        })
        .catch((signInError) => {
          if (!_.isNil(this.props.onFailure)) {
            this.props.onFailure(signInError);
          }
          // tslint:disable-next-line:no-console
          console.error(signInError);
        });
    }
  };

  public render = () => {
    return (
      <SocialIconCarousel
        containerStyle={this.props.containerStyle}
        scrollViewContainerStyle={this.props.scrollViewContainerStyle}
        marginRight={ValueOrDefault(
          this.props.marginRight,
          Theme.Metrics.margin
        )}
        onPress={this.openLink}
      />
    );
  };
}

// generateVerification creates a random string for including in the OAuth2
// request, which is then validated in the response.
function generateVerification() {
  let code = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return code;
}
export { SocialProviderAuthCarousel };
export default SocialIconCarousel;
