import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Metrics, { isIPhoneX } from "config/metrics";
import { Colors, Fonts } from "config/styles";
import debugStyleSheet from "utils/LayoutDebugger";
const horizontalMargin = scale(268);

// const styles = StyleSheet.create({
const styles = StyleSheet.create({
  buttonCarousel: {
    flexDirection: "row",
    marginLeft: scale(60),
    marginRight: scale(20),
    marginTop: verticalScale(20)
  },
  container: {
    flex: 1
  },
  footer: {
    backgroundColor: Colors.paleGrey,
    borderColor: Colors.paleGrey,
    borderStyle: "solid",
    borderWidth: 1,
    width: "100%"
  },
  footerBody: {
    color: Colors.onyx,
    fontFamily: "HelveticaNeue",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal",
    height: verticalScale(60),
    letterSpacing: 0.6,
    lineHeight: verticalScale(35),
    marginLeft: scale(80),
    marginRight: scale(113),
    marginTop: isIPhoneX() ? 0 : verticalScale(10),
    textAlign: "center",
    width: scale(152)
  },
  footerRight: {
    color: Colors.burgundy,
    fontFamily: "HelveticaNeue",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "500",
    height: verticalScale(60),
    letterSpacing: 0,
    lineHeight: verticalScale(35),
    marginRight: verticalScale(93),
    marginTop: isIPhoneX() ? 0 : verticalScale(10),
    textAlign: "center",
    width: scale(44)
  },
  hairline: {
    backgroundColor: Colors.charcoalGrey,
    height: 1,
    marginTop: verticalScale(10),
    width: scale(96)
  },
  hairlineSepText: {
    alignSelf: "center",
    color: Colors.charcoalGrey,
    fontFamily: "HelveticaNeue",
    fontSize: 14,
    fontWeight: "normal",
    paddingBottom: scale(5),
    paddingHorizontal: scale(5)
  },
  imageContainer: {
    borderRadius: 23.1,
    height: 46.2,
    marginHorizontal: scale(20),
    width: 46.2
  },
  imageOverlayTextA: {
    color: Colors.snow,
    fontFamily: "HelveticaNeue",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "500",
    height: verticalScale(44),
    letterSpacing: 0,
    lineHeight: verticalScale(25),
    marginHorizontal: (Metrics.DEVICE_WIDTH - horizontalMargin) / 2,
    paddingTop: verticalScale(20),
    textAlign: "center",
    textShadowColor: Colors.onyx,
    textShadowOffset: {
      width: 0,
      height: verticalScale(6)
    },
    textShadowRadius: 12,
    width: scale(268)
  },
  imageOverlayTextB: {
    color: Colors.snow,
    fontFamily: "HelveticaNeue",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "500",
    height: verticalScale(44),
    letterSpacing: 0,
    lineHeight: verticalScale(25),
    marginHorizontal: (Metrics.DEVICE_WIDTH - horizontalMargin) / 2,
    textAlign: "center",
    textShadowColor: Colors.onyx,
    textShadowOffset: {
      width: 0,
      height: verticalScale(6)
    },
    textShadowRadius: 12,
    width: scale(268)
  },
  imageOverlayTextContainer: {
    flexDirection: "column",
    paddingTop: verticalScale(428.5),
    position: "absolute",
    zIndex: 1
  },
  landingImage: {
    height: verticalScale(504),
    zIndex: 0
  },
  nextIcon: {
    height: 12,
    marginRight: scale(45),
    marginTop: verticalScale(10),
    width: 12
  },
  pluggLogo: {
    alignContent: "center",
    justifyContent: "flex-start",
    marginHorizontal: scale(115),
    marginTop: verticalScale(108.5),
    position: "absolute",
    zIndex: 1
  },
  separatorContainer: {
    flexDirection: "row",
    marginHorizontal: scale(70)
  },
  signUpButton: {
    backgroundColor: Colors.burgundy,
    borderRadius: 30,
    height: verticalScale(52),
    marginHorizontal: scale(40),
    marginVertical: verticalScale(26),
    width: scale(295.4)
  },
  signUpText: {
    color: Colors.snow,
    fontFamily: Fonts.type.base,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: verticalScale(50),
    textAlign: "center",
    textAlignVertical: "center"
  },
  skipButton: {
    alignContent: "center",
    justifyContent: "flex-start",
    marginLeft: scale(296),
    marginRight: scale(15),
    marginTop: verticalScale(65),
    position: "absolute",
    zIndex: 1
  },
  socialIcon: {
    borderRadius: 23.1,
    height: 46.2,
    width: 46.2
  }
});

export default styles;
