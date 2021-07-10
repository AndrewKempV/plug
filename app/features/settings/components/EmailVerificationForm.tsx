import React, { Component } from "react";
import { View, Text, Modal, StyleSheet, Alert } from "react-native";
import { Layout, Colors } from "../../../config/styles";
import VerificationForm from "../../../components/VerificationForm";
import AuthApi from "../../../api/auth";

interface Props {
  onSuccess: (message: string) => void;
  onFail?: () => void;
  visible: boolean;
}

const EmailVerificationForm = ({ onSuccess, onFail, visible }: Props) => {
  const form = React.useRef<VerificationForm>(null);

  const fail = () => {
    if (onFail) {
      onFail();
    }
    if (form.current) {
      form.current.reset();
    }
  };
  const verify = (code: string) => {
    AuthApi.verifyUpdateEmail(code)
      .then(response => onSuccess(response as string))
      .catch(error => fail());
  };

  return (
    <Modal
      animated={true}
      animationType={"slide"}
      presentationStyle={"formSheet"}
      visible={visible}
    >
      <View style={styles.container}>
        <VerificationForm ref={form} onFulfill={verify} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.snow,
    flex: 1,
    ...Layout.alignCentered
  }
});

export default EmailVerificationForm;
