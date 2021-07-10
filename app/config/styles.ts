import Color from "color";
import { Animated, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Fonts from "./Fonts";
import Metrics from "./metrics";
// const realColors = {
//   bordeaux: "#800020",
//   charcoal-grey: "#41444b",
//   dark: "#1b1c20",
//   rouge: "#932435",
//   wine-red: "#6f0621",
//   ice-blue: "#f0f3f4",
//   white: "#ffffff",
//   light-blue-grey: "#c8d1d3"
// };
const colors = {
  transparent: "transparent",
  A000: "rgba(0, 0, 0, 0)",
  A300: "rgba(0, 0, 0, 0.3)",
  A400: "rgba(0, 0, 0, 0.4)",

  snow: "#ffffff",
  black: "#000000",
  onyx: "#1b1c20",
  eggplant: "#04040f",
  beige: "rgba(204, 200, 200, 1)",
  paleGrey: "#f0f3f4",
  warmGrey: "#707070",
  steelGrey: "#8a8c8e",
  battleShipGrey: "#797b7e",
  charcoalGrey: "#4e5052",
  darkGrey: "#2c2d2e",
  reddishGrey: "#887373",
  lightBlueGrey: "#c3cbce",
  blueGrey: "#78849e",

  paleBlue: "#e4e7e8",
  iceBlue: "#f2f4f5",
  niceBlue: "#0e59a5",
  peacockBlue: "#005695",

  darkMauve: "#7c4d5a",
  purplishRed: "#a70730",
  darkBurgundy: "#6f0621",
  burgundy: "#800020",

  lightBurgundy: "#932435",
  veryLightPink: "rgba(244, 242, 240, 1)",
  squash: "#e38e1d",
  silver: "#e2e5e6",
  danger: "#CD2026",
  warning: "#F9C642",
  info: "#005695",
  success: "#4AA564"
};

const secondaryColors = {
  whiteTwo: "#edeaea",
  steelGreyTwo: "#798186",
  charcoalGreyTwo: "#41444b",
  blackTwo: "#2e2c2c"
};

const alphaVariations = {
  paleGreyA510: Color(colors.paleGrey)
    .alpha(51)
    .toString(),
  warmGreyA400: Color(colors.warmGrey)
    .alpha(0.4)
    .toString(),
  darkGreyA500: Color(colors.darkGrey)
    .alpha(0.5)
    .toString(),
  darkA300: Color(colors.onyx)
    .alpha(0.3)
    .toString(),
  darkA500: Color(colors.onyx)
    .alpha(0.5)
    .toString(),
  eggplantA400: "#6604040f",
  eggplantA430: Color(colors.eggplant)
    .alpha(0.43)
    .toString(),
  charcoalGreyA100: Color(colors.charcoalGrey)
    .alpha(0.1)
    .toString(),
  charcoalGreyA350: Color(colors.charcoalGrey)
    .alpha(0.35)
    .toString(),
  charcoalGreyA490: Color(colors.charcoalGrey)
    .alpha(0.49)
    .toString(),
  bordeauxA650: Color(colors.burgundy)
    .alpha(0.65)
    .toString()
};
/**
 * Main color pallette for the app
 */
const Colors = {
  ...colors,
  ...secondaryColors,
  ...alphaVariations
};

const oldColors = {
  // warmGrey: '#707070',
  // warmGreyA400: Color('#707070').alpha(.4).toString(),
  // darkGrey: '#2c2d2e',
  // darkGreyA500: Color('#2c2d2e').alpha(0.5).toString(),
  // darkMauve: '#7c4d5a',
  // wineRed: '#6f0621',
  // bordeaux: '#800020',
  // lightBordeaux: Color('#800020').alpha(0.65).toString(),
  // dark: '#1b1c20',
  // darkA500: Color('#1b1c20').alpha(0.5).toString(),
  // white: '#ffffff',
  // whiteTwo: '#edeaea',
  // steelGrey: '#8a8c8e',
  // steelGreyTwo: '#798186',
  // charcoalGrey: '#4e5052',
  // charcoalGreyTwo: '#41444b',
  // charcoalGreyA490: Color('#4e5052').alpha(.49).toString(),
  // charcoalGreyA350: Color('#4e5052').alpha(.35).toString(),
  // charcoalGreyA100: Color('#4e5052').alpha(.1).toString(),
  // battleShipGrey: '#797b7e',
  // paleGrey: '#f0f3f4',
  // paleGreyA510: Color('#f0f3f4').alpha(51).toString(),
  // purplishRed: '#a70730',
  // blueGrey: '#78849e',
  // niceBlue: '#0e59a5',
  // paleBlue: '#e4e7e8',
  // cloudyBlue: '#c2c6c7',
  // iceBlue: '#f2f4f5',
  // lightBlueGrey: '#c3cbce',
  // peacockBlue: '#005695',
  // black: '#000000',
  // blackTwo: '#2e2c2c',
  // transparent: 'transparent',
  // eggplant: '#04040f',
  // eggplantA400: '#6604040f',
  // eggplantA430: Color('#04040f').alpha(.43).toString(),
  // silver: '#e2e5e6',
  // squash: '#e38e1d',
  // A300: 'rgba(0, 0, 0, 0.3)',
  // A400: 'rgba(0, 0, 0, 0.4)',
};

/**
 * Main fonts for the app
 */

const buttons = StyleSheet.create({
  mainButton: {
    backgroundColor: Colors.burgundy,
    borderRadius: 30,
    height: verticalScale(52),
    marginHorizontal: scale(40),
    marginTop: verticalScale(40),
    width: scale(295.4)
  }
});

const typography = {
  colors: Colors,
  ...Fonts
};

const text = StyleSheet.create({
  bold: {
    color: Colors.darkGrey,
    fontFamily: Fonts.type.medium,
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 0,
    textAlign: "center"
  },
  boldRed: {
    color: Colors.darkBurgundy,
    fontFamily: Fonts.type.base,
    fontSize: 11,
    fontStyle: "normal",
    fontWeight: "bold",
    letterSpacing: 0.22,
    lineHeight: 0,
    textAlign: "center"
  },

  boldWhite: {
    color: Colors.snow,
    fontFamily: Fonts.type.base,
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 0,
    textAlign: "center"
  },
  mediumDark: {
    color: Colors.onyx,
    fontFamily: Fonts.type.medium,
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 0,
    textAlign: "center"
  },

  mediumRed: {
    color: Colors.darkBurgundy,
    fontFamily: Fonts.type.medium,
    fontSize: 11,
    letterSpacing: 0.22,
    lineHeight: 0,
    textAlign: "center"
  },

  regularDark: {
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal",
    letterSpacing: 0.6,
    lineHeight: 0,
    textAlign: "center"
  },

  regularRed: {
    color: Colors.darkBurgundy,
    fontFamily: Fonts.type.base,
    fontSize: 11,
    fontStyle: "normal",
    fontWeight: "500",
    letterSpacing: 0.22,
    lineHeight: 0,
    textAlign: "center"
  },
  regularWhite: {
    color: Colors.snow,
    fontFamily: Fonts.type.base,
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal",
    letterSpacing: 0.6,
    lineHeight: 0,
    textAlign: "center",
    textAlignVertical: "center"
  }
});

/**
 * Main layout system for the app
 */
const Layout = StyleSheet.create({
  alignBottom: {
    alignItems: "center",
    justifyContent: "flex-end"
  },
  alignCenterLeft: {
    alignItems: "flex-start",
    justifyContent: "center"
  },
  alignCenterRight: {
    alignItems: "flex-end",
    justifyContent: "center"
  },
  alignCentered: {
    alignItems: "center",
    justifyContent: "center"
  },
  alignLeft: {
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  alignRight: {
    alignItems: "flex-end",
    justifyContent: "flex-start"
  },
  alignTop: {
    alignItems: "center",
    justifyContent: "flex-start"
  },
  container: {
    flex: 1
  },
  containerBottom: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "flex-end",
    left: 0,
    position: "absolute",
    right: 0
  },
  containerCentered: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  containerTop: {
    alignItems: "center",
    justifyContent: "flex-start",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  horizontalCenter: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  horizontalFlex: {
    flex: 1,
    flexDirection: "row"
  },
  horizontalLeftAlign: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  horizontalTopCenter: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  horizontalTopLeft: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  horizontalTopRight: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start"
  },
  marginDefault: {
    margin: Metrics.margin
  },
  overlay: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  paddingDefault: {
    padding: Metrics.margin
  },
  textCenter: {
    textAlign: "center"
  },
  textCenterBottom: {
    textAlign: "center",
    textAlignVertical: "bottom"
  },
  textCenterTop: {
    textAlign: "center",
    textAlignVertical: "top"
  },
  textFullCenter: {
    textAlign: "center",
    textAlignVertical: "center"
  },
  textLeft: {
    textAlign: "left"
  },
  textLeftBottom: {
    textAlign: "left",
    textAlignVertical: "bottom"
  },
  textLeftCenter: {
    textAlign: "left",
    textAlignVertical: "center"
  },
  textLeftTop: {
    textAlign: "left",
    textAlignVertical: "top"
  },
  textRight: {
    textAlign: "right"
  },
  textRightBottom: {
    textAlign: "right",
    textAlignVertical: "bottom"
  },
  textRightCenter: {
    textAlign: "right",
    textAlignVertical: "center"
  },
  textRightTop: {
    textAlign: "right",
    textAlignVertical: "top"
  },
  verticalBottomCenter: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  verticalBottomLeft: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-end"
  },
  verticalBottomRight: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  verticalFlex: {
    flex: 1,
    flexDirection: "column"
  },
  verticalLeftAlign: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  verticalTopCenter: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  verticalTopLeft: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  verticalTopRight: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-end"
  }
});

export function shadow(elevation: number | Animated.Value) {
  let height;
  let radius;

  if (elevation instanceof Animated.Value) {
    height = elevation.interpolate({
      inputRange: [0, 1, 2, 3, 8, 24],
      outputRange: [0, 0.5, 0.75, 2, 7, 23]
    });

    radius = elevation.interpolate({
      inputRange: [0, 1, 2, 3, 8, 24],
      outputRange: [0, 0.75, 1.5, 3, 8, 24]
    });
  } else {
    switch (elevation) {
      case 1:
        height = 0.5;
        radius = 0.75;
        break;
      case 2:
        height = 0.75;
        radius = 1.5;
        break;
      default:
        height = elevation - 1;
        radius = elevation;
    }
  }

  return {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height
    },
    shadowOpacity: 0.24,
    shadowRadius: radius
  };
}

interface CircleProps {
  radius: number;
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
  position?: "absolute" | "relative";
}

export const buildCircle = ({
  radius,
  backgroundColor,
  borderColor = Colors.transparent,
  borderWidth = 0,
  position = "relative"
}: CircleProps) => {
  return {
    borderRadius: radius,
    height: radius * 2,
    width: radius * 2,
    borderWidth,
    borderColor,
    backgroundColor,
    position
  };
};

export const buildSquare = (
  x: number,
  backgroundColor: string,
  position: "absolute" | "relative"
) => {
  return {
    width: x,
    height: x,
    backgroundColor,
    position
  };
};

export const buildRectangle = (
  x: number,
  y: number,
  backgroundColor: string,
  position: "absolute" | "relative"
) => {
  return {
    width: x,
    height: y,
    backgroundColor,
    position
  };
};

export { Layout, Colors, Fonts };
export { typography, text, buttons };
