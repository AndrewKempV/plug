import React, { Component, RefObject, createRef } from "react";
import {
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
  Modal
} from "react-native";
import { Header } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";
import { ApiClient } from "../../../../api/client";
import { BackButton, BetterButton } from "../../../../components/Button";
import { Colors, Layout } from "../../../../config/styles";
import { CreditCardForm } from "../../../../components/CreditCard";
import styles from "./styles";
import strings from "./strings";
import {
  CreditCardFields,
  CreditCardFieldType,
  FormFieldStatus
} from "../../../../components/CreditCard/types";
import { InjectedState } from "../../../../components/CreditCard/ConnectToState";
import Lottie from "lottie-react-native";
import storage from "../../../../utils/storage";
import { loopAnimations } from "../../../../utils/animations";
import settingsActions from "../../actions";
import { GetPropsFromDispatch } from "../../../../store/ActionCreators";
import { StateStore } from "../../../../store/AppReducer";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import _, { delay } from "lodash";
import { APIActionStatus } from "../../../../models/ApiActionStatus";
import NavigationService from "app/utils/NavigationService";

interface ErrorProps {
  onConfirm: () => void;
}
const ErrorNotification = ({ onConfirm }: ErrorProps) => {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorLabel}>
        {"The card number seems to be invalid. Please check."}
      </Text>
      <BetterButton
        style={styles.errorButtonContainer}
        label={"OK"}
        labelStyle={styles.errorButtonLabel}
        onPress={onConfirm}
      />
    </View>
  );
};

type ErrorModalProps = ErrorProps & {
  onDeny: () => void;
  isVisible?: boolean;
};

const ErrorDialog = ({ onConfirm, onDeny, isVisible }: ErrorModalProps) => {
  const [visible, setVisible] = React.useState<boolean>(
    _.isNil(isVisible) ? true : isVisible
  );
  const deny = () => {
    setVisible(false);
    onDeny();
  };
  const confirm = () => {
    setVisible(false);
    onConfirm();
  };
  return (
    <Modal
      visible={visible}
      animated={true}
      animationType={"fade"}
      transparent={true}
    >
      <View style={styles.modalErrorContainer}>
        <View style={styles.modalErrorDialogContainer}>
          <BetterButton
            style={styles.denyButtonContainer}
            labelStyle={styles.denyButtonLabel}
            onPress={deny}
            label={"X"}
          />
          <Text style={styles.modalErrorLabel}>
            {
              "Something went wrong, please check the card details and try again."
            }
          </Text>
          <BetterButton
            style={styles.confirmButtonContainer}
            labelStyle={styles.confirmButtonLabel}
            onPress={confirm}
            label={"Okay"}
          />
        </View>
      </View>
    </Modal>
  );
};

type ActionCreators = typeof settingsActions;
type StateFromDispatch = ReturnType<typeof mapStateToProps>;
type PropsFromDispatch = GetPropsFromDispatch<ActionCreators>;

const mapStateToProps = (state: StateStore) => ({
  customer: state.settingReducer.customer,
  status: state.settingReducer.status,
  lastAction: state.settingReducer.lastAction
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<ActionCreators, PropsFromDispatch>(
    settingsActions,
    dispatch
  );

type ReduxProps = StateFromDispatch & PropsFromDispatch;
type ConnectedScreenProps = ReduxProps & NavigationScreenProps;

type FormProgress = "input" | "upload" | "complete";

interface AddPaymentScreenState {
  isValid?: boolean;
  values?: CreditCardFields;
  showNumberError: boolean;
  didSubmit: boolean;
  focused?: CreditCardFieldType;
  formProgress: FormProgress;
}

const initialState: AddPaymentScreenState = {
  isValid: false,
  formProgress: "input",
  showNumberError: false,
  didSubmit: false
};

class AddPaymentScreen extends Component<
  ConnectedScreenProps,
  AddPaymentScreenState
> {
  public static navigationOptions = () => {
    return {
      headerLeft: null,
      header: null
    };
  };

  public readonly state = initialState;

  public control: Lottie | null = null;

  public progress: Animated.Value = new Animated.Value(0);

  public componentDidMount() {
    this.props.getCustomer();
    this.progress.setValue(0);
    this.setState({
      didSubmit: false
    });
  }

  public render() {
    const { formProgress } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Header
            backgroundColor={Colors.snow}
            leftComponent={
              <BackButton
                onPress={() => NavigationService.navigate("SavedPayments")}
              />
            }
            centerComponent={
              <Text style={styles.screenTitle}>{"Add a card"}</Text>
            }
          />
        </View>
        {formProgress === "input" && this.renderForm()}
        {(formProgress === "upload" || formProgress === "complete") &&
          this.renderUploading()}
        {this.props.status === APIActionStatus.FAILED &&
          this.state.didSubmit && (
            <ErrorDialog
              onConfirm={() => this.setState({ didSubmit: false })}
              onDeny={() => this.setState({ didSubmit: false })}
            />
          )}
      </View>
    );
  }

  private renderForm = () => {
    const tooltipOffset = this.state.focused! !== "name" ? 0 : 64;
    const errorOffset = this.state.showNumberError ? 62 : 0;
    const tooltipPosition: StyleProp<ViewStyle> = {
      top: styles.tooltip.top + tooltipOffset + errorOffset
    };
    return (
      <View style={styles.formContainer}>
        {this.state.showNumberError && (
          <ErrorNotification onConfirm={this.hideNumberError} />
        )}
        <CreditCardForm
          containerStyle={styles.formContentContainer}
          focused={"number"}
          autofocus={true}
          requiresCVC={true}
          requiresName={true}
          requiresPostalCode={true}
          onChange={this.onChange}
          onFocus={this.onFocus}
          values={this.state.values}
        />
        {this.shouldShowTooltip() && (
          <View style={[styles.tooltip, tooltipPosition]}>
            <View style={[styles.triangleUp]} />
            <Text style={styles.tooltipLabel}>
              {this.state.focused === "cvc"
                ? strings.cvvTooltip
                : strings.nameTooltip}
            </Text>
          </View>
        )}
        <BetterButton
          style={
            this.state.isValid
              ? styles.saveButtonEnabledContainer
              : styles.saveButtonDisabledContainer
          }
          labelStyle={styles.saveButtonLabel}
          label={strings.saveLabel}
          active={this.state.isValid}
          onPress={this.submit}
        />
      </View>
    );
  };

  private renderUploading = () => {
    return (
      <View style={styles.animationScreenContainer}>
        <Lottie
          ref={ref => (this.control = ref)}
          loop={false}
          autoPlay={false}
          source={require("../../../../assets/card-added-animation.json")}
          progress={this.progress}
          style={styles.animation}
        />
        <Text style={styles.addCardActionLabel}>
          {this.state.formProgress === "upload"
            ? strings.addCardActionLabel
            : strings.cardAddedLabel}
        </Text>
        <Text style={styles.addCardActionSubLabel}>
          {this.state.formProgress === "upload"
            ? strings.addCardActionSubLabel
            : strings.cardAddedSubLabel}
        </Text>
      </View>
    );
  };

  private submit = async () => {
    const { values } = this.state;
    const { cvc, number, expiry, postalCode } = values!;
    const expiryParts = expiry.split("/");
    const exp_month = expiryParts[0];
    const exp_year = expiryParts[1];
    this.setState({
      formProgress: "upload"
    });
    this.startAnimation();
    if (!_.isNil(this.props.customer)) {
      this.props.addPaymentMethod({
        number,
        cvc,
        exp_month,
        exp_year,
        address_zip: postalCode
      });
    } else {
      this.props.createCustomerWithDefaultCard({
        number,
        cvc,
        exp_month,
        exp_year,
        address_zip: postalCode
      });
    }
  };

  private onChange = (inputs: InjectedState) => {
    const { valid, values, status } = inputs;
    this.setState({
      values,
      isValid: valid,
      showNumberError: status.number === "invalid"
    });
  };

  private onFocus = (focused: CreditCardFieldType) => {
    this.setState({ focused });
  };

  private shouldShowTooltip = () => {
    return this.state.focused === "cvc" || this.state.focused === "name";
  };

  private hideNumberError = () => this.setState({ showNumberError: false });

  private startAnimation = () => {
    Animated.timing(this.progress, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear
    }).start(this.onAnimationComplete);
  };

  private pauseAnimation = () => {
    this.progress.stopAnimation();
  };

  private onAnimationComplete = () => {
    this.setState({
      formProgress: "complete",
      didSubmit: true
    });
    delay(
      () =>
        this.props.status === APIActionStatus.SUCCEEDED
          ? NavigationService.navigate("SavedPayments")
          : this.setState({ formProgress: "input" }),
      2000
    );
  };
}

export default connect<StateFromDispatch, PropsFromDispatch, {}, StateStore>(
  mapStateToProps,
  mapDispatchToProps
)(AddPaymentScreen);
