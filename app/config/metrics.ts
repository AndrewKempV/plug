import { Dimensions, Platform, StatusBar } from "react-native";

const IS_ANDROID = Platform.OS === "android";
const IS_IOS = Platform.OS === "ios";
const { height, width } = Dimensions.get("window");
import {
  moderateScale,
  scale,
  verticalScale
} from "react-native-size-matters/extend";

/**
 * @description Determines if the application is running on an iPhone X.
 */
export function isIPhoneX() {
  return (
    Platform.OS === "ios" &&
    (height === 812 || width === 812 || (height === 896 || width === 896))
  );
}
/**
 * @description Selects the style w/ respect to the host device (ie. if running on iPhone X then iPhone X style will be selected)
 *  If not, the @param regularStyle will be selected.
 *
 * @param regularStyle Style configuration if host device is not an iPhone X
 * @param iphoneXStyle Style if host device is an iPhone X
 */
export function ifIPhoneX(iphoneXStyle: any, regularStyle: any) {
  if (isIPhoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
}
/**
 * @description Selects status bar height with respect to platform.
 * @param safe
 */
export function getStatusBarHeight(safe: boolean) {
  return Platform.select({
    ios: ifIPhoneX(safe ? 44 : 30, 20),
    android: StatusBar.currentHeight
  });
}
/**
 * @description Selects amount of unsafe bottom space.
 */
export function getBottomSpace() {
  return isIPhoneX() ? 34 : 0;
}

export const Metrics = {
  searchBarHeight: 30,
  statusBarHeight: getStatusBarHeight(isIPhoneX()), // 24
  navBarHeight: Platform.select({
    android: verticalScale(54),
    ios: verticalScale(64)
  }),
  DEVICE_HEIGHT: Platform.select({ android: height - 24, ios: height }),
  DEVICE_WIDTH: width,
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  section2x: 50,
  margin: 10,
  margin2x: 20,
  margin4x: 40,
  marginHalf: 5,
  largeMargin: 70,

  horizontalLineHeight: 1,

  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width, // IS_ANDROID ? height - 24 : height,
  spacing: {
    marginHalf: 5,
    margin: 10,
    margin2x: 20,
    margin4x: 40
  },
  icons: {
    xxsmall: 15,
    xsmall: 20,
    small: 25,
    medium: 30,
    large: 45,
    xl: 50
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 200
  }
};

export default Metrics;
