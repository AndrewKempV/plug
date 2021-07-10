import { StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";

const INPUTS_WIDTH = 300;

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderWidth: 0,
    fontSize: 18,
    marginHorizontal: scale(8.5),
    paddingHorizontal: 0,
    paddingVertical: verticalScale(5),
    textAlign: "center",
    width: scale(35)
  },
  inputContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: verticalScale(100),
    justifyContent: "space-around",
    maxWidth: scale(INPUTS_WIDTH)
  }
});

export default styles;
