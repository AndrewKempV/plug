import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";

const styles = StyleSheet.create({
  container: {
    alignContent: "flex-start",
    flex: 1,
    justifyContent: "center",
    marginHorizontal: scale(100),
    maxWidth: scale(225)
  },
  imageContainer: {
    borderRadius: 23.1,
    height: 46.2,
    marginHorizontal: scale(20),
    width: 46.2
  },
  nextIcon: {
    marginRight: scale(30),
    marginTop: verticalScale(13),
    paddingLeft: scale(20)
  },
  socialIcon: {
    borderRadius: 23.1,
    height: 46.2,
    width: 46.2
  }
});

export default styles;
