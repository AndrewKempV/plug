import { StyleSheet } from "react-native";
import { Layout } from "../config/styles";

const styles = StyleSheet.create({
  profileButtonContainer: {
    ...Layout.alignCentered,
    borderRadius: 15,
    borderWidth: 1,
    height: 30,
    width: 30
  }
});
export default styles;
