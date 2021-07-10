import { scale, verticalScale } from "react-native-size-matters/extend";
import Fonts from "./Fonts";
import Metrics from "./metrics";
import { Colors } from "./styles";

/**
 * @describe Application wide styling.
 * This is synonymous with the app's main theme.
 */
const ApplicationStyles = {
  screen: {
    mainContainer: {
      flex: 1,
      backgroundColor: Colors.transparent
    },
    backgroundImage: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    container: {
      flex: 1,
      paddingTop: Metrics.margin,
      backgroundColor: Colors.transparent
    },
    section: {
      margin: Metrics.section,
      padding: Metrics.margin
    },
    sectionText: {
      ...Fonts.style.normal,
      paddingVertical: Metrics.margin2x,
      color: Colors.snow,
      marginVertical: Metrics.marginHalf,
      textAlign: "center"
    },
    subtitle: {
      color: Colors.snow,
      padding: Metrics.marginHalf,
      marginBottom: Metrics.marginHalf,
      marginHorizontal: Metrics.marginHalf
    },
    titleText: {
      ...Fonts.style.h6,
      fontSize: 14,
      color: Colors.black
    }
  },
  screenTitle: {
    width: 190,
    height: 30,
    fontSize: Fonts.size.h7,
    letterSpacing: -0.36,
    fontFamily: "HelveticaNeue",
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 32,
    textAlign: "center",
    color: Colors.onyx
  },
  darkLabelContainer: {
    padding: Metrics.marginHalf,
    paddingBottom: Metrics.margin2x,
    borderBottomColor: Colors.darkGrey,
    borderBottomWidth: 1,
    marginBottom: Metrics.margin
  },
  darkLabel: {
    fontFamily: Fonts.type.bold,
    color: Colors.snow
  },
  groupContainer: {
    margin: Metrics.marginHalf,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  sectionTitle: {
    ...Fonts.style.h4,
    color: Colors.charcoalGrey,
    backgroundColor: Colors.paleGrey,
    padding: Metrics.marginHalf,
    marginTop: Metrics.marginHalf,
    marginHorizontal: Metrics.margin,
    borderWidth: 1,
    borderColor: Colors.transparent,
    alignItems: "center",
    textAlign: "center"
  }
};

export default ApplicationStyles;
