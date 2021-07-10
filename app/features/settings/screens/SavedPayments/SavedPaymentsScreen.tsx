import React, { createRef, RefObject } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Header } from "react-native-elements";
import { scale, verticalScale } from "react-native-size-matters/extend";
import { NavigationScreenProps } from "react-navigation";
import Images from "../../../../assets/images";
import { BackButton, BetterButton } from "../../../../components/Button";
import Metrics from "../../../../config/metrics";
import { Colors, Layout, Fonts } from "../../../../config/styles";
import { NavOptions } from "../../../../navigators/TabNavigator";
import Icons from "../../../../components/CreditCard/Icons";
import SavedPaymentList, {
  PaymentItem
} from "../../../../components/SavedPaymentList/SavedPaymentList";
import _ from "lodash";
import PaymentMenu, {
  BottomMenuState
} from "../../../../components/PaymentMenu/PaymentMenu";
import settingsActions from "../../actions";
import { GetPropsFromDispatch } from "../../../../store/ActionCreators";
import { StateStore } from "../../../../store/AppReducer";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import RemoveCardDialog from "../../../../components/RemoveCardDialog";
import NavigationService from "app/utils/NavigationService";

type StateFromDispatch = ReturnType<typeof mapStateToProps>;
type PropsFromDispatch = GetPropsFromDispatch<typeof settingsActions>;
type ReduxProps = StateFromDispatch & PropsFromDispatch;
type ConnectedScreenProps = ReduxProps & NavigationScreenProps;

interface SavedPaymentsScreenState {
  paymentMenuState: BottomMenuState;
  removalDialogState: BottomMenuState;
  selectedItem?: PaymentItem;
}

const initialState: SavedPaymentsScreenState = {
  paymentMenuState: "Closed",
  removalDialogState: "Closed"
};

class SavedPaymentsScreen extends React.Component<
  ConnectedScreenProps,
  SavedPaymentsScreenState
> {
  public static navigationOptions = (): NavOptions => {
    return {
      header: null
    };
  };

  public readonly state: SavedPaymentsScreenState = initialState;

  private listRef: RefObject<SavedPaymentList> = createRef();

  public componentDidMount() {
    const { customer, paymentMethods } = this.props;
    if (_.isEmpty(paymentMethods)) {
      this.props.getPaymentMethods();
    }
    if (!customer) {
      this.props.getCustomer();
    }
  }

  public render() {
    const { paymentMethods } = this.props;
    const { selectedItem, paymentMenuState, removalDialogState } = this.state;
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={Colors.snow}
          leftComponent={
            <BackButton onPress={() => NavigationService.navigate("Menu")} />
          }
          centerComponent={<Text style={styles.screenTitle}>{"Payments"}</Text>}
        />
        <View style={styles.screenContentContainer}>
          {_.isEmpty(paymentMethods)
            ? this.renderPlaceholder()
            : this.renderSavedPayments()}
        </View>
        <View style={styles.footer}>
          <View style={styles.addCardButtonContainer}>
            <BetterButton
              style={styles.addCardButtonContainer}
              labelStyle={styles.addCardButtonLabel}
              iconStyle={styles.addButtonIcon}
              label={"Add a card"}
              iconSetName={"ionicon"}
              iconColor={Colors.burgundy}
              iconName={"ios-add-circle-outline"}
              iconSize={Metrics.icons.small}
              onPress={this.goToAddPayment}
            />
          </View>
        </View>
        <PaymentMenu
          menuState={paymentMenuState}
          selectedItem={selectedItem}
          onRemove={this.onPressRemove}
          onSetDefault={this.setDefault}
          onCancel={this.closeBottomMenu}
        />
        <RemoveCardDialog
          menuState={removalDialogState}
          onConfirm={this.onConfirmRemove}
          onDeny={this.onDenyRemove}
          item={selectedItem!}
        />
      </View>
    );
  }

  private renderPlaceholder = () => {
    return (
      <View style={styles.emptyContentContainer}>
        <View style={styles.acceptedCreditCardsSection}>
          <Image source={Icons.visa} style={styles.creditCardLogo} />
          <Image source={Images.mastercard} style={styles.creditCardLogo} />
          <Image source={Images.discover} style={styles.creditCardLogo} />
          <Image source={Images.amex} style={styles.creditCardLogo} />
        </View>
        <Text style={styles.emptyContentLabel}>{"No cards available"}</Text>
        <Text style={styles.emptyCallToActionLabel}>
          {
            "Add your card details for seamless payments with PLUGG. Your card will be charged only after your ticket is received."
          }
        </Text>
      </View>
    );
  };

  private renderSavedPayments = () => {
    const { paymentMethods } = this.props;
    return (
      <View style={styles.emptyContentContainer}>
        <SavedPaymentList
          ref={this.listRef}
          items={paymentMethods}
          onPressItem={this.onPressItem}
        />
      </View>
    );
  };

  private goToAddPayment = () => {
    NavigationService.navigate("AddPayment");
  };

  private onPressItem = async (selectedItem: PaymentItem) => {
    this.setState({ selectedItem });
    await this.openBottomMenu();
  };

  private openBottomMenu = async () => {
    this.setState({ paymentMenuState: "Open" });
  };

  private closeBottomMenu = async () => {
    this.setState({ paymentMenuState: "Closed" });
  };

  private openConfirmationDialog = async () => {
    this.setState({ removalDialogState: "Open" });
  };

  private closeRemovalDialog = async () => {
    this.setState({ removalDialogState: "Closed" });
  };

  private onPressRemove = () => {
    this.closeBottomMenu().then(this.openConfirmationDialog);
  };

  private onConfirmRemove = (item: PaymentItem) => {
    this.remove(item);
    this.closeRemovalDialog();
  };

  private onDenyRemove = () => {
    this.closeRemovalDialog();
  };

  private remove = (item: PaymentItem) => {
    const list = this.listRef.current;
    if (list) {
      this.props.deletePaymentMethod(item.id);
    }
  };

  private setDefault = (item: PaymentItem) => {
    this.props.changeDefaultPaymentMethod(item.id);
    this.closeBottomMenu();
  };
}

const mapStateToProps = (state: StateStore) => ({
  customer: state.settingReducer.customer,
  paymentMethods: state.settingReducer.paymentMethods,
  lastAction: state.settingReducer.lastAction,
  status: state.settingReducer.status
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<typeof settingsActions, PropsFromDispatch>(
    settingsActions,
    dispatch
  );

export default connect<StateFromDispatch, PropsFromDispatch, {}, StateStore>(
  mapStateToProps,
  mapDispatchToProps
)(SavedPaymentsScreen);

const styles = StyleSheet.create({
  acceptedCreditCardsSection: {
    height: verticalScale(40),
    maxHeight: verticalScale(40),
    width: scale(180),
    ...Layout.horizontalFlex,
    ...Layout.alignCentered
  },
  addButtonIcon: {
    marginRight: scale(10)
  },
  addCardButtonContainer: {
    height: verticalScale(52),
    width: scale(289),
    ...Layout.alignCentered,
    ...Layout.horizontalFlex
  },
  addCardButtonLabel: {
    color: Colors.burgundy,
    fontFamily: Fonts.type.base,
    fontSize: 17,
    fontStyle: "normal",
    fontWeight: "bold",
    height: verticalScale(21),
    textAlign: "left",
    width: scale(88)
  },
  bottomMenuItemLabel: {
    color: Colors.onyx,
    fontFamily: "Roboto",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "normal",
    height: verticalScale(24),
    textAlign: "center",
    width: scale(339)
  },
  cancelMenuItemLabel: {
    color: Colors.burgundy,
    fontFamily: "Roboto",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "500",
    height: verticalScale(24),
    width: scale(355),
    ...Layout.textFullCenter
  },
  cardListSectionLabel: {
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "500",
    height: verticalScale(18),
    textAlign: "left",
    width: scale(178)
  },
  container: {
    ...Layout.container
  },
  creditCardLogo: {
    height: verticalScale(24),
    marginHorizontal: 5,
    width: scale(40)
  },
  emptyCallToActionLabel: {
    color: Colors.charcoalGrey,
    fontFamily: Fonts.type.base,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "normal",
    height: verticalScale(61),
    width: scale(337),
    ...Layout.textCenter
  },
  emptyContentContainer: {
    ...Layout.container,
    ...Layout.alignCentered
  },
  emptyContentLabel: {
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "bold",
    height: verticalScale(39),
    width: scale(158),
    ...Layout.textCenter
  },
  footer: {
    backgroundColor: Colors.snow,
    borderColor: Colors.paleGrey,
    borderStyle: "solid",
    borderWidth: 1,
    height: verticalScale(118.6),
    width: Metrics.DEVICE_WIDTH,
    ...Layout.alignCentered
  },
  screenContentContainer: {
    backgroundColor: Colors.paleBlue,
    height: verticalScale(605.8),
    ...Layout.alignCentered
  },
  screenTitle: {
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500",
    height: verticalScale(25),
    textAlign: "center",
    width: scale(90)
  }
  // savedPaymentListLabel: {
  //     width: 178,
  //     height: 18,
  //     fontFamily: Fonts.type.base,
  //     fontSize: 15,
  //     fontWeight: "500",
  //     fontStyle: "normal",
  //     textAlign: "left",
  //     color: Colors.dark,
  // },
  // listHeaderContainer: {
  //     height: 64,
  //     width: Metrics.DEVICE_WIDTH,
  //     ...Layout.alignLeft
  // }
});
