import React, { PureComponent } from "react";
import { StyleSheet } from "react-native";
import { verticalScale, scale } from "react-native-size-matters/extend";
import Fonts from "../../config/Fonts";
import { Colors, Layout } from "../../config/styles";
import LayoutDebugger from "../../utils/LayoutDebugger";
import { BetterButton } from "./Button";

interface DoneButtonProps {
  onPress?: () => void;
  active?: boolean;
  label?: string;
  color?: string;
}

class DoneButton extends PureComponent<DoneButtonProps> {
  public static defaultProps: DoneButtonProps = {
    onPress: () => {
      return;
    },
    active: false,
    label: "Done"
  };

  public render() {
    const { onPress, active, label, color } = this.props;
    const styles = createStyles(color);
    return (
      <BetterButton
        // backgroundColor={!color ? Colors.burgundy : Colors.transparent}
        // borderColor={!color ? Colors.paleGrey : color}
        style={[
          styles.doneButtonContainer,
          active ? styles.activeButton : styles.inactiveButton
        ]}
        labelStyle={
          active ? styles.activeButtonLabel : styles.inactiveButtonLabel
        }
        label={label || ""}
        onPress={onPress}
        active={active}
      />
    );
  }
}
const createStyles = (color?: string) => {
  const styles = StyleSheet.create({
    activeButton: {
      backgroundColor: !color ? Colors.burgundy : Colors.transparent,
      borderColor: !color ? Colors.paleGrey : color
    },
    activeButtonLabel: {
      ...Layout.textFullCenter,
      color: Colors.snow,
      fontFamily: Fonts.type.base,
      fontSize: 13,
      fontWeight: "600",
      height: verticalScale(19),
      marginBottom: verticalScale(10),
      width: scale(32)
    },
    doneButtonContainer: {
      ...Layout.alignCentered,
      borderRadius: 11,
      borderStyle: "solid",
      borderWidth: 1,
      height: verticalScale(32),
      marginBottom: verticalScale(5),
      paddingHorizontal: scale(10),
      paddingVertical: verticalScale(5),
      width: scale(64)
    },
    inactiveButton: {
      backgroundColor: Colors.transparent,
      borderColor: !color ? Colors.paleGrey : color
    },
    inactiveButtonLabel: {
      ...Layout.textFullCenter,
      color: !color ? Colors.onyx : color,
      fontFamily: Fonts.type.base,
      fontSize: 13,
      fontWeight: "600",
      height: verticalScale(19),
      marginBottom: verticalScale(10),
      width: scale(32)
    }
  });
  return styles;
};

export default DoneButton;
