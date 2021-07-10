import {
  createAppContainer,
  NavigationRouteConfigMap,
  createStackNavigator
} from "react-navigation";

import createAnimatedSwitchNavigator from "react-navigation-animated-switch";
import AccountConfirmationScreen from "../features/authentication/screens/AccountConfirmation";
import ChangeUsernameScreen from "../features/authentication/screens/ChangeUsername";
import EmailNotificationScreen from "../features/authentication/screens/EmailNotification";
import ForgotPasswordScreen from "../features/authentication/screens/ForgotPassword";
import LandingScreen from "../features/authentication/screens/Landing";
import LocationScreen from "../features/authentication/screens/Location";
import SignInScreen from "../features/authentication/screens/SignIn";
import StagedSignUpScreen from "../features/authentication/screens/SignUp";
import SplashScreen from "../features/authentication/screens/Splash";
import WelcomeScreen from "../features/authentication/screens/Welcome";
import EditProfileScreen from "../features/profile/screens/EditProfile";
import BottomTabNavigator from "./TabNavigator";
import ChangeLocationScreen from "../features/settings/screens/ChangeLocation";
import EventDetailScreen from "app/features/event/screens/EventDetails";
import { Platform } from "react-native";
import { fromRight, fromBottom } from "app/utils/animations";
import OtherProfileScreen from "app/features/profile/screens/OtherProfile";
import OtherProfilePopupScreen from "app/features/profile/screens/OtherProfilePopup";
import CreateEventScreen from "app/features/event/screens/CreateEvent";

const fromRightConfig = () => fromRight(500);

const EventDetailStack = createStackNavigator(
  {
    EventDetail: EventDetailScreen,
    OtherProfile: OtherProfileScreen,
    OtherProfilePopup: OtherProfilePopupScreen
  },
  {
    initialRouteName: "EventDetail",
    headerMode: "none",
    mode: Platform.select({ ios: "modal", android: "card" }),
    transitionConfig: fromRightConfig
  }
);

const routConfigMap: NavigationRouteConfigMap = {
  Splash: SplashScreen,
  Landing: LandingScreen,
  SignUp: StagedSignUpScreen,
  Welcome: WelcomeScreen,
  SignIn: SignInScreen,
  ForgotPassword: ForgotPasswordScreen,
  EmailNotification: EmailNotificationScreen,
  AccountConfirmation: AccountConfirmationScreen,
  ChangeUsername: ChangeUsernameScreen,
  Home: BottomTabNavigator,
  Location: LocationScreen,
  EditProfile: EditProfileScreen,
  ChangeHomeLocation: ChangeLocationScreen,
  EventDetailStack
};

const AppNavigator = createAnimatedSwitchNavigator(routConfigMap);
const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
