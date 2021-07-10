import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Fonts from "../../../../config/Fonts";
import Metrics from "../../../../config/metrics";
import { Colors, Layout } from "../../../../config/styles";
import { scaleText } from "../../../../utils/helpers";
import LayoutDebugger from "../../../../utils/LayoutDebugger";

const styles = StyleSheet.create({
  accessoryViewContainer: {
    alignItems: "center",
    backgroundColor: Colors.snow,
    borderColor: Colors.paleGrey,
    borderStyle: "solid",
    borderWidth: 1,
    flexDirection: "column",
    height: verticalScale(160.7),
    maxHeight: verticalScale(160.7),
    padding: 8,
    width: scale(375)
  },
  active: {
    color: Colors.onyx,
    fontFamily: Fonts.type.bold,
    fontSize: scaleText(15)
  },
  activeItem: {
    ...Layout.overlay
  },
  activeTabContainer: {
    ...Layout.alignBottom,
    height: verticalScale(16),
    width: Metrics.DEVICE_WIDTH / 3
  },
  activeTabIndicator: {
    backgroundColor: Colors.burgundy,
    height: verticalScale(3),
    width: scale(86)
  },
  addMediaButtonContainer: {
    backgroundColor: Colors.paleGrey,
    borderColor: Colors.burgundy,
    borderStyle: "solid",
    borderWidth: 3,
    height: 32,
    width: 32
  },
  avatarModalContainer: {
    ...Layout.verticalFlex,
    ...Layout.alignCentered,
    backgroundColor: Colors.iceBlue
  },
  bioLabel: {
    ...Layout.textCenter,
    marginTop: Metrics.marginHalf
  },
  blockButton: {
    ...Layout.alignCentered,
    backgroundColor: Colors.burgundy,
    borderRadius: 20,
    height: verticalScale(38),
    marginTop: 25,
    width: scale(216)
  },
  blockLabel: {
    ...Layout.textFullCenter,
    color: Colors.snow,
    fontFamily: Fonts.type.base,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "500",
    marginBottom: 19
  },
  blockUserContent: {
    color: Colors.darkGrey,
    fontFamily: Fonts.type.modal,
    fontSize: 13,
    fontStyle: "normal",
    fontWeight: "normal",
    height: 74,
    letterSpacing: 0,
    lineHeight: 18,
    textAlign: "center",
    width: 216
  },
  blockUserDialog: {
    ...Layout.alignCentered,
    backgroundColor: Colors.snow,
    borderRadius: 15,
    height: 264,
    padding: Metrics.margin2x,
    shadowColor: "#00000029",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 1,
    shadowRadius: 6,
    width: 264
  },
  blockUserTitle: {
    color: Colors.onyx,
    fontFamily: Fonts.type.modal,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "bold",
    height: 24,
    textAlign: "left",
    width: 134
  },
  buttonSectionContainer: {
    ...Layout.horizontalFlex
  },
  cancelButton: {
    ...Layout.alignCentered,
    backgroundColor: Colors.snow,
    borderColor: Colors.burgundy,
    borderRadius: 20,
    borderWidth: 1,
    height: verticalScale(38),
    marginTop: 17,
    width: scale(216)
  },
  cancelLabel: {
    ...Layout.textFullCenter,
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "500",
    marginBottom: 19
  },
  connectionStatContainer: {
    flexDirection: "row"
  },
  container: {
    ...Layout.container,
    opacity: 1
  },
  followButton: {
    ...Layout.alignCentered,
    height: 36,
    width: 103.6
  },
  followButtonIcon: {
    marginTop: 3.5
  },
  followButtonLabel: {
    marginTop: 2.5
  },
  followingButton: {
    ...Layout.alignCentered,
    height: 36,
    marginHorizontal: 5,
    width: 103.6
  },
  fullNameLabel: {
    fontFamily: Fonts.type.bold,
    fontSize: scaleText(Fonts.size.h4),
    marginTop: verticalScale(13)
  },
  headerButton: {
    ...Layout.alignCentered,
    height: 32,
    width: 32
  },
  icon: {
    height: 26,
    width: 26
  },
  inactive: {
    color: Colors.charcoalGrey,
    fontFamily: Fonts.type.medium,
    fontSize: scaleText(15),
    fontWeight: "500"
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(4.5)
  },
  label: {
    backgroundColor: Colors.transparent,
    fontSize: scaleText(10),
    marginBottom: verticalScale(1.5),
    marginTop: 3
  },
  messageButtonContainer: {
    ...Layout.alignCentered,
    backgroundColor: Colors.snow,
    borderColor: Colors.burgundy,
    borderRadius: 30,
    borderStyle: "solid",
    borderWidth: 3,
    height: 38,
    marginHorizontal: 5,
    width: 38
  },
  messageIcon: {
    paddingLeft: scale(0),
    paddingTop: verticalScale(14)
  },
  messagePanelDismissButton: {
    height: 32,
    marginLeft: 17,
    marginTop: 15.7,
    width: 32
  },
  messagePanelHeaderContainer: {
    ...Layout.alignLeft,
    ...Layout.horizontalFlex,
    height: 30,
    width: Metrics.DEVICE_WIDTH
  },
  messagePanelTitle: {
    ...Layout.textLeft,
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500",
    height: 22,
    marginLeft: 80,
    marginTop: 16.7,
    width: 117
  },
  modalBackgroundContainer: {
    ...Layout.container,
    backgroundColor: Colors.eggplantA430,
    opacity: 0.43
  },
  notificationButtonContainer: {
    ...Layout.alignCentered,
    backgroundColor: Colors.snow,
    borderColor: Colors.burgundy,
    borderRadius: 30,
    borderStyle: "solid",
    borderWidth: 3,
    height: 38,
    marginHorizontal: 5,
    width: 38
  },
  notificationButtonContainerEnabled: {
    ...Layout.alignCentered,
    backgroundColor: Colors.burgundy,
    borderColor: Colors.burgundy,
    borderRadius: 30,
    borderStyle: "solid",
    borderWidth: 3,
    height: 38,
    marginHorizontal: 5,
    width: 38
  },
  notificationIcon: {
    paddingLeft: scale(0),
    paddingTop: verticalScale(14)
  },
  numericalStatLabel: {
    ...Layout.textCenter,
    color: Colors.darkGrey,
    fontFamily: Fonts.type.bold,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "bold",
    marginRight: Metrics.marginHalf
  },
  overflowButton: {
    borderColor: Colors.paleGrey,
    borderRadius: 15,
    borderWidth: 1,
    height: Metrics.icons.medium,
    width: Metrics.icons.medium
  },
  overflowButtonIcon: {
    paddingLeft: scale(5),
    paddingTop: verticalScale(2.5)
  },
  profileContainer: {
    backgroundColor: Colors.paleGrey,
    height: verticalScale(335),
    width: Metrics.DEVICE_WIDTH
  },
  sceneContainer: {
    flex: 1,
    height: verticalScale(300),
    width: Metrics.DEVICE_WIDTH
  },
  sceneListContainer: {
    alignItems: "center",
    backgroundColor: "#eee",
    flex: 1,
    justifyContent: "center",
    paddingTop: verticalScale(50)
  },
  screenTitle: {
    ...Layout.textCenter,
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500",
    width: 200
  },
  tab: {
    alignItems: "center",
    borderTopColor: "rgba(0, 0, 0, .2)",
    borderTopWidth: StyleSheet.hairlineWidth,
    flex: 1
  },
  tabBar: {
    backgroundColor: Colors.snow,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  tabbarContainer: {
    flexDirection: "column",
    height: verticalScale(50)
  },
  textInput: {
    ...Layout.textLeftCenter,
    backgroundColor: Colors.paleGrey,
    fontSize: 16,
    height: 40,
    marginRight: 10,
    width: 200
  },
  textInputButton: {
    flexShrink: 1
  },
  textInputButtonLabel: {
    fontFamily: Fonts.type.base,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "500",
    height: 18,
    width: 36,
    ...Layout.textLeft,
    color: Colors.burgundy
  },
  textInputContainer: {
    ...Layout.horizontalFlex,
    ...Layout.alignCentered,
    width: scale(345),
    height: verticalScale(73),
    borderRadius: 36,
    backgroundColor: Colors.paleGrey,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#c8d1d3",
    // padding: 10,
    marginLeft: 0,
    marginRight: 0
  },
  websiteLabel: {
    ...Layout.textCenter,
    color: Colors.niceBlue,
    fontFamily: Fonts.type.base,
    fontSize: scaleText(13),
    fontWeight: "normal",
    lineHeight: 33,
    marginBottom: 12.3,
    marginTop: 9
  }
});

export default styles;
