import React, { PureComponent } from "react";
import { Alert, Text, View, TextInput, Keyboard } from "react-native";
import { KeyboardAccessoryView } from "react-native-keyboard-accessory";
import { Colors } from "../../config/styles";
import { BetterButton, CancelButton } from "../Button";
import styles from "./styles";

interface MessageKeyboardAccessoryProps {
  onOpen?: () => void;
  onDismiss?: () => void;
  visible?: boolean;
}

interface MessageKeyboardAccessoryState {
  message: string;
}

const initialState: MessageKeyboardAccessoryState = {
  message: ""
};

class MessageKeyboardAccessory extends PureComponent<
  MessageKeyboardAccessoryProps,
  MessageKeyboardAccessoryState
> {
  public readonly state: MessageKeyboardAccessoryState = initialState;

  public render() {
    return (
      <KeyboardAccessoryView alwaysVisible={this.props.visible}>
        <View style={styles.accessoryViewContainer}>
          <View style={styles.messagePanelHeaderContainer}>
            <CancelButton
              containerStyle={styles.messagePanelDismissButton}
              onPress={this.dismiss}
            />
            <Text style={styles.messagePanelTitle}>{"New Message"}</Text>
          </View>
          <View style={styles.textInputContainer}>
            <BetterButton
              style={styles.messageButtonContainer}
              iconStyle={styles.messageIcon}
              iconName={"send-msg"}
              iconColor={Colors.burgundy}
              iconSize={17.5}
              onPress={() => console.log("Opening add media")}
            />
            <TextInput
              placeholder={"Say something..."}
              selectionColor={Colors.burgundy}
              underlineColorAndroid="transparent"
              style={styles.textInput}
              multiline={true}
              value={this.state.message}
              onChangeText={this.onChangeMessage}
              autoFocus={true}
            />
            <BetterButton
              style={styles.textInputButton}
              labelStyle={styles.textInputButtonLabel}
              label={"Send"}
              onPress={this.send}
            />
          </View>
        </View>
      </KeyboardAccessoryView>
    );
  }

  private onChangeMessage = (message: string) => {
    this.setState({ message });
  };

  private dismiss = () => {
    if (this.props.onDismiss) {
      this.props.onDismiss();
    }
    Keyboard.dismiss();
  };

  private send = () => {
    Alert.alert("Sending " + this.state.message);
  };
}

export default MessageKeyboardAccessory;
