import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Metrics from "../../../../config/metrics";
import { Colors, Fonts, Layout } from "../../../../config/styles";

const styles = StyleSheet.create({
  bioLabel: {
    ...Layout.textCenter,
    marginTop: Metrics.marginHalf
  },
  followButton: {
    height: verticalScale(36),
    width: scale(103.6),
    ...Layout.alignCentered,
    marginHorizontal: scale(5)
  },
  followButtonIcon: {
    marginTop: verticalScale(3.5)
  },
  followButtonLabel: {
    marginTop: verticalScale(2.5)
  },
  fullNameLabel: {
    fontFamily: Fonts.type.bold,
    fontSize: Fonts.size.h4,
    marginTop: verticalScale(13)
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
    ...Layout.verticalFlex,
    ...Layout.alignCentered,
    backgroundColor: Colors.iceBlue,
    paddingTop: verticalScale(101)
  },
  screenTitle: {
    ...Layout.textCenter,
    color: Colors.onyx,
    fontFamily: "HelveticaNeue",
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500",
    height: 25,
    width: 141.7
  },
  websiteLabel: {
    ...Layout.textCenter,
    color: Colors.niceBlue,
    fontFamily: Fonts.type.base,
    fontSize: 13,
    fontWeight: "normal",
    lineHeight: 33,
    marginBottom: 12.3,
    marginTop: 9
  }
});

export default styles;
