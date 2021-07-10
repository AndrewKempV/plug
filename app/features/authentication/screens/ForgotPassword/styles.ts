import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Fonts from "../../../../config/Fonts";
import Metrics from "../../../../config/metrics";
import { Colors } from "../../../../config/styles";

const styles = StyleSheet.create({
  formInput: {
    backgroundColor: Colors.whiteTwo,
    color: Colors.charcoalGrey,
    fontSize: 20,
    height: verticalScale(57.1),
    maxHeight: verticalScale(57.1),
    textAlign: "center",
    width: Metrics.screenWidth
  },
  formQuestionText: {
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
