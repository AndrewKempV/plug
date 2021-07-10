import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Fonts from "../../config/Fonts";
import Metrics from "../../config/metrics";
import { Colors } from "../../config/styles";
import { Layout } from "../../config/styles";

const styles = StyleSheet.create({
  accessoryViewContainer: {
    alignItems: "center",
    backgroundColor: Colors.snow,
    borderColor: Colors.paleGrey,
    borderStyle: "solid",
    borderWidth: 1,
    flexDirection: "column",
    height: verticalScale(160.7),
    maxHeight: verticalScale(160.7),
    padding: 8,
    width: scale(375)
  },
  addMediaButtonContainer: {
    backgroundColor: Colors.paleGrey,
    borderColor: Colors.burgundy,
    borderStyle: "solid",
    borderWidth: 3,
    height: 32,
    width: 32
  },
  messageButtonContainer: {
    ...Layout.alignCentered,
    backgroundColor: Colors.snow,
    borderColor: Colors.burgundy,
    borderRadius: 30,
    borderStyle: "solid",
    borderWidth: 3,
    height: 38,
    marginHorizontal: 5,
    width: 38
  },
  messageIcon: {
    paddingLeft: scale(0),
    paddingTop: verticalScale(14)
  },
  messagePanelDismissButton: {
    height: 32,
    marginLeft: 17,
    marginTop: 15.7,
    width: 32
  },
  messagePanelHeaderContainer: {
    ...Layout.alignLeft,
    ...Layout.horizontalFlex,
    height: 30,
    width: Metrics.DEVICE_WIDTH
  },
  messagePanelTitle: {
    ...Layout.textLeft,
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500",
    height: 22,
    marginLeft: 80,
    marginTop: 16.7,
    width: 117
  },
  textInput: {
    ...Layout.textLeftCenter,
    backgroundColor: Colors.paleGrey,
    fontSize: 16,
    height: 40,
    marginRight: 10,
    paddingLeft: 10,
    width: 200
  },
  textInputButton: {
    flexShrink: 1
  },
  textInputButtonLabel: {
    fontFamily: Fonts.type.base,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "500",
    height: 18,
    width: 36,
    ...Layout.textLeft,
    color: Colors.burgundy
  },
  textInputContainer: {
    ...Layout.horizontalFlex,
    ...Layout.alignCentered,
    width: scale(345),
    height: verticalScale(73),
    borderRadius: 36,
    backgroundColor: Colors.paleGrey,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#c8d1d3",
    // padding: 10,
    marginLeft: 0,
    marginRight: 0
  }
});

export default styles;
