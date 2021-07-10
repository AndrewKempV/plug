import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Metrics from "../../config/metrics";
import { Colors } from "../../config/styles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    width: Metrics.DEVICE_WIDTH,
    alignContent: "center",
    justifyContent: "flex-start"
  },
  emailSubText: {
    color: Colors.charcoalGrey,
    fontFamily: "HelveticaNeue",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "500",
    height: verticalScale(15),
    letterSpacing: 0.24,
    lineHeight: verticalScale(12),
    marginHorizontal: scale(77.5),
    marginTop: verticalScale(5),
    opacity: 0.75,
    textAlign: "center",
    width: scale(220)
  },
  formContainer: {
    flex: 1,
    flexDirection: "column",
    width: Metrics.DEVICE_WIDTH,
    alignContent: "center",
    justifyContent: "center"
  },

  formInput: {
    backgroundColor: Colors.whiteTwo,
    color: Colors.onyx,
    fontSize: 20,
    fontWeight: "500",
    maxHeight: verticalScale(57.1),
    textAlign: "center",
    width: Metrics.DEVICE_WIDTH
  },

  formPlaceHolder: {
    backgroundColor: Colors.whiteTwo,
    color: Colors.charcoalGrey,
    fontSize: 20,
    fontWeight: "bold",
    maxHeight: verticalScale(57.1),
    opacity: 0.79,
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
    marginBottom: verticalScale(Metrics.margin),
    marginHorizontal: scale(100),
    textAlign: "center",
    width: scale(190)
  },

  hairline: {
    backgroundColor: Colors.charcoalGreyA350,
    height: 1,
    marginBottom: 0,
    marginLeft: scale(15.5),
    marginRight: scale(12.5),
    marginTop: 0,
    width: scale(347)
  },
  nextButton: {
    backgroundColor: Colors.burgundy,
    borderRadius: 30,
    height: verticalScale(52),
    marginHorizontal: scale(40),
    marginTop: verticalScale(40),
    width: 295.4
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
  },
  separatorContainer: {
    backgroundColor: Colors.whiteTwo,
    height: 1,
    width: Metrics.DEVICE_WIDTH
  },
  seperatorMargins: {
    marginBottom: verticalScale(5)
  }
});

export default styles;
