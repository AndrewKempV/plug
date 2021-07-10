import * as React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Colors } from "../../config/styles";

interface Props {
  placeholder: string;
}

interface State {
  text: string;
  hideText: boolean;
}

const iniitialState: State = {
  text: "",
  hideText: true
};

export default class PasswordTextInput extends React.PureComponent<
  Props,
  State
> {
  public readonly state = iniitialState;

  public onPress = () =>
    this.setState(state => {
      return { hideText: !state.hideText };
    });

  public onChangeText = (text: string) => this.setState({ text });

  public onShownText = (): { color: string } => {
    if (!this.state.hideText) {
      return { color: Colors.burgundy };
    }
    return { color: Colors.black };
  };

  public render(): JSX.Element {
    return (
      <View style={[styles.container]}>
        <TextInput
          autoCorrect={false}
          keyboardType="default"
          returnKeyType="go"
          value={this.state.text.toUpperCase()}
          secureTextEntry={this.state.hideText}
          style={styles.input}
          placeholder={this.props.placeholder}
          numberOfLines={1}
          onChangeText={this.onChangeText}
        />
        <TouchableOpacity style={styles.button} onPress={this.onPress}>
          <Text style={this.onShownText()}>
            {this.state.hideText ? "Show" : "Hide"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: { alignItems: "center", flex: 2, justifyContent: "center" },
  container: {
    backgroundColor: Colors.whiteTwo,
    borderRadius: 2,
    borderWidth: 1,
    flexDirection: "row",
    height: 40,
    margin: 16,
    paddingLeft: 10
  },
  input: { flex: 8 }
});
