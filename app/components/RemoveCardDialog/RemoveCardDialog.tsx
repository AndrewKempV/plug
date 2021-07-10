import React, { PureComponent, RefObject, createRef } from "react";
import { View, Modal, Text } from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
import styles from "./styles";
import { BetterButton } from "../Button";
import { PaymentItem } from "../SavedPaymentList/SavedPaymentList";
import { Issuer } from "../CreditCard/types";

interface Props {
  onConfirm: (item: PaymentItem) => void;
  onDeny: () => void;
  menuState: "Open" | "Closed";
  item: PaymentItem;
}

class RemoveCardDialog extends PureComponent<Props> {
  public sheet: RefObject<BottomSheet> = createRef<BottomSheet>();

  public renderInner = () => {
    return (
      <View style={styles.panel}>
        <Text style={styles.titleLabel}>{"Confirm card removal"}</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>
            {"Are you sure you wish to remove"}
          </Text>
          <View collapsable={true} style={styles.descriptionRowContainer}>
            <Text style={styles.descriptionLabel}>{"the card"}</Text>
            <Text style={styles.cardLabel}>
              {this.formatLabel(this.props.item.issuer, this.props.item.last4)}
            </Text>
            <Text style={styles.descriptionLabel}>{"?"}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <BetterButton
            style={styles.confirmButtonContainer}
            labelStyle={styles.confirmLabel}
            label={"Yes"}
            onPress={this.confirm}
          />
          <BetterButton
            style={styles.declineButtonContainer}
            labelStyle={styles.declineLabel}
            label={"No"}
            onPress={this.props.onDeny}
          />
        </View>
      </View>
    );
  };

  public renderHeader = () => <View style={styles.header} />;

  public render() {
    return (
      <Modal
        presentationStyle={"overFullScreen"}
        transparent={true}
        visible={this.props.menuState === "Open"}
        animationType={"fade"}
        supportedOrientations={["portrait"]}
        onRequestClose={() => {
          return;
        }}
      >
        <View style={styles.container}>
          <View style={styles.panelContainer}>
            <BottomSheet
              ref={this.sheet}
              snapPoints={[243.5]}
              renderContent={this.renderInner}
              renderHeader={this.renderHeader}
              initialSnap={0}
              enabledInnerScrolling={false}
            />
            <View style={styles.map} />
          </View>
        </View>
      </Modal>
    );
  }

  private confirm = () => {
    const { item, onConfirm } = this.props;
    onConfirm(item);
  };

  private formatLabel = (issuer: Issuer, last4: string) => {
    switch (issuer) {
      case "american-express":
        return ` AMX **** ${last4}`;
      case "mastercard":
        return ` MC **** ${last4}`;
      case "visa":
        return ` VC **** ${last4}`;
      case "discover":
        return ` DC **** ${last4}`;
      default:
        return ` **** ${last4}`;
    }
  };
}

export default RemoveCardDialog;
