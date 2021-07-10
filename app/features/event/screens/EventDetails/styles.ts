import { StyleSheet } from "react-native";
import { Colors, Fonts, Layout, buildCircle } from "app/config/styles";
import LayoutDebugger from "app/utils/LayoutDebugger";

const labels = StyleSheet.create({
  aboutContentLabel: {
    color: Colors.darkGrey,
    fontFamily: Fonts.type.base,
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal",
    ...Layout.textLeft
  },
  chatroomCallToActionLabel: {
    color: Colors.charcoalGreyTwo,
    fontFamily: Fonts.type.base,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "300",
    letterSpacing: 0,
    lineHeight: 24,
    marginLeft: 10,
    marginTop: 4,
    ...Layout.textCenter
  },
  chatroomLabel: {
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "normal",
    ...Layout.textRight,
    marginLeft: 2
  },
  dayLabel: {
    color: Colors.black,
    fontFamily: Fonts.type.base,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "500",
    ...Layout.textLeft
  },
  detailItemLabel: {
    color: Colors.black,
    fontFamily: Fonts.type.base,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "normal",
    ...Layout.textLeft
  },
  detailItemSubLabel: {
    color: Colors.charcoalGreyTwo,
    fontFamily: Fonts.type.base,
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "300",
    ...Layout.textLeft
  },
  eventTagLabel: {
    color: Colors.charcoalGreyTwo,
    fontFamily: Fonts.type.base,
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "300",
    ...Layout.textLeft,
    marginLeft: 2,
    marginTop: 5
  },
  joinTheConversationLabel: {
    color: Colors.charcoalGreyTwo,
    fontFamily: Fonts.type.base,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "300",
    ...Layout.textLeft
  },
  monthLabel: {
    color: Colors.burgundy,
    fontFamily: Fonts.type.base,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "normal",
    ...Layout.textCenter,
    marginTop: 4
  },
  p1: {
    color: Colors.darkGrey,
    flexWrap: "wrap",
    fontFamily: Fonts.type.base,
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal",
    letterSpacing: 0,
    lineHeight: 24,
    textAlign: "left"
  },
  screenTitleLabel: {
    color: Colors.paleGrey,
    fontFamily: Fonts.type.base,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500",
    letterSpacing: 0,
    lineHeight: 33,
    textAlign: "center"
  },
  sectionH1Label: {
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "500",
    letterSpacing: 0,
    lineHeight: 24,
    textAlign: "left"
  },
  seeMoreLabel: {
    color: Colors.charcoalGreyTwo,
    fontFamily: Fonts.type.base,
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "500",
    ...Layout.textCenter
  },
  ticketButtonLabel: {
    color: Colors.snow,
    fontFamily: Fonts.type.base,
    fontSize: 17,
    fontStyle: "normal",
    fontWeight: "bold",
    height: 21,
    width: 50,
    ...Layout.textLeft,
    marginBottom: 10
  },
  titleLabel: {
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "bold",
    ...Layout.textCenter
  },
  usernameLabel: {
    color: Colors.lightBurgundy,
    fontFamily: Fonts.type.base,
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "300",
    ...Layout.textLeft,
    marginLeft: 2,
    marginTop: 5
  }
});

const containers = StyleSheet.create({
  backButtonContainer: {
    ...buildCircle({
      radius: 16,
      backgroundColor: "#ffffffd9",
      position: "relative"
    }),
    alignItems: "center",
    borderColor: Colors.paleGrey,
    borderStyle: "solid",
    borderWidth: 1,
    opacity: 0.7
  },
  chatBubbleIcon: {
    paddingBottom: 4
  },
  chatroomStatContainer: {
    flexDirection: "row",
    height: 30,
    justifyContent: "flex-end",
    width: 80
  },
  container: {},
  divider: {
    backgroundColor: Colors.paleGrey,
    borderColor: Colors.veryLightPink,
    borderStyle: "solid",
    borderWidth: 1,
    height: 7,
    width: "100%"
  },
  eventDetailHeadSection: {
    height: 89.9,
    width: "100%"
  },
  favoriteButton: {
    ...buildCircle({
      radius: 16,
      backgroundColor: Colors.snow,
      position: "relative"
    }),
    backgroundColor: Colors.snow,
    borderColor: Colors.warmGreyA400,
    borderStyle: "solid",
    borderWidth: 1
  },
  favoriteIcon: {
    marginTop: 3,
    paddingLeft: 6
  },
  fixedHeaderContainer: {
    backgroundColor: Colors.black,
    flex: 1,
    height: 300
  },
  foregroundContanier: {
    flex: 1,
    height: 5
  },
  hairlineDivider: {
    borderColor: Colors.beige,
    borderStyle: "solid",
    borderWidth: 0.5,
    height: 0,
    opacity: 0.28,
    width: "100%"
  },
  listIconContainer: {
    marginBottom: 5,
    marginTop: 0
  },
  listItemContainer: {
    margin: 0,
    padding: 0
  },
  listItemContentContainer: {
    marginLeft: 10
  },
  overflowButtonContainer: {
    ...buildCircle({
      radius: 16,
      backgroundColor: "#ffffffd9",
      position: "relative"
    }),
    alignItems: "center",
    borderColor: Colors.paleGrey,
    borderStyle: "solid",
    borderWidth: 1,
    opacity: 0.7
  },
  paddedContainer: {
    marginLeft: 16,
    marginRight: 15
  },
  primaryImage: {
    height: 278.1,
    width: "100%"
  },
  shareButton: {
    ...buildCircle({
      radius: 16,
      backgroundColor: Colors.snow,
      position: "relative"
    }),
    borderColor: Colors.warmGreyA400,
    borderStyle: "solid",
    borderWidth: 1
  },
  shareIcon: {
    marginTop: 2,
    paddingLeft: 2
  },
  stickyBackButtonContainer: {
    ...buildCircle({
      radius: 16,
      backgroundColor: Colors.transparent,
      position: "relative"
    }),
    alignItems: "center",
    borderColor: Colors.paleGrey,
    borderStyle: "solid",
    borderWidth: 1,
    opacity: 1
  },
  stickyHeaderContainer: {
    backgroundColor: Colors.burgundy,
    height: 88,
    width: 375
  },
  stickyOverflowButtonContainer: {
    ...buildCircle({
      radius: 16,
      backgroundColor: Colors.transparent,
      position: "relative"
    }),
    alignItems: "center",
    borderColor: Colors.paleGrey,
    borderStyle: "solid",
    borderWidth: 1,
    opacity: 1
  },
  ticketButton: {
    backgroundColor: Colors.burgundy,
    borderRadius: 24,
    height: 48,
    width: 296,
    ...Layout.alignCentered
  }
});

const styles = {
  ...containers,
  ...labels
};

export default styles;
