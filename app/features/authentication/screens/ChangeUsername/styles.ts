import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Metrics from "../../../../config/metrics";
import { Colors } from "../../../../config/styles";

const styles = StyleSheet.create({
  nextButton: {
    backgroundColor: Colors.burgundy,
    borderRadius: 30,
    height: verticalScale(52),
    marginHorizontal: scale(40),
    marginTop: verticalScale(75),
    width: scale(295.4)
  },
  nextText: {
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
