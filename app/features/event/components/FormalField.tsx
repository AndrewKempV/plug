import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TextInputProps
} from "react-native";
import { FormalNativeFieldProps } from "@kevinwolf/formal-native";

type FieldProps = {
  label: string;
} & FormalNativeFieldProps &
  TextInputProps;

export default function Field({
  label,
  error,
  ...props
}: FieldProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text>{label}</Text>
      <TextInput style={styles.input} {...props} />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16
  },
  input: {
    borderColor: "black",
    borderWidth: 1,
    marginTop: 8,
    padding: 4
  },
  error: {
    color: "red"
  }
});
