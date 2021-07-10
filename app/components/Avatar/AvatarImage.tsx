import * as React from "react";
import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text as NativeText,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import { Colors, Layout } from "../../config/styles";

export interface ImageProps {
  source: ImageSourcePropType;
  size: number;
  style?: StyleProp<ImageStyle>;
}

// tslint:disable-next-line:max-classes-per-file
export default class Image extends React.Component<ImageProps> {
  public static displayName = "Avatar.Image";

  public static defaultProps = {
    size: 64
  };

  public render() {
    const { size, source, style } = this.props;
    // const { colors } = theme;
    return (
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: Colors.snow
          },
          style
        ]}
      >
        <Image
          source={source}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      </View>
    );
  }
}
