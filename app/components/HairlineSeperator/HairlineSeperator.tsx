import _ from "lodash";
import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { ValueOrDefault } from "../../utils/helpers";
import strings from "./strings";
import styles from "./styles";

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  separatorText?: string;
}

const HairlineSeparator = ({ containerStyle }: Props): JSX.Element => {
  return (
    <View style={ValueOrDefault(containerStyle, styles.separatorContainer)}>
      <Text style={styles.hairline} />
    </View>
  );
};

/**
 * Renders a divider composed of a horizontal layout containing a left and right hairline with text in between them.
 *
 * @param seperatorText The text  to display between the two hairlines.
 */
const HairlineSeparatorWithText = ({
  containerStyle,
  separatorText: seperatorText
}: Props): JSX.Element => {
  return (
    <View
      style={ValueOrDefault(containerStyle, styles.withTextSeparatorContainer)}
    >
      <View style={styles.leftHairline} />
      <Text style={styles.centerText}>
        {ValueOrDefault(seperatorText, strings.or)}
      </Text>
      <View style={styles.rightHairline} />
    </View>
  );
};
export { HairlineSeparator };
export default HairlineSeparatorWithText;
