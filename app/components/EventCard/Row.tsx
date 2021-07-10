import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Metrics from "../../config/metrics";
import { Colors, text } from "../../config/styles";

const styles = StyleSheet.create({
  rowStyle: {
    alignItems: "center",
    backgroundColor: Colors.whiteTwo,
    borderRadius: 3,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: Metrics.DEVICE_WIDTH - Metrics.margin2x
  }
});

interface RowProps {
  // tslint:disable-next-line:ban-types
  onRemove: (item: string) => void;
  item: string;
}

const Row = (props: RowProps) => (
  <TouchableOpacity
    style={styles.rowStyle}
    onPress={() => props.onRemove(props.item)}
  >
    <Text style={text.mediumDark}>{props.item}</Text>
  </TouchableOpacity>
);

export default Row;
