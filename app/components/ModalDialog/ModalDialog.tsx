import React, { PureComponent } from "react";
import {
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters/extend";
import Metrics from "../../config/metrics";
import { Colors, Layout } from "../../config/styles";
import { BetterButton } from "../Button";
import styles from "./styles";
interface ButtonProps {
  containerStyle: StyleProp<ViewStyle>;
  labelStyle: StyleProp<TextStyle>;
  label: string;
  onPress?: (params?: any) => void;
}

interface ModalDialogProps {
  title: string;
  subTitle: string;
  buttons: ButtonProps[];
  active: boolean;
  transparent: boolean;
  dialogStyle?: StyleProp<ViewStyle>;
  buttonContainerStyle?: StyleProp<ViewStyle>;
  subTitleStyle?: StyleProp<TextStyle>;
}

class ModalDialog extends PureComponent<ModalDialogProps> {
  public static defaultProps: ModalDialogProps = {
    title: "",
    subTitle: "",
    buttons: [],
    active: false,
    transparent: false,
    dialogStyle: styles.dialog,
    subTitleStyle: styles.subtitle
  };

  public render() {
    const {
      title,
      subTitle,
      buttons,
      active,
      transparent,
      dialogStyle,
      buttonContainerStyle,
      subTitleStyle
    } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent={transparent}
        visible={active}
        onRequestClose={() => {
          return;
        }}
      >
        <View style={styles.container}>
          <View style={dialogStyle}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode={"tail"}>
              {title}
            </Text>
            <Text style={subTitleStyle}>{subTitle}</Text>
            <View style={buttonContainerStyle}>
              {buttons.map(this.renderButton)}
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  private renderButton(button: ButtonProps, index: number) {
    return (
      <BetterButton
        key={index}
        style={button.containerStyle}
        labelStyle={[button.labelStyle, styles.buttonLabel]}
        label={button.label}
        onPress={button.onPress}
      />
    );
  }
}

export default ModalDialog;
