import React, { Component, ReactChild } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";
import Fonts from "../../config/Fonts";
import { Colors, Layout } from "../../config/styles";
import LayoutDebugger from "../../utils/LayoutDebugger";
import { Box, Paragraph, Heading, TouchableBox } from "app/components";

interface RadioButtonProps {
  size: number;
  thickness?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: (value: string) => void;
  title: string;
  subtitle?: string;
  disabled?: boolean;
  isSelected?: boolean;
  seperatorSpace?: number;
  children?: React.ReactChildren;
  radioPosition: "left" | "right";
}

export default class RadioButton extends Component<RadioButtonProps> {
  public unselectedRadioStyle() {
    return {
      height: this.props.size,
      width: this.props.size,
      borderRadius: this.props.size / 2,
      borderWidth: !this.props.isSelected
        ? this.props.thickness
        : this.props.thickness! + 5,
      borderColor: !this.props.isSelected ? Colors.paleGrey : Colors.burgundy
    };
  }

  public render() {
    const {
      onPress,
      title,
      subtitle,
      seperatorSpace,
      radioPosition,
      style
    } = this.props;
    const press = () => (onPress ? onPress(title) : undefined);
    const right = (
      <Box
        flex={1}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        marginBottom={seperatorSpace || 25}
        height={50}
        width={"100%"}
      >
        <Box flex={1} flexDirection={"column"}>
          <Heading size={"h4"} weight={"normal"}>
            {title}
          </Heading>
          {subtitle && (
            <Heading size={"h5"} weight={"normal"}>
              {subtitle}
            </Heading>
          )}
        </Box>
        <Box
          marginLeft={styles.radioContainer.marginLeft}
          paddingRight={styles.radioContainer.paddingRight}
        >
          <View style={[styles.radio, this.unselectedRadioStyle()]} />
        </Box>
      </Box>
    );
    const left = (
      <Box
        flex={1}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"flex-start"}
        marginBottom={this.props.seperatorSpace || 25}
        height={50}
        width={"100%"}
      >
        <Box justifyContent={"flex-start"} alignItems={"center"}>
          <View style={[styles.radio, this.unselectedRadioStyle()]} />
        </Box>
        <Box flex={1} flexDirection={"column"} justifyContent={"space-around"}>
          <Heading size={"h4"} weight={"normal"}>
            {title}
          </Heading>
          {subtitle && (
            <Heading size={"h5"} weight={"normal"}>
              {subtitle}
            </Heading>
          )}
        </Box>
      </Box>
    );
    return (
      <TouchableBox style={[style, { opacity: 1 }]} onPress={press}>
        {radioPosition === "left" ? left : right}
      </TouchableBox>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "normal",
    paddingLeft: 0,
    textAlign: "left"
  },
  radio: {
    ...Layout.alignTop,
    marginRight: 10
  },
  radioContainer: {
    marginLeft: 25,
    paddingRight: 20
  }
});
