import { StyleSheet } from "react-native";
import { Colors, Layout, Fonts } from "../../../../config/styles";
import { verticalScale, scale } from "react-native-size-matters/extend";

const styles = StyleSheet.create({
  container: {
    ...Layout.verticalFlex
  },
  header: {
    backgroundColor: Colors.burgundy,
    height: 88,
    width: 375
  },
  headerCTA: {
    color: Colors.snow,
    fontFamily: Fonts.type.base,
    fontSize: 28,
    fontStyle: "normal",
    fontWeight: "bold",
    height: 33,
    letterSpacing: 0.84,
    textAlign: "left",
    textShadowColor: "#00000036",
    textShadowOffset: {
      width: 0,
      height: 3
    },
    textShadowRadius: 6,
    width: 106
  },
  locationLabel: {
    color: Colors.paleGrey,
    fontFamily: Fonts.type.base,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "500",
    textAlign: "left",
    textDecorationLine: "underline",
    width: scale(130)
  },
  locationLabelContainer: {
    marginLeft: 10.3
  },
  messageButton: {
    ...Layout.alignCentered,
    borderColor: Colors.paleGreyA510,
    borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 1,
    height: 32,
    marginBottom: 5,
    width: 32
  },
  messageIcon: {
    paddingLeft: scale(0),
    paddingTop: verticalScale(12)
  },
  moreButton: {
    height: 16,
    width: 58.5
  },
  searchButton: {
    ...Layout.alignCentered,
    borderColor: Colors.paleGreyA510,
    borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 1,
    height: 32,
    marginBottom: 5,
    marginHorizontal: 12,
    width: 32
  },
  searchIcon: {
    paddingLeft: scale(0),
    paddingTop: verticalScale(12)
  },
  sectionLabel: {
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "bold",
    height: 24,
    paddingLeft: 15.5,
    textAlign: "center"
  },
  sectionLabelContainer: {
    ...Layout.alignCenterLeft,
    marginBottom: 21
  }
});

export default styles;
