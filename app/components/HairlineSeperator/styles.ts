import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Fonts from "../../config/Fonts";
import Metrics from "../../config/metrics";
import { Colors } from "../../config/styles";

const styles = StyleSheet.create({
  centerText: {
    alignSelf: "center",
    color: Colors.charcoalGrey,
    fontFamily: "HelveticaNeue",
    fontSize: 14,
    fontWeight: "normal",
    paddingBottom: verticalScale(5),
    textAlign: "center"
  },
  hairline: {
    backgroundColor: Colors.charcoalGreyA100,
    height: 1,
    marginBottom: 0,
    marginLeft: scale(15.5),
    marginRight: scale(15.5),
    marginTop: 0,
    width: scale(347)
  },
  leftHairline: {
    backgroundColor: Colors.paleGrey,
    fontFamily: Fonts.type.bold,
    height: 3,
    marginLeft: scale(10),
    marginRight: scale(10),
    marginTop: verticalScale(7),
    width: scale(96)
  },
  rightHairline: {
    backgroundColor: Colors.paleGrey,
    fontFamily: Fonts.type.bold,
    height: 3,
    marginLeft: scale(10),
    marginRight: scale(10),
    marginTop: verticalScale(7),
    width: scale(96)
  },
  separatorContainer: {
    backgroundColor: Colors.whiteTwo,
    height: 1,
    width: Metrics.DEVICE_WIDTH
  },
  withTextSeparatorContainer: {
    flexDirection: "row",
    marginBottom: Metrics.marginHalf,
    marginHorizontal: scale(60),
    marginTop: Metrics.marginHalf
  }
});

export default styles;
