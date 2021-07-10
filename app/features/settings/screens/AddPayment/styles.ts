import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { Colors, Layout, Fonts } from "../../../../config/styles";
import LayoutDebugger from "../../../../utils/LayoutDebugger";

const styles = StyleSheet.create({
  addCardActionLabel: {
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 28,
    fontStyle: "normal",
    fontWeight: "bold",
    height: 33,
    textAlign: "center",
    width: 262
  },
  addCardActionSubLabel: {
    color: Colors.charcoalGrey,
    fontFamily: Fonts.type.base,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "300",
    height: 17,
    textAlign: "center",
    width: 240
  },
  animation: {
    height: 104,
    width: 104
  },
  animationScreenContainer: {
    backgroundColor: Colors.paleBlue,
    flex: 1,
    ...Layout.alignCentered
  },
  confirmButtonContainer: {
    borderColor: Colors.burgundy,
    borderRadius: 30,
    borderStyle: "solid",
    borderWidth: 1,
    height: 36.6,
    marginTop: 13,
    width: 84,
    ...Layout.alignCentered
  },
  confirmButtonLabel: {
    color: Colors.burgundy,
    fontFamily: Fonts.type.modal,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "600",
    height: 21,
    marginBottom: 12,
    textAlign: "center",
    width: 42
  },
  container: {
    ...Layout.container
  },
  denyButtonContainer: {
    backgroundColor: Colors.snow,
    borderColor: Colors.onyx,
    borderRadius: 28,
    borderStyle: "solid",
    borderWidth: 1,
    height: 56,
    width: 56,
    ...Layout.alignCentered
  },
  denyButtonLabel: {
    color: Colors.black,
    fontFamily: Fonts.type.base,
    fontSize: 26,
    fontStyle: "normal",
    fontWeight: "200",
    height: 31,
    letterSpacing: -0.78,
    marginBottom: 12,
    textAlign: "center",
    width: 17
  },
  errorButtonContainer: {
    borderColor: Colors.snow,
    borderRadius: 16,
    borderStyle: "solid",
    borderWidth: 1,
    height: 32,
    width: 32,
    ...Layout.alignCentered
  },
  errorButtonLabel: {
    color: Colors.snow,
    fontFamily: Fonts.type.modal,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "bold",
    height: 19,
    marginBottom: 10,
    marginRight: 2,
    textAlign: "center",
    width: 19
  },
  errorContainer: {
    backgroundColor: Colors.squash,
    flexDirection: "row",
    height: 62,
    width: 375,
    ...Layout.alignCentered
  },
  errorLabel: {
    color: Colors.snow,
    fontFamily: Fonts.type.modal,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "700",
    height: 38,
    textAlign: "center",
    width: 270
  },
  formContainer: {
    backgroundColor: Colors.paleBlue,
    height: "50%",
    ...Layout.alignTop
  },
  formContentContainer: {
    marginTop: 24.8
  },
  modalErrorContainer: {
    backgroundColor: Colors.A400,
    flex: 1,
    ...Layout.alignCentered
  },
  modalErrorDialogContainer: {
    backgroundColor: Colors.snow,
    borderRadius: 15,
    height: 197,
    shadowColor: "#00000029",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 1,
    shadowRadius: 6,
    width: 270,
    ...Layout.alignCentered
  },
  modalErrorLabel: {
    color: Colors.black,
    fontFamily: Fonts.type.modal,
    fontSize: 13,
    fontStyle: "normal",
    fontWeight: "normal",
    height: 36,
    marginTop: 17,
    textAlign: "center",
    width: 238
  },
  saveButtonDisabledContainer: {
    backgroundColor: Colors.darkMauve,
    borderRadius: 30,
    height: 48,
    marginBottom: 20,
    width: 289,
    ...Layout.alignCentered
  },
  saveButtonEnabledContainer: {
    backgroundColor: Colors.burgundy,
    borderRadius: 30,
    height: 48,
    marginBottom: 20,
    width: 289,
    ...Layout.alignCentered
  },
  saveButtonLabel: {
    color: Colors.snow,
    fontFamily: Fonts.type.base,
    fontSize: 17,
    fontStyle: "normal",
    fontWeight: "bold",
    height: 21,
    width: 50,
    ...Layout.textCenter,
    marginBottom: 11.5
  },
  screenTitle: {
    ...Layout.textCenter,
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500",
    height: 20,
    width: scale(180)
  },
  tooltip: {
    backgroundColor: Colors.snow,
    borderColor: Colors.lightBlueGrey,
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 1,
    height: 45,
    left: 24,
    position: "absolute",
    top: 144,
    width: 328,
    ...Layout.alignCentered
  },
  tooltipLabel: {
    color: Colors.darkGrey,
    fontFamily: Fonts.type.base,
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal",
    height: 29,
    letterSpacing: 0,
    lineHeight: 14,
    textAlign: "center",
    width: 320
  },
  triangleDown: {
    backgroundColor: Colors.transparent,
    borderBottomColor: Colors.transparent,
    borderBottomWidth: 0,
    borderLeftColor: Colors.transparent,
    borderLeftWidth: 10,
    borderRightColor: Colors.transparent,
    borderRightWidth: 10,
    borderStyle: "solid",
    borderTopColor: Colors.snow,
    borderTopWidth: 10,
    height: 10,
    position: "absolute",
    width: 10
  },
  triangleUp: {
    backgroundColor: Colors.transparent,
    borderBottomColor: Colors.snow,
    borderBottomWidth: 10,
    borderLeftColor: Colors.transparent,
    borderLeftWidth: 10,
    borderRightColor: Colors.transparent,
    borderRightWidth: 10,
    borderStyle: "solid",
    borderTopColor: Colors.transparent,
    borderTopWidth: 0,
    height: 0,
    position: "absolute",
    top: -10,
    width: 0
  }
});

export default styles;
