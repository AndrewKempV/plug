import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Metrics from "../../config/metrics";
import { Colors, Fonts, Layout } from "../../config/styles";
import LayoutDebugger from "../../utils/LayoutDebugger";

const styles = StyleSheet.create({
  container: {
    ...Layout.horizontalFlex,
    ...Layout.alignLeft,
    ...Layout.paddingDefault,
    height: 100,
    width: Metrics.DEVICE_WIDTH
  },
  dateLabel: {
    ...Layout.textLeft,
    color: Colors.darkBurgundy,
    fontFamily: Fonts.type.base,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "500",
    paddingTop: 10,
    textAlign: "left"
  },
  eventInfoContainer: {
    ...Layout.verticalFlex,
    ...Layout.alignLeft,
    height: 45,
    paddingLeft: 16.7,
    width: 200
  },
  eventName: {
    ...Layout.textLeft,
    color: Colors.onyx,
    fontFamily: Fonts.type.medium,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "500",
    width: 200
  },
  eventVenue: {
    ...Layout.textLeft,
    color: Colors.darkGrey,
    fontFamily: Fonts.type.base,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    marginTop: 5,
    textAlign: "left",
    width: 200
  },
  followButtonContainer: {
    ...Layout.alignCentered,
    backgroundColor: Colors.snow,
    borderColor: Colors.burgundy,
    borderRadius: 30,
    borderStyle: "solid",
    borderWidth: 3,
    height: 32,
    width: 32
  },
  followIcon: {
    marginTop: verticalScale(12),
    paddingLeft: scale(6)
  },
  hostAvatar: {
    height: 38,
    width: 38
  },
  hostContainer: {
    ...Layout.horizontalFlex,
    height: 40.3,
    marginTop: 10,
    width: 225
  },
  hostLabel: {
    ...Layout.textLeft,
    color: Colors.onyx,
    fontFamily: "HelveticaNeue",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal",
    height: 14,
    width: 29
  },
  hostLabelContainer: {
    ...Layout.verticalFlex,
    marginLeft: 5
  },
  hostNameLabel: {
    ...Layout.textLeft,
    color: Colors.onyx,
    fontFamily: "HelveticaNeue",
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "500",
    height: 18,
    width: 107
  },
  image: {
    borderRadius: 8,
    height: 89,
    width: 102
  },
  messageButtonContainer: {
    ...Layout.alignCentered,
    backgroundColor: Colors.snow,
    borderColor: Colors.burgundy,
    borderRadius: 30,
    borderStyle: "solid",
    borderWidth: 3,
    height: 32,
    width: 32
  },
  messageIcon: {
    paddingLeft: scale(7.5),
    paddingTop: verticalScale(8)
  },
  notificationButtonContainer: {
    ...Layout.alignCentered,
    backgroundColor: Colors.snow,
    borderColor: Colors.burgundy,
    borderRadius: 30,
    borderStyle: "solid",
    borderWidth: 3,
    height: 32,
    width: 32
  },
  notificationIcon: {
    paddingLeft: scale(7.5),
    paddingTop: verticalScale(8)
  }
});
export default styles;
