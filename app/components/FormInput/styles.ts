import { StyleSheet } from "react-native";
import Metrics from "../../config/metrics";
import { Colors } from "../../config/styles";

const styles = StyleSheet.create({
  formInput: {
    backgroundColor: Colors.whiteTwo,
    color: Colors.charcoalGrey,
    fontSize: 20,
    maxHeight: 57.1,
    textAlign: "center",
    width: Metrics.DEVICE_WIDTH
  }
});

export default styles;
