import { StyleSheet } from "react-native";

import { Colors } from "../../../../config/styles";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Colors.burgundy,
    display: "flex",
    flex: 1,
    justifyContent: "center"
  },
  image: {
    alignContent: "center",
    justifyContent: "center"
  }
});

export default styles;
