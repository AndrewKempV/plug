import { StyleSheet } from "react-native";
import Metrics from "../../../../config/metrics";
import { Colors, Fonts, Layout } from "../../../../config/styles";
import LayoutDebugger from "../../../../utils/LayoutDebugger";

const styles = StyleSheet.create({
  container: {
    ...Layout.container
  },
  listContainer: {
    height: Metrics.DEVICE_HEIGHT - 30,
    width: 375
  },
  screenTitle: {
    ...Layout.textCenter,
    color: Colors.onyx,
    fontFamily: "HelveticaNeue",
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500",
    height: 20,
    width: 180
  }
});

export default styles;
