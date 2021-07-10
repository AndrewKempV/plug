import React, { PureComponent } from "react";
import {
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import IoniconIcon from "react-native-vector-icons/Ionicons";
import Metrics from "../../config/metrics";
import { Colors } from "../../config/styles";

interface AddButtonProps {
  onPress: () => void;
  color?: string;
  borderColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

class AddButton extends PureComponent<AddButtonProps> {
  public static defaultProps: AddButtonProps = {
    onPress: () => {
      return;
    },
    color: Colors.black,
    borderColor: Colors.paleGrey
  };
  public render() {
    const { onPress, color, borderColor, containerStyle } = this.props;
    return (
      <TouchableOpacity
        style={[styles.button, containerStyle, { borderColor }]}
        onPress={onPress}
      >
        <IoniconIcon
          style={styles.buttonIcon}
          name={"ios-add-circle-outline"}
          color={color}
          size={Metrics.icons.small}
          onPress={onPress}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 15,
    borderWidth: 1,
    height: Metrics.icons.medium,
    width: Metrics.icons.medium
  },
  buttonIcon: {
    paddingLeft: scale(7.5),
    paddingTop: verticalScale(1.5)
  }
});

export default AddButton;
