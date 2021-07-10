import _ from "lodash";
import React, { Component } from "react";
import { Alert, Text, View } from "react-native";
import { Header, Input } from "react-native-elements";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { NavigationScreenProps } from "react-navigation";
import AuthApi from "../../../../api/auth";
import { BackButton, DoneButton } from "../../../../components/Button";
import { Colors } from "../../../../config/styles";
import { validateEmail } from "../../../../utils/helpers";
import styles from "./styles";
import EmailVerification from "../../components/EmailVerificationForm";
import NavigationService from "app/utils/NavigationService";

type Stage = "input" | "verification";

interface ChangeEmailScreenState {
  email: string;
  stage: Stage;
}

const initialState: ChangeEmailScreenState = {
  email: "",
  stage: "input"
};

class ChangeEmailScreen extends Component<
  NavigationScreenProps,
  ChangeEmailScreenState
> {
  public static navigationOptions = () => {
    return {
      headerLeft: null,
      header: null
    };
  };

  public readonly state: ChangeEmailScreenState = initialState;

  public oldEmail: string = "";

  public componentDidMount() {
    AuthApi.getAttributes()
      .then(attributes => {
        if (!_.isNil(attributes)) {
          const attr = attributes.find(attr => attr.Name === "email");
          if (attr) {
            this.oldEmail = attr.Value;
            this.setState({ email: attr.Value });
          }
        }
      })
      .catch(error => error);
  }

  public render() {
    return (
      <View style={styles.container}>
        <View>
          <Header
            backgroundColor={Colors.snow}
            leftComponent={<BackButton onPress={this.goBack} />}
            centerComponent={<Text style={styles.screenTitle}>{"Email"}</Text>}
            rightComponent={
              <DoneButton
                onPress={this.submitChange}
                active={this.isEmailValid()}
              />
            }
          />
        </View>
        <Input
          inputContainerStyle={styles.input}
          containerStyle={styles.inputContainer}
          keyboardType={"email-address"}
          value={this.state.email}
          placeholder={this.state.email || ""}
          onChangeText={this.handleEmailChanged}
          rightIcon={
            <MaterialIcon
              name={"cancel"}
              color={Colors.charcoalGreyA490}
              size={17}
              onPress={this.handleEmailClear}
              style={styles.cancelIcon}
            />
          }
          leftIcon={
            <MaterialIcon
              name={"mail"}
              color={Colors.charcoalGreyA490}
              size={17}
              style={styles.mailIcon}
            />
          }
        />
        <EmailVerification
          visible={this.state.stage === "verification"}
          onSuccess={this.onSuccess}
        />
      </View>
    );
  }

  private handleEmailChanged = (text: string) => {
    this.setState({ email: text });
  };

  private handleEmailClear = () => {
    this.setState({ email: "" });
  };

  private isEmailValid = () => {
    return (
      validateEmail(this.state.email) && this.state.email !== this.oldEmail
    );
  };

  private submitChange = () => {
    // Alert.alert(`Email changed to ${this.state.email}`);
    AuthApi.updateEmail(this.state.email)
      .then(result => {
        if (result === "SUCCESS") {
          this.setState({ stage: "verification" });
        } else if (result.code === "AliasExistsException") {
          Alert.alert(result.message);
        } else {
          Alert.alert("Failed to change email. Please try again");
        }
      })
      .catch(error => error);
  };

  private onSuccess = (message: string) => {
    if (message === "SUCCESS") {
      NavigationService.navigate("Settings");
    } else {
      Alert.alert("An error has occurred during verification");
    }
  };

  private goBack = () => {
    NavigationService.navigate("Settings");
  };
}

export default ChangeEmailScreen;
