import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Metrics from "../../../../config/metrics";
import { Colors, Fonts, Layout } from "../../../../config/styles";
import LayoutDebugger from "../../../../utils/LayoutDebugger";

const styles = StyleSheet.create({
  cancelIcon: {
    marginLeft: scale(10)
  },
  container: {
    ...Layout.container,
    backgroundColor: Colors.paleBlue
  },
  input: {
    borderBottomWidth: 0
  },
  inputContainer: {
    backgroundColor: Colors.snow,
    marginVertical: Metrics.margin
  },
  mailIcon: {
    marginRight: scale(10)
  },
  screenTitle: {
    ...Layout.textCenter,
    color: Colors.onyx,
    fontFamily: "HelveticaNeue",
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500",
    height: 20,
    width: 141.7
  }
});

export default styles;
