import { StyleSheet } from "react-native";
import Metrics from "../../config/metrics";
import LayoutDebugger from "../../utils/LayoutDebugger";
import Fonts from "../../config/Fonts";
import { Colors, Layout } from "../../config/styles";

const styles = StyleSheet.create({
  itemDivider: {
    backgroundColor: Colors.transparent,
    height: 3,
    width: Metrics.DEVICE_WIDTH
  },
  list: {},
  listHeaderContainer: {
    backgroundColor: Colors.transparent,
    height: 64,
    width: Metrics.DEVICE_WIDTH,
    ...Layout.alignCenterLeft
  },
  savedPaymentListLabel: {
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "500",
    height: 18,
    marginLeft: 17,
    textAlign: "left",
    width: 178
  }
});

export default styles;
