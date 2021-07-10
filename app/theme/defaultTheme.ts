import { Platform } from "react-native";
import { Colors as BrandColors } from "config/styles";
import palette from "./palette";
import {
  Colors,
  ContainerShapes,
  ControlSizes,
  Elevations,
  Fills,
  FontFamilies,
  FontWeights,
  HeadingSizes,
  ParagraphSizes,
  SpacingSize,
  TextSizes,
  Theme,
  Layout,
  ScreenSizes
} from "./Theme";
import Fonts from "app/config/Fonts";
import Color from "color";

const controlPaddings: ControlSizes = {
  small: 0,
  medium: 0,
  large: 0
};

const controlHeights: ControlSizes = {
  small: 32,
  medium: 48,
  large: 52
};

const controlBorderRadius: ControlSizes = {
  small: 5,
  medium: 13,
  large: 20
};

const spacing: { [size in SpacingSize]: number } = {
  xxsmall: 3,
  xsmall: 6,
  small: 12,
  medium: 18,
  large: 24,
  xlarge: 30,
  xxlarge: 36,
  xxxlarge: 42,
  xxxxlarge: 48
};

const colors: Colors = {
  background: {
    base: "white",
    content: "white",

    greyLight: BrandColors.iceBlue,
    greyDefault: BrandColors.lightBlueGrey,
    greyDark: BrandColors.battleShipGrey,

    primaryLight: BrandColors.lightBurgundy,
    primaryDefault: BrandColors.burgundy,
    primaryDark: BrandColors.darkBurgundy,

    secondaryLight: palette.orange.lightest,
    secondaryDefault: palette.orange.base,
    secondaryDark: palette.orange.dark,

    dangerLight: Color(BrandColors.danger)
      .lighten(0.25)
      .toString(),
    dangerDefault: BrandColors.danger,
    dangerDark: Color(BrandColors.danger)
      .darken(0.25)
      .toString(),

    infoLight: palette.blue.lightest,
    infoDefault: palette.blue.base,
    infoDark: palette.blue.dark,

    successLight: Color(BrandColors.success)
      .lighten(0.25)
      .toString(),
    successDefault: BrandColors.success,
    successDark: Color(BrandColors.success)
      .darken(0.25)
      .toString(),

    warningLight: Color(BrandColors.warning)
      .lighten(0.25)
      .toString(),
    warningDefault: BrandColors.warning,
    warningDark: Color(BrandColors.warning)
      .darken(0.25)
      .toString()
  },

  border: {
    default: BrandColors.transparent,

    muted: BrandColors.iceBlue,

    primary: BrandColors.burgundy,
    secondary: BrandColors.lightBlueGrey,

    danger: palette.red.darkest,
    info: palette.blue.darkest,
    success: palette.green.darkest,
    warning: palette.orange.darkest
  },

  button: {
    disabled: BrandColors.bordeauxA650,
    disabledText: BrandColors.snow,

    default: palette.neutral.lightest,
    defaultText: palette.neutral.darkest,

    primary: BrandColors.burgundy,
    primaryText: BrandColors.snow,

    secondary: BrandColors.snow,
    secondaryText: BrandColors.onyx,

    danger: palette.red.base,
    dangerText: "white"
  },

  text: {
    link: BrandColors.niceBlue,
    default: BrandColors.onyx,

    muted: BrandColors.charcoalGreyTwo,
    white: BrandColors.snow,
    selected: BrandColors.darkGrey,

    primary: BrandColors.onyx,
    secondary: BrandColors.charcoalGreyTwo,

    danger: BrandColors.darkBurgundy,
    info: BrandColors.info,
    success: BrandColors.success,
    warning: BrandColors.warning
  }
};

const elevations: Elevations = [
  {
    elevation: 0,
    shadowColor: palette.neutral.dark,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0
  },
  {
    elevation: 1,
    shadowColor: palette.neutral.dark,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 8
  },
  {
    elevation: 2,
    shadowColor: palette.neutral.dark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10
  },
  {
    elevation: 3,
    shadowColor: palette.neutral.dark,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 12
  },
  {
    elevation: 4,
    shadowColor: palette.neutral.dark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  {
    elevation: 5,
    shadowColor: palette.neutral.dark,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 8
  }
];

const fills: Fills = {
  solid: {
    neutral: {
      backgroundColor: palette.neutral.base,
      color: "white"
    },

    blue: {
      backgroundColor: palette.blue.base,
      color: "white"
    },

    red: {
      backgroundColor: BrandColors.burgundy,
      color: "white"
    },

    orange: {
      backgroundColor: palette.orange.base,
      color: "white"
    },

    yellow: {
      backgroundColor: palette.yellow.base,
      color: palette.yellow.darkest
    },

    green: {
      backgroundColor: palette.green.base,
      color: "white"
    },

    teal: {
      backgroundColor: palette.teal.base,
      color: "white"
    },

    purple: {
      backgroundColor: palette.purple.base,
      color: "white"
    }
  },

  subtle: {
    neutral: {
      backgroundColor: palette.neutral.light,
      color: palette.neutral.darkest
    },

    blue: {
      backgroundColor: palette.blue.light,
      color: palette.blue.darkest
    },

    red: {
      backgroundColor: palette.red.light,
      color: palette.red.darkest
    },

    orange: {
      backgroundColor: palette.orange.light,
      color: palette.orange.darkest
    },

    yellow: {
      backgroundColor: palette.yellow.light,
      color: palette.yellow.darkest
    },

    green: {
      backgroundColor: palette.green.light,
      color: palette.green.darkest
    },

    teal: {
      backgroundColor: palette.teal.light,
      color: palette.teal.darkest
    },

    purple: {
      backgroundColor: palette.purple.light,
      color: palette.purple.darkest
    }
  }
};

// Use system font on the Web
const fontFamilies: FontFamilies =
  Platform.OS === "web"
    ? {
        heading: `"SF UI Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
        mono: `"SF Mono", "Monaco", "Inconsolata", "Fira Mono", "Droid Sans Mono", "Source Code Pro", monospace`,
        text: `"SF UI Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`
      }
    : {
        heading: Fonts.type.base,
        mono: Fonts.type.modal,
        text: Fonts.type.base
      };

const fontWeights: FontWeights = {
  bold: "bold",
  light: "300",
  normal: "normal"
};

const headingSizes: HeadingSizes = {
  h1: {
    fontSize: 30,
    letterSpacing: 0,
    lineHeight: 0
  },

  h2: {
    fontSize: 24,
    letterSpacing: 0,
    lineHeight: 0
  },

  h3: {
    fontSize: 18,
    letterSpacing: 0,
    lineHeight: 0
  },

  h4: {
    fontSize: 15,
    letterSpacing: 0,
    lineHeight: 0
  },

  h5: {
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 0
  },

  h6: {
    fontSize: 10,
    letterSpacing: 0,
    lineHeight: 0
  }
};

const paragraphSizes: ParagraphSizes = {
  small: {
    fontSize: 14,
    lineHeight: 24
  },

  medium: {
    fontSize: 16,
    lineHeight: 21
  },

  large: {
    fontSize: 18,
    lineHeight: 18
  }
};

const textSizes: TextSizes = {
  large: {
    fontSize: 20
  },
  medium: {
    fontSize: 16
  },
  small: {
    fontSize: 14
  },
  xsmall: {
    fontSize: 12
  }
};

const containerShapes: ContainerShapes = {
  circle: {
    borderRadius: 999
  },
  ellipticalPill: {
    borderRadius: controlBorderRadius.large
  },
  pill: {
    borderRadius: controlBorderRadius.medium
  },
  rounded: {
    borderRadius: controlBorderRadius.small
  },
  roundedBottom: {
    borderBottomLeftRadius: controlBorderRadius.medium,
    borderBottomRightRadius: controlBorderRadius.medium
  },
  roundedLeft: {
    borderBottomLeftRadius: controlBorderRadius.medium,
    borderTopLeftRadius: controlBorderRadius.medium
  },
  roundedRight: {
    borderBottomRightRadius: controlBorderRadius.medium,
    borderTopRightRadius: controlBorderRadius.medium
  },
  roundedTop: {
    borderTopLeftRadius: controlBorderRadius.medium,
    borderTopRightRadius: controlBorderRadius.medium
  },
  square: {
    borderRadius: 0
  }
};

// iOS
// iPhone M (375 x 812)
// iPhone L (414 x 896)
// Android
// Mobile S (360 x 640)
// Mobile M (412 x 732)
// Mobile L (480 x 853)

const breakpoints: ScreenSizes = Platform.select({
  ios: {
    medium: {
      width: 375,
      height: 812
    },
    large: {
      width: 414,
      height: 896
    }
  },
  android: {
    small: {
      width: 360,
      height: 640
    },
    medium: {
      width: 412,
      height: 732
    },
    large: {
      width: 480,
      height: 853
    }
  }
});

export const layout: Layout = {
  breakpoints,
  containerSizes: {
    small: 540,
    medium: 720,
    large: 960,
    xlarge: 1200
  },
  gridColumnCount: 12,
  gutterWidth: 15
};

export const defaultTheme: Theme = {
  colors,
  fills,

  spacing,
  layout,

  fontFamilies,
  fontWeights,

  headingSizes,
  paragraphSizes,
  textSizes,

  elevations,

  controlBorderRadius,
  controlHeights,
  controlPaddings,

  containerShapes,
  overrides: {}
};
