import React, { Component, PureComponent } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Fonts from "../../config/Fonts";
import Metrics from "../../config/metrics";
import { Colors, Layout } from "../../config/styles";
import { Surface } from "../Typings/Surface";

interface EmptyEventPlaceholderProps {
  title: string;
  content: string;
  containerStyle?: StyleProp<ViewStyle>;
}

class EmptyEventPlaceholder extends PureComponent<EmptyEventPlaceholderProps> {
  public render() {
    const { title, content, containerStyle } = this.props;
    return (
      <Surface style={[styles.container, containerStyle]}>
        <View style={styles.iconContainer}>
          <SimpleLineIcons
            name={"calendar"}
            size={Metrics.icons.xsmall}
            color={Colors.charcoalGrey}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.content}>{content}</Text>
        </View>
      </Surface>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Layout.horizontalLeftAlign,
    height: 50,
    marginTop: Metrics.margin,
    maxHeight: 100,
    width: Metrics.DEVICE_WIDTH
  },
  content: {
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 13,
    fontStyle: "normal",
    fontWeight: "normal",
    textAlign: "left"
  },
  contentContainer: {
    ...Layout.verticalLeftAlign,
    paddingHorizontal: Metrics.margin,
    paddingTop: Metrics.margin + 5
  },
  iconContainer: {
    ...Layout.alignCentered,
    borderColor: Colors.blueGrey,
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    marginTop: Metrics.margin + 5,
    width: 36
  },
  title: {
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "bold",
    textAlign: "left"
  }
});

export default EmptyEventPlaceholder;
