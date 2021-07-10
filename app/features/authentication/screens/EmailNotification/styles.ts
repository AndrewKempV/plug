import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Fonts from "../../../../config/Fonts";
import Metrics, { isIPhoneX } from "../../../../config/metrics";
import { Colors } from "../../../../config/styles";

const styles = StyleSheet.create({
  formDetail: {
    color: Colors.onyx,
    fontFamily: "HelveticaNeue",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "500",
    height: verticalScale(30),
    letterSpacing: 0,
    lineHeight: verticalScale(32),
    marginHorizontal: scale(100),
    textAlign: "center",
    width: scale(190)
  },
  inboxImage: {
    alignSelf: "center",
    marginTop: verticalScale(150)
  },
  notificationA: {
    alignContent: "center",
    alignSelf: "center",
    marginHorizontal: scale(Metrics.margin)
  },
  notificationB: {
    alignSelf: "center",
    marginBottom: verticalScale(isIPhoneX() ? 281 : 271)
  },
  screenTitle: {
    color: Colors.onyx,
    fontFamily: "HelveticaNeue",
    fontSize: Fonts.size.h7,
    fontStyle: "normal",
    fontWeight: "500",
    height: verticalScale(30),
    letterSpacing: -0.36,
    lineHeight: verticalScale(32),
    textAlign: "center",
    width: scale(190)
  }
});

export default styles;
