import { StyleSheet } from "react-native";
import { Layout } from "../../config/styles";
const styles = StyleSheet.create({
  chipContainer: {
    marginHorizontal: 10
  },
  rowContainer: {
    ...Layout.horizontalLeftAlign,
    marginVertical: 8.5
  }
});

export default styles;
