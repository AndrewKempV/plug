import { StyleSheet } from "react-native";
import { Colors, Fonts, Layout } from "../../config/styles";

const styles = StyleSheet.create({
  cardIcon: {
    height: 16,
    marginTop: 10,
    width: 21.6
  },
  cardLabel: {
    color: Colors.charcoalGrey,
    fontFamily: Fonts.type.base,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "normal",
    height: 17,
    marginTop: 10,
    textAlign: "left",
    width: 150
  },
  container: {
    backgroundColor: Colors.snow,
    borderColor: Colors.paleBlue,
    borderStyle: "solid",
    borderWidth: 1,
    height: 72,
    width: 375,
    ...Layout.horizontalFlex,
    ...Layout.alignCenterLeft
  },
  contentContainer: {
    ...Layout.alignCenterLeft
  }
});

export default styles;
