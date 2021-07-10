import React, { PureComponent } from "react";
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  ViewStyle
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Metrics from "../../config/metrics";
import { Colors } from "../../config/styles";

interface CancelButtonProps {
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}

export default class CancelButton extends PureComponent<CancelButtonProps> {
  public render() {
    return (
      <TouchableOpacity
        style={this.props.containerStyle}
        onPress={this.props.onPress}
      >
        <MaterialIcon
          style={this.props.iconStyle}
          name={"cancel"}
          color={Colors.charcoalGrey}
          size={Metrics.icons.small}
          onPress={this.props.onPress}
        />
      </TouchableOpacity>
    );
  }
}
