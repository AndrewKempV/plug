import { Platform } from "react-native";

const Lottie = {
  checkmarkBlue: Platform.select({
    ios: require("./check-mark-circle-blue.json"),
    android: "lottie/check-mark-circle-blue.json"
  }),
  checkmarkGreen: Platform.select({
    ios: require("./check-circle.json"),
    android: "lottie/ccheck-circle.json"
  }),
  cardAdded: Platform.select({
    ios: require("./card-added-animation.json"),
    android: "lottie/card-added-animation.json"
  })
};

export default Lottie;
