import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Metrics from "../../../../config/metrics";
import { Colors, Fonts, Layout } from "../../../../config/styles";
import LayoutDebugger from "../../../../utils/LayoutDebugger";

const EXPANDED_SEARCH_BAR_HEIGHT_OFFSET = verticalScale(140);
const EXPANDED_HEADER_HEIGHT_OFFSET = verticalScale(0);
const EXPANDED_SUBHEADER_HEIGHT_OFFSET = verticalScale(20);
const EXPANDED_SEPARATOR_HEIGHT_OFFSET = verticalScale(-20);
const EXPANDED_LIST_CONTAINER_HEIGHT_OFFSET = verticalScale(250);

const styles = StyleSheet.create({
  backButtonContainer: {
    marginLeft: scale(10),
    marginRight: scale(98),
    marginTop: verticalScale(-6)
  },
  checkmark: {
    height: 20,
    marginRight: scale(50),
    width: 20
  },
  container: {
    ...Layout.verticalTopLeft
  },
  divider: {
    backgroundColor: Colors.paleGrey,
    height: verticalScale(3)
  },
  dividerContainer: {
    bottom: EXPANDED_SEPARATOR_HEIGHT_OFFSET
  },
  header: {
    marginTop: verticalScale(44),
    maxHeight: verticalScale(22),
    width: Metrics.DEVICE_WIDTH,
    ...Layout.horizontalFlex
  },
  headerContainer: {
    alignItems: "center",
    alignSelf: "center",
    zIndex: 1
  },
  homeLocationContainer: {
    ...Layout.horizontalLeftAlign,
    left: scale(15),
    maxHeight: "8%",
    paddingTop: verticalScale(Metrics.margin2x),
    top: EXPANDED_SUBHEADER_HEIGHT_OFFSET,
    width: Metrics.DEVICE_WIDTH,
    zIndex: 1
  },
  linearGradientContainer: {
    elevation: 10,
    height: verticalScale(158.8),
    top: EXPANDED_HEADER_HEIGHT_OFFSET,
    width: "100%",
    zIndex: 1
  },
  list: {
    marginLeft: scale(Metrics.margin + 5),
    marginRight: scale(Metrics.margin + 5)
  },
  listContainer: {
    position: "absolute",
    top: EXPANDED_LIST_CONTAINER_HEIGHT_OFFSET,
    zIndex: 2
  },
  listContentContainer: {
    width: Metrics.DEVICE_WIDTH - scale(75)
  },
  listItemContainer: {
    marginLeft: 0,
    paddingLeft: 0,
    paddingRight: 0,
    width: Metrics.DEVICE_WIDTH
  },
  screenContainer: {
    ...Layout.container
  },
  screenDescription: {
    ...Layout.textLeft,
    color: Colors.snow,
    fontFamily: "HelveticaNeue",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "normal",
    height: verticalScale(51),
    width: scale(216)
  },
  screenTitle: {
    ...Layout.textCenter,
    color: Colors.snow,
    fontFamily: "HelveticaNeue",
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "bold",
    height: verticalScale(22),
    marginLeft: scale(100),
    textAlign: "center",
    width: scale(84)
  },
  search: {
    ...Layout.textLeft,
    color: Colors.snow,
    fontFamily: "HelveticaNeue",
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "500",
    height: verticalScale(18),
    marginLeft: scale(90),
    width: scale(48)
  },
  searchBarContainer: {
    left: scale(5),
    maxWidth: Metrics.DEVICE_WIDTH - scale(5),
    position: "absolute",
    right: scale(5),
    top: EXPANDED_SEARCH_BAR_HEIGHT_OFFSET,
    zIndex: 2
  },
  searchInputContainer: {
    marginLeft: scale(30)
  },
  subTitleLabel: {
    fontFamily: Fonts.type.light,
    fontSize: 11,
    textAlign: "left"
  },
  titleLabel: {
    fontFamily: Fonts.type.medium,
    fontSize: 13,
    textAlign: "left"
  }
});

export default styles;
