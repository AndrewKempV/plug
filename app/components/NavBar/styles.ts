import { StyleSheet } from "react-native";
import Fonts from "../../config/Fonts";
import { Colors } from "../../config/styles";

const styles = StyleSheet.create({
  defaultTitleStyle: {
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.h3,
    fontWeight: "500",
    letterSpacing: 0,
    lineHeight: 32,
    textAlign: "center"
  }
});

export default styles;
