import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Metrics from "../../config/metrics";
import { Colors, Layout } from "../../config/styles";

const styles = StyleSheet.create({
  buttonLabel: {
    marginBottom: 12
  },
  container: {
    ...Layout.containerCentered,
    backgroundColor: Colors.eggplantA430
  },
  dialog: {
    ...Layout.alignCentered,
    backgroundColor: Colors.snow,
    borderRadius: 15,
    height: verticalScale(232),
    padding: Metrics.margin2x,
    shadowColor: "rgba(0, 0, 0, 0.16)",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 1,
    shadowRadius: 6,
    width: scale(264)
  },
  subtitle: {
    color: Colors.darkGrey,
    fontFamily: "Roboto",
    fontSize: 13,
    fontStyle: "normal",
    fontWeight: "normal",
    height: verticalScale(36),
    marginTop: 10,
    textAlign: "center",
    width: scale(216)
  },
  title: {
    color: Colors.onyx,
    fontFamily: "Roboto",
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500",
    height: verticalScale(24),
    textAlign: "center",
    width: scale(218)
  }
});

export default styles;
