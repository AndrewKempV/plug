import _ from "lodash";
import React, { Component } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Header, Input } from "react-native-elements";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { NavigationScreenProps } from "react-navigation";
import AuthApi from "../../../../api/auth";
import { BackButton, DoneButton } from "../../../../components/Button";
import Metrics from "../../../../config/metrics";
import { Colors, Fonts, Layout } from "../../../../config/styles";
import NavigationService from "app/utils/NavigationService";

interface ChangePasswordScreenState {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
  isChangeValid: boolean;
  isNewPasswordHidden: boolean;
}

const initialState: ChangePasswordScreenState = {
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
  isChangeValid: false,
  isNewPasswordHidden: true
};

class ChangePasswordScreen extends Component<
  NavigationScreenProps,
  ChangePasswordScreenState
> {
  public static navigationOptions = () => {
    return {
      headerLeft: null,
      header: null
    };
  };

  public readonly state: ChangePasswordScreenState = initialState;

  public render() {
    return (
      <View style={styles.container}>
        <View>
          <Header
            backgroundColor={Colors.snow}
            leftComponent={<BackButton onPress={this.goBack} />}
            centerComponent={
              <Text style={styles.screenTitle}>{"Password"}</Text>
            }
            rightComponent={
              <DoneButton
                label={"Save"}
                active={this.isChangeValid()}
                onPress={this.handleSubmitChange}
              />
            }
          />
        </View>
        <Input
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.input}
          style={styles.inputLabel}
          keyboardType={"default"}
          value={this.state.currentPassword}
          placeholder={"Current password"}
          onChangeText={this.handleCurrentPasswordChange}
          secureTextEntry={true}
          rightIcon={
            <MaterialIcon
              name={"cancel"}
              color={Colors.charcoalGreyA490}
              size={15}
              onPress={this.handleCurrentPasswordClear}
            />
          }
        />
        <Input
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.input}
          style={styles.inputLabel}
          keyboardType={"default"}
          value={this.state.newPassword}
          placeholder={"New password"}
          onChangeText={this.handleNewPasswordChange}
          secureTextEntry={this.state.isNewPasswordHidden}
          rightIcon={
            <Text onPress={this.toggleNewPasswordHidden}>
              {this.state.isNewPasswordHidden ? "Show" : "Hide"}
            </Text>
          }
        />
        <Input
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.input}
          style={styles.inputLabel}
          keyboardType={"default"}
          value={this.state.newPasswordConfirm}
          placeholder={"New password, again"}
          onChangeText={this.handleNewPasswordConfirmChange}
          secureTextEntry={this.state.isNewPasswordHidden}
        />
      </View>
    );
  }

  private handleCurrentPasswordChange = (text: string) => {
    this.setState({ currentPassword: text });
    this.ensureChangeIsValid();
  };

  private handleCurrentPasswordClear = () => {
    this.setState({ currentPassword: "" });
    this.ensureChangeIsValid();
  };

  private handleNewPasswordChange = (text: string) => {
    this.setState({ newPassword: text });
    this.ensureChangeIsValid();
  };

  private handleNewPasswordConfirmChange = (text: string) => {
    this.setState({ newPasswordConfirm: text });
    this.ensureChangeIsValid();
  };

  private isChangeValid = () => {
    const { currentPassword, newPassword, newPasswordConfirm } = this.state;
    if (
      _.isNil(currentPassword) ||
      _.isNil(newPassword) ||
      _.isNil(newPasswordConfirm)
    ) {
      return false;
    } else if (
      newPassword.length < 8 ||
      newPasswordConfirm.length < 8 ||
      currentPassword.length < 8
    ) {
      return false;
    } else if (newPassword !== newPasswordConfirm) {
      return false;
    } else {
      return true;
    }
  };

  private ensureChangeIsValid = () => {
    const { currentPassword, newPassword, newPasswordConfirm } = this.state;
    if (
      _.isNil(currentPassword) ||
      _.isNil(newPassword) ||
      _.isNil(newPasswordConfirm)
    ) {
      this.setState({ isChangeValid: false });
    } else if (
      newPassword.length < 8 ||
      newPasswordConfirm.length < 8 ||
      currentPassword.length < 8
    ) {
      this.setState({ isChangeValid: false });
    } else if (newPassword !== newPasswordConfirm) {
      this.setState({ isChangeValid: false });
    } else {
      this.setState({ isChangeValid: true });
    }
  };

  private handleSubmitChange = () => {
    const { currentPassword, newPassword } = this.state;
    AuthApi.changePassword({
      oldPassword: currentPassword,
      password: newPassword
    })
      .then(response => {
        console.log(response);
        if (response === "SUCCESS") {
          Alert.alert("Password successfully changed");
          this.goBack();
        } else if (response.code === "LimitExceededException") {
          Alert.alert(
            "Attempt limit exceeded. Please try again after some time"
          );
        } else {
          Alert.alert("Incorrect password. Please try again");
        }
      })
      .catch(error => console.warn(error));
  };

  private toggleNewPasswordHidden = () => {
    this.setState(prevState => ({
      isNewPasswordHidden: !prevState.isNewPasswordHidden
    }));
  };

  private goBack = () => {
    NavigationService.navigate("Settings");
  };
}

const styles = StyleSheet.create({
  container: {
    ...Layout.container
  },
  input: {
    borderBottomWidth: 0
  },
  inputContainer: {
    ...Layout.alignCentered,
    backgroundColor: Colors.snow,
    marginVertical: Metrics.margin
  },
  inputLabel: {
    color: Colors.onyx,
    fontFamily: Fonts.type.bold,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "bold",
    opacity: 1,
    textAlign: "left"
  },
  screenTitle: {
    ...Layout.textCenter,
    color: Colors.onyx,
    fontFamily: "HelveticaNeue",
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500",
    height: 20,
    width: 141.7
  }
});

export default ChangePasswordScreen;
