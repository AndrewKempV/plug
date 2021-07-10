import _ from "lodash";
import React, { createRef, RefObject } from "react";
import {
  Alert,
  Image,
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  TouchableOpacity
} from "react-native";
import { ListItem, ListItemProps } from "react-native-elements";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import BottomSheet from "reanimated-bottom-sheet";
import Images from "../../assets/images";
import Metrics from "../../config/metrics";
import { Colors, Fonts, Layout } from "../../config/styles";
import LayoutDebugger from "../../utils/LayoutDebugger";
import { PaymentItem } from "../SavedPaymentList/SavedPaymentList";
import { getIcon } from "../CreditCard/Icons";
import { Issuer } from "../CreditCard/types";

export type BottomMenuState = "Open" | "Closed";

interface PaymentMenuProps {
  menuState: BottomMenuState;
  selectedItem: PaymentItem;
  selectedIndex: number;
  onRemove: (item: PaymentItem) => void;
  onSetDefault: (item: PaymentItem) => void;
  onCancel?: () => void;
}

export default class PaymentMenu extends React.Component<PaymentMenuProps> {
  public static defaultProps: PaymentMenuProps = {
    selectedItem: { id: "", issuer: "placeholder", last4: "" },
    onRemove: (item: PaymentItem) => {
      return;
    },
    onSetDefault: (item: PaymentItem) => {
      return;
    },
    selectedIndex: 0,
    menuState: "Closed"
  };

  public sheetRef: RefObject<BottomSheet> = createRef<BottomSheet>();

  public renderInner = () => {
    const { selectedItem } = this.props;
    const { issuer, last4 } = selectedItem;
    return (
      <View style={styles.panel}>
        <View style={[styles.cardItemContainer]}>
          <Image source={getIcon(issuer)} style={styles.cardIcon} />
          <Text style={styles.itemLabel}>{`**** ${last4}`}</Text>
        </View>
        <ListItem
          title={"Set as default"}
          titleStyle={styles.itemLabel}
          containerStyle={styles.itemContainer}
          onPress={this.setDefault}
        />
        <ListItem
          title={"Remove card"}
          titleStyle={styles.itemLabel}
          containerStyle={styles.itemContainer}
          onPress={this.remove}
        />
        <ListItem
          title={"Cancel"}
          titleStyle={styles.cancelLabel}
          onPress={this.cancel}
        />
      </View>
    );
  };

  public renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHandle} />
    </View>
  );

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
              ref={this.sheetRef}
              snapPoints={[309]}
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

  private cancel = () => {
    if (!_.isNil(this.sheetRef.current)) {
      if (this.props.onCancel) {
        this.props.onCancel();
      }
      const sheet = this.sheetRef.current;
      sheet.snapTo(0);
    }
  };

  private setDefault = () => {
    const { selectedItem } = this.props;
    this.props.onSetDefault(selectedItem);
  };

  private remove = () => {
    const { selectedItem } = this.props;
    this.props.onRemove(selectedItem);
  };
}

const IMAGE_SIZE = 200;

const styles = StyleSheet.create({
  // StyleSheet.create({
  container: {
    backgroundColor: Colors.A400,
    flex: 1
  },
  box: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE
  },
  panelContainer: {
    backgroundColor: Colors.snow,
    bottom: 0,
    left: 0,
    marginHorizontal: 10,
    position: "absolute",
    right: 0
  },
  panel: {
    backgroundColor: Colors.snow,
    borderBottomColor: Colors.paleGrey,
    borderLeftColor: Colors.paleGrey,
    borderRightColor: Colors.paleGrey,
    borderTopColor: Colors.transparent,
    borderWidth: 1,
    height: 283,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 0
  },
  header: {
    ...Layout.horizontalTopCenter,
    backgroundColor: Colors.snow,
    borderBottomColor: Colors.transparent,
    borderBottomWidth: 0,
    borderLeftColor: Colors.paleGrey,
    borderLeftWidth: 1,
    borderRightColor: Colors.paleGrey,
    borderRightWidth: 1,
    borderTopColor: Colors.paleGrey,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    paddingTop: 10,
    shadowColor: "#000000"
  },
  panelHeader: {
    ...Layout.horizontalTopCenter,
    backgroundColor: Colors.snow
  },
  panelHandle: {
    backgroundColor: Colors.silver,
    borderRadius: 28,
    height: 6,
    marginBottom: 10,
    width: 56
  },
  panelTitle: {
    fontSize: 27,
    height: 35
  },
  panelSubtitle: {
    color: "gray",
    fontSize: 14,
    height: 30,
    marginBottom: 10
  },
  panelButton: {
    alignItems: "center",
    backgroundColor: "#318bfb",
    borderRadius: 10,
    marginVertical: 10,
    padding: 20
  },
  panelButtonTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold"
  },
  map: {
    backgroundColor: Colors.snow,
    borderColor: Colors.transparent,
    borderWidth: 1,
    height: "100%",
    opacity: 1,
    width: "100%"
  },
  itemLabel: {
    ...Layout.textFullCenter,
    color: Colors.onyx,
    fontFamily: "Roboto",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "normal",
    letterSpacing: 0.01,
    lineHeight: 24,
    textAlign: "center"
  },
  cancelLabel: {
    ...Layout.textFullCenter,
    color: Colors.burgundy,
    fontFamily: Fonts.type.bold,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "600"
  },
  itemContainer: {
    borderBottomColor: Colors.paleGrey,
    borderBottomWidth: 1,
    height: 59.5
  },
  cardItemContainer: {
    borderBottomColor: Colors.paleGrey,
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 48,
    width: 328,
    ...Layout.alignCentered
  },
  cardIcon: {
    height: 16,
    marginBottom: 3,
    marginRight: 9,
    width: 21.6
  }
});
