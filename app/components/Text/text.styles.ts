import { RegisteredStyle, StyleSheet, TextStyle } from "react-native";
import { Colors } from "../../config/styles";

export type WightType = "light" | "book" | "medium" | "bold";
export type TextType =
  | "cta"
  | "success"
  | "error"
  | "header"
  | "default"
  | "H1"
  | "H2"
  | "H3"
  | "H4"
  | "H5"
  | "B1"
  | "B2"
  | undefined;

export { getStyleType, getFontWeight };

function getFontWeight(weight: WightType): RegisteredStyle<TextStyle> {
  switch (weight) {
    case "light":
      return (lightFontWeight.text as unknown) as RegisteredStyle<TextStyle>;
    case "book":
      return (bookFontWeight.text as unknown) as RegisteredStyle<TextStyle>;
    case "medium":
      return (mediumFontWeight.text as unknown) as RegisteredStyle<TextStyle>;
    case "bold":
      return (boldFontWeight.text as unknown) as RegisteredStyle<TextStyle>;
    default:
      return (bookFontWeight.text as unknown) as RegisteredStyle<TextStyle>;
  }
}

function getStyleType(type: TextType): RegisteredStyle<TextStyle> {
  switch (type) {
    case "success":
      return (successTextStyles.text as unknown) as RegisteredStyle<TextStyle>;
    case "header":
      return (headerTextStyles.text as unknown) as RegisteredStyle<TextStyle>;
    case "error":
      return (errorTextStyles.text as unknown) as RegisteredStyle<TextStyle>;
    case "cta":
      return (ctaTextStyles.text as unknown) as RegisteredStyle<TextStyle>;
    case "H1":
      return (h1TextStyles.text as unknown) as RegisteredStyle<TextStyle>;
    case "H2":
      return (h2TextStyles.text as unknown) as RegisteredStyle<TextStyle>;
    case "H3":
      return (h3TextStyles.text as unknown) as RegisteredStyle<TextStyle>;
    case "H4":
      return (h4TextStyles.text as unknown) as RegisteredStyle<TextStyle>;
    case "H5":
      return (h5TextStyles.text as unknown) as RegisteredStyle<TextStyle>;
    case "B1":
      return (b1TextStyles.text as unknown) as RegisteredStyle<TextStyle>;
    case "B2":
      return (b2TextStyles.text as unknown) as RegisteredStyle<TextStyle>;
    default:
      return (defaultTextStyles.text as unknown) as RegisteredStyle<TextStyle>;
  }
}

const baseText: TextStyle = {
  textAlign: "center",
  backgroundColor: "transparent",
  fontSize: 17
};

const lightFontWeight = StyleSheet.create({
  text: {}
});

const bookFontWeight = StyleSheet.create({
  text: {}
});

const mediumFontWeight = StyleSheet.create({
  text: {}
});
const boldFontWeight = StyleSheet.create({
  text: {}
});

const defaultTextStyles = StyleSheet.create({
  text: {
    ...baseText,
    color: Colors.black,
    includeFontPadding: true
  }
});

// cta - Call to action text
const ctaTextStyles = StyleSheet.create({
  text: {
    ...baseText,
    color: Colors.darkBurgundy
  }
});

const headerTextStyles = StyleSheet.create({
  text: {
    ...baseText,
    color: Colors.black,
    fontSize: 22
  }
});

const successTextStyles = StyleSheet.create({
  text: {
    ...baseText,
    color: Colors.burgundy
  }
});

const errorTextStyles = StyleSheet.create({
  text: {
    ...baseText,
    color: Colors.darkMauve
  }
});

const h1TextStyles = StyleSheet.create({
  text: {
    ...baseText,
    fontSize: 30,
    margin: 3
  }
});

const h2TextStyles = StyleSheet.create({
  text: {
    ...baseText,
    fontSize: 25,
    margin: 3
  }
});

const h3TextStyles = StyleSheet.create({
  text: {
    ...baseText,
    fontSize: 22,
    margin: 3
  }
});

const h4TextStyles = StyleSheet.create({
  text: {
    ...baseText,
    color: Colors.black,
    fontSize: 20,
    lineHeight: 24
  }
});

const h5TextStyles = StyleSheet.create({
  text: {
    ...baseText,
    color: Colors.black,
    fontSize: 14,
    lineHeight: 18
  }
});

const b1TextStyles = StyleSheet.create({
  text: {
    ...baseText,
    fontSize: 16,
    lineHeight: 22
  }
});

const b2TextStyles = StyleSheet.create({
  text: {
    ...baseText,
    fontSize: 12,
    lineHeight: 16
  }
});
