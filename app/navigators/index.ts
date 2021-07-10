import AppContainer from "./AppNavigator";
import TabNavigator from "./TabNavigator";

export type Screens =
  | "SplashScreen"
  | "LandingScreen"
  | "StagedSignUpScreen"
  | "WelcomeScreen"
  | "SignInScreen"
  | "ForgotPasswordScreen"
  | "EmailNotificationScreen";
export default AppContainer;
export { TabNavigator };
