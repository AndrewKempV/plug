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

interface BackButtonProps {
  onPress: () => void;
  color?: string;
  borderColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

class BackButton extends PureComponent<BackButtonProps> {
  public static defaultProps: BackButtonProps = {
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
        style={[styles.backButton, containerStyle, { borderColor }]}
        onPress={onPress}
      >
        <IoniconIcon
          style={styles.backButtonIcon}
          name={"ios-arrow-back"}
          color={color}
          size={Metrics.icons.small}
          onPress={onPress}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  backButton: {
    borderRadius: 15,
    borderWidth: 1,
    height: Metrics.icons.medium,
    width: Metrics.icons.medium
  },
  backButtonIcon: {
    paddingLeft: scale(7.5),
    paddingTop: verticalScale(1.5)
  }
});

export default BackButton;
