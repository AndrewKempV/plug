import { Platform, StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Metrics from "../../../../config/metrics";
import { Colors } from "../../../../config/styles";

const carouselStyles = StyleSheet.create({
  buttonCarousel: {
    flexDirection: "row",
    marginLeft: 60,
    marginRight: 20,
    marginTop: 20
  },

  container: {
    flex: 1
  },

  footer: {
    backgroundColor: Colors.paleGrey,
    borderColor: Colors.paleGrey,
    borderStyle: "solid",
    borderWidth: 1,
    width: Metrics.DEVICE_WIDTH
  },

  footerBody: {
    color: Colors.onyx,
    fontFamily: "HelveticaNeue",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal",
    height: 60,
    letterSpacing: 0.6,
    lineHeight: 35,
    marginLeft: 90,
    marginRight: 113,
    textAlign: "center",
    width: 152
  },

  footerRight: {
    color: Colors.burgundy,
    fontFamily: "HelveticaNeue",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "500",
    height: 60,
    letterSpacing: 0,
    lineHeight: 35,
    marginRight: 83,
    textAlign: "center",
    width: 44
  },

  formContainer: {
    flex: 1,
    flexDirection: "column",
    width: Metrics.DEVICE_WIDTH,
    alignContent: "center",
    justifyContent: "center"
  },

  hairlineStyle: {
    flexDirection: "row",
    marginBottom: verticalScale(Metrics.margin2x),
    marginHorizontal: scale(60),
    marginTop: -verticalScale(125)
  },

  imageContainer: {
    borderRadius: 23.1,
    height: 46.2,
    marginHorizontal: 20,
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
    lineHeight: 25,
    marginHorizontal: scale((Metrics.DEVICE_WIDTH - 268) / 2),
    paddingTop: verticalScale(20),
    textAlign: "center",
    textShadowColor: Colors.onyx,
    textShadowOffset: {
      width: 0,
      height: 6
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
    lineHeight: 25,
    marginHorizontal: scale((Metrics.DEVICE_WIDTH - 268) / 2),
    textAlign: "center",
    textShadowColor: Colors.onyx,
    textShadowOffset: {
      width: 0,
      height: 6
    },
    textShadowRadius: 12,
    width: scale(268)
  },

  imageOverlayTextContainer: {
    flexDirection: "column",
    paddingTop: verticalScale(414.5),
    position: "absolute",
    zIndex: 1
  },

  landingImage: {
    height: verticalScale(504),
    zIndex: 0
  },

  nextIcon: {
    height: 12,
    marginRight: 45,
    marginTop: 10,
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
    fontFamily: "HelveticaNeue",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 50,
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
  },
  socialProviderCarouselContainer: {
    flexDirection: "row",
    marginBottom: 0,
    marginLeft: scale(60),
    marginRight: scale(Metrics.margin2x),
    marginTop: 0
  },
  tosStyle: {
    flexDirection: "column",
    marginBottom: verticalScale(200),
    marginTop: verticalScale(Metrics.margin2x)
  }
});

export default carouselStyles;
