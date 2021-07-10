import { StyleSheet } from "react-native";
import { Colors, Layout, Fonts } from "../../config/styles";
import { verticalScale } from "react-native-size-matters/extend";
import LayoutDebugger from "../../utils/LayoutDebugger";

const styles = StyleSheet.create({
  buttonContainer: {
    ...Layout.horizontalFlex,
    marginTop: 26
  },
  cardLabel: {
    color: Colors.darkGrey,
    fontFamily: Fonts.type.modal,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "bold",
    textAlign: "left"
  },
  confirmButtonContainer: {
    backgroundColor: Colors.burgundy,
    borderRadius: 18,
    height: 41,
    width: 94,
    ...Layout.alignCentered,
    marginRight: 36,
    paddingBottom: verticalScale(11)
  },
  confirmLabel: {
    color: Colors.snow,
    fontFamily: Fonts.type.modal,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500",
    ...Layout.textFullCenter
  },
  container: {
    backgroundColor: Colors.A400,
    flex: 1
  },
  declineButtonContainer: {
    backgroundColor: Colors.snow,
    borderColor: Colors.burgundy,
    borderRadius: 18,
    borderStyle: "solid",
    borderWidth: 1,
    height: 41,
    width: 94,
    ...Layout.alignCentered,
    paddingBottom: verticalScale(11)
  },
  declineLabel: {
    color: Colors.burgundy,
    fontFamily: Fonts.type.modal,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500",
    ...Layout.textFullCenter
  },
  descriptionContainer: {
    height: 39,
    marginTop: 10,
    width: 216,
    ...Layout.alignCentered
  },
  descriptionLabel: {
    color: Colors.darkGrey,
    fontFamily: Fonts.type.modal,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "center"
  },
  descriptionRowContainer: {
    ...Layout.horizontalFlex
  },
  header: {
    ...Layout.horizontalTopCenter,
    backgroundColor: Colors.snow,
    borderBottomColor: Colors.snow,
    borderLeftColor: Colors.paleGrey,
    borderRightColor: Colors.paleGrey,
    borderTopColor: Colors.paleGrey,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    paddingTop: 20,
    shadowColor: "#000000"
  },
  map: {
    backgroundColor: Colors.snow,
    borderColor: Colors.charcoalGrey,
    borderWidth: 1,
    height: "100%",
    opacity: 1,
    width: "100%"
  },
  panel: {
    backgroundColor: Colors.snow,
    borderBottomColor: Colors.paleGrey,
    borderLeftColor: Colors.paleGrey,
    borderRightColor: Colors.paleGrey,
    borderTopColor: Colors.snow,
    borderWidth: 1,
    height: 243.5,
    padding: 20,
    width: 359,
    ...Layout.alignCentered
  },
  panelContainer: {
    backgroundColor: Colors.snow,
    bottom: 0,
    left: 0,
    marginHorizontal: 8,
    position: "absolute",
    right: 0
  },
  panelHandle: {
    backgroundColor: "#00000040",
    borderRadius: 4,
    height: 8,
    marginBottom: 10,
    width: 40
  },
  panelHeader: {
    ...Layout.horizontalTopCenter,
    backgroundColor: Colors.snow
  },
  titleLabel: {
    color: Colors.black,
    fontFamily: Fonts.type.modal,
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "500",
    height: 26,
    textAlign: "center",
    width: 193
  }
});

export default styles;
