import { Platform } from "react-native";

const type = {
  base: "Helvetica Neue",
  medium: "HelveticaNeue-Medium",
  bold: "HelveticaNeue-Bold",
  emphasis: "HelveticaNeue-Italic",
  light: "HelveticaNeue-Light",
  hairline: "HelveticaNeue-Thin",
  condensed: "HelveticaNeue-CondensedBlack",
  condensedBold: "HelveticaNeue-CondensedBold",
  modal: Platform.select({ ios: "System", android: "Roboto" })
};

const size = {
  h1: 38,
  h2: 34,
  h3: 30,
  h4: 26,
  h5: 20,
  h6: 19,
  h7: 18,
  input: 18,
  regular: 17,
  medium: 14,
  small: 12,
  xSmall: 11,
  tiny: 8.5,
  hairline: 1
};

const style = {
  h1: {
    fontFamily: type.base,
    fontSize: size.h1
  },
  h2: {
    fontWeight: type.bold,
    fontSize: size.h2
  },
  h3: {
    fontFamily: type.base,
    fontSize: size.h3
  },
  h4: {
    fontFamily: type.base,
    fontSize: size.h4
  },
  h5: {
    fontFamily: type.base,
    fontSize: size.h5
  },
  h6: {
    fontFamily: type.base,
    fontSize: size.h6
  },
  normal: {
    fontFamily: type.base,
    fontSize: size.regular
  },
  description: {
    fontFamily: type.base,
    fontSize: size.medium
  },
  thin: {
    fontFamily: type.base,
    fontSize: size.hairline
  }
};

const Fonts = {
  type,
  size,
  style
};

export default Fonts;
