import React, { PureComponent } from "react";
import styles from "./styles";
import { getIcon } from "../CreditCard/Icons";
import { StyleProp, ViewStyle, Image, Text } from "react-native";
import { ListItem, IconProps } from "react-native-elements";
import { Colors, Layout } from "../../config/styles";
import Metrics from "../../config/metrics";
import { PaymentItem } from "../SavedPaymentList/SavedPaymentList";
import { Issuer } from "../CreditCard/types";

interface SavedPaymentCardProps {
  payment: PaymentItem;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

class SavedPaymentCard extends PureComponent<SavedPaymentCardProps> {
  static defaultProps: SavedPaymentCardProps = {
    payment: {
      id: "",
      last4: "",
      default: false,
      issuer: "placeholder"
    }
  };

  render() {
    const { payment } = this.props;
    const { id, issuer, last4 } = payment;
    const checkmark: Omit<IconProps, "name"> = {
      color: payment.default ? Colors.burgundy : Colors.transparent,
      size: Metrics.icons.medium,
      iconStyle: { backgroundColor: Colors.snow }
    };
    return (
      <ListItem
        containerStyle={styles.container}
        contentContainerStyle={styles.contentContainer}
        titleStyle={styles.cardLabel}
        title={this.formatLabel(issuer, last4)}
        checkmark={checkmark}
        leftIcon={<Image source={getIcon(issuer)} style={styles.cardIcon} />}
        onPress={this.onPress}
      />
    );
  }

  onPress = () => {
    const { onPress } = this.props;
    if (onPress) {
      onPress();
    }
  };

  formatLabel = (issuer: Issuer, last4: string) => {
    switch (issuer) {
      case "american-express":
        return `AMX **** ${last4}`;
      case "mastercard":
        return `MC **** ${last4}`;
      case "visa":
        return `VC **** ${last4}`;
      case "discover":
        return `DC **** ${last4}`;
      default:
        return `**** ${last4}`;
    }
  };
}

export default SavedPaymentCard;
