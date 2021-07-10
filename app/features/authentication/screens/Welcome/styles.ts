import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Metrics from "../../../../config/metrics";
import { Colors } from "../../../../config/styles";

const styles = StyleSheet.create({
  formInput: {
    backgroundColor: Colors.whiteTwo,
    color: Colors.onyx,
    fontSize: 20,
    fontWeight: "500",
    maxHeight: verticalScale(57.1),
    textAlign: "center",
    width: Metrics.DEVICE_WIDTH
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
  signUpText: {
    color: Colors.snow,
    fontFamily: "HelveticaNeue",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: verticalScale(50),
    textAlign: "center",
    textAlignVertical: "center"
  }
});

export default styles;
