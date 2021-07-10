import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Fonts from "../../../../config/Fonts";
import Metrics from "../../../../config/metrics";
import { Colors, Layout } from "../../../../config/styles";
import { scaleText } from "../../../../utils/helpers";
import LayoutDebugger from "../../../../utils/LayoutDebugger";

const styles = StyleSheet.create({
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
    height: 3,
    width: scale(86)
  },
  bioLabel: {
    ...Layout.textCenter,
    marginTop: verticalScale(Metrics.marginHalf)
  },
  businessButton: {
    ...Layout.alignCentered,
    borderColor: Colors.paleGrey,
    borderRadius: 15,
    borderWidth: 1,
    height: 32,
    marginHorizontal: scale(7.5),
    width: 32
  },
  businessIcon: {
    paddingLeft: 0,
    paddingTop: 10
  },
  connectionStatContainer: {
    flexDirection: "row"
  },
  container: {
    ...Layout.container
  },
  editButtonContainer: {
    ...Layout.alignCentered,
    backgroundColor: Colors.snow,
    borderColor: Colors.burgundy,
    borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 2,
    height: verticalScale(39),
    marginTop: verticalScale(16.7),
    width: scale(86)
  },
  editButtonInnerText: {
    ...Layout.textFullCenter,
    color: Colors.burgundy,
    fontFamily: Fonts.type.medium,
    fontSize: scaleText(15),
    fontWeight: "600",
    height: verticalScale(19),
    marginBottom: 12,
    width: scale(30)
  },
  followersLabel: {
    ...Layout.textCenter,
    color: Colors.charcoalGrey,
    fontFamily: Fonts.type.bold,
    fontSize: scaleText(12),
    fontStyle: "normal",
    fontWeight: "bold"
  },
  followingLabel: {
    ...Layout.textCenter,
    color: Colors.charcoalGrey,
    fontFamily: Fonts.type.bold,
    fontSize: scaleText(12),
    fontStyle: "normal",
    fontWeight: "bold"
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
    fontSize: 15,
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
    marginTop: verticalScale(3)
  },
  listContainer: {
    maxHeight: verticalScale(250)
  },
  menuButton: {
    ...Layout.alignCentered,
    borderColor: Colors.paleGrey,
    borderRadius: 15,
    borderWidth: 1,
    height: 32,
    width: 32
  },
  menuIcon: {
    paddingLeft: scale(0)
    // paddingTop: verticalScale(2)
  },
  numericalStatLabel: {
    ...Layout.textCenter,
    color: Colors.darkGrey,
    fontFamily: Fonts.type.bold,
    fontSize: scaleText(14),
    fontStyle: "normal",
    fontWeight: "bold",
    marginRight: scale(Metrics.marginHalf),
    paddingBottom: 10
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
    fontFamily: "HelveticaNeue",
    fontSize: scaleText(18),
    fontStyle: "normal",
    fontWeight: "500",
    height: 20,
    width: scale(141.7)
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
    height: 50
  },
  verticalDivider: {
    color: Colors.steelGrey,
    marginHorizontal: 4
  },
  websiteLabel: {
    ...Layout.textCenter,
    color: Colors.niceBlue,
    fontFamily: Fonts.type.base,
    fontSize: scaleText(13),
    fontWeight: "normal",
    marginBottom: verticalScale(12.3),
    marginTop: verticalScale(9)
  }
});

export default styles;
