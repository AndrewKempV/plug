import { StyleSheet } from "react-native";
import Metrics from "../../config/metrics";
import { Colors, Fonts, Layout } from "../../config/styles";
import LayoutDebugger from "../../utils/LayoutDebugger";

const styles = StyleSheet.create({
  actionButtonContainer: {
    ...Layout.horizontalFlex,
    ...Layout.alignRight,
    height: 89,
    justifyContent: "flex-end"
  },
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
    textAlign: "left",
    width: 155
  },
  eventInfoContainer: {
    ...Layout.verticalFlex,
    ...Layout.alignLeft,
    height: 63,
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
  favoriteIcon: {
    marginTop: 7,
    paddingRight: 16.2
  },
  image: {
    borderRadius: 8,
    height: 89,
    width: 102
  },
  shareIcon: {
    paddingBottom: 2,
    paddingRight: 12.2
  }
});
export default styles;
