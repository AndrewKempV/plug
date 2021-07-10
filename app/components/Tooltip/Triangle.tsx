import React from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  style: any;
  isDown: boolean;
}

const Triangle = ({ style, isDown }: Props) => (
  <View style={[styles.triangle, style, isDown ? styles.down : {}]} />
);

const styles = StyleSheet.create({
  down: {
    transform: [{ rotate: "180deg" }]
  },
  triangle: {
    backgroundColor: "transparent",
    borderBottomColor: "white",
    borderBottomWidth: 15,
    borderLeftColor: "transparent",
    borderLeftWidth: 8,
    borderRightColor: "transparent",
    borderRightWidth: 8,
    borderStyle: "solid",
    height: 0,
    width: 0
  },
  unused: {}
});

export default Triangle;
