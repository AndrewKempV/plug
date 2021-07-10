import { StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Colors, Fonts, Layout } from "../../../config/styles";
import { BetterButton } from "../../../components/Button";
import React from "react";

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
}

export const FeaturedBadge = ({ containerStyle }: Props) => {
  return (
    <BetterButton
      style={[styles.container, containerStyle]}
      labelStyle={styles.featuredLabel}
      label={"Featured"}
      iconSetName={"ionicon"}
      iconName={"ios-checkmark-circle-outline"}
      iconColor={Colors.snow}
      iconSize={12}
      iconStyle={styles.checkmark}
    />
  );
};

const styles = StyleSheet.create({
  checkmark: {
    // ...buildCircle({ radius: 4, backgroundColor: Colors.peacockBlue }),
    marginRight: 3.7,
    paddingTop: 2
  },
  container: {
    backgroundColor: Colors.peacockBlue,
    borderRadius: 12,
    height: 16,
    width: 63.7,
    ...Layout.alignCentered,
    flexDirection: "row"
  },
  featuredLabel: {
    color: Colors.snow,
    fontFamily: Fonts.type.base,
    fontSize: 8,
    fontStyle: "normal",
    fontWeight: "600",
    height: 10,
    textAlign: "left"
  }
});
