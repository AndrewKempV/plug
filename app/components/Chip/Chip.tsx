import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";
import Metrics from "../../config/metrics";
import { Layout } from "../../config/styles";

interface ChipProps {
  value: string;
  onPress: () => void;
  chipStyle?: StyleProp<ViewStyle>;
  hasDeleteButton?: boolean;
  onPressDelete?: () => void;
}

const Chip = (props: ChipProps) => {
  const { value, onPress, chipStyle } = props;
  return (
    <TouchableOpacity style={[styles.container, chipStyle]} onPress={onPress}>
      <View style={styles.contentContainer}>
        <Text
          style={[styles.label]}
          adjustsFontSizeToFit={false}
          numberOfLines={1}
        >
          {value}
        </Text>
        {props.hasDeleteButton && (
          <View style={styles.closeButton}>
            <Text style={styles.closeButtonLabel}>x</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    ...Layout.alignCentered,
    backgroundColor: "#ddd",
    borderRadius: 8,
    height: 16,
    width: 16
  },
  closeButtonLabel: {
    color: "#555",
    paddingBottom: 3
  },
  container: {
    ...Layout.horizontalFlex,
    ...Layout.alignCentered,
    borderColor: "#848787",
    borderRadius: 15,
    borderWidth: 1
  },
  contentContainer: {
    ...Layout.horizontalFlex,
    ...Layout.alignCentered,
    alignSelf: "flex-start"
  },
  label: {
    ...Layout.textCenter,
    paddingHorizontal: 5,
    paddingVertical: 3.5
  }
});

export default Chip;
