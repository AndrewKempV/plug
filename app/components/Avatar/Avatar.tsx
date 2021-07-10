import _ from "lodash";
import React, { PureComponent } from "react";
import {
  Animated,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle
} from "react-native";
import { TouchableDebounce } from "../TouchableDebounce/TouchableDebounce";
import { Colors } from "../../config/styles";

export interface Face {
  id?: number | string;
  source: ImageSourcePropType;
}

interface AvatarProps {
  face: Face;
  circleSize: number;
  imageStyle?: StyleProp<ImageStyle>;
  circleStyle?: StyleProp<ViewStyle>;
  offset?: number;
  onPress?: () => void;
}

class Avatar extends PureComponent<AvatarProps> {
  public render() {
    const { imageStyle, circleSize, face, offset, onPress } = this.props;
    const innerCircleSize = circleSize * 2;
    const marginRight = circleSize * (offset || 0);

    return (
      <Animated.View style={{ marginRight: -marginRight }}>
        <TouchableDebounce onPress={onPress} loading={_.isNil(face.source)}>
          <Image
            style={[
              styles.circleImage,
              {
                width: innerCircleSize,
                height: innerCircleSize,
                borderRadius: circleSize
              },
              imageStyle
            ]}
            source={face.source}
          />
        </TouchableDebounce>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: 10,
    height: 20,
    width: 20
  },
  circleImage: {
    borderColor: Colors.transparent,
    borderWidth: 1
  }
});

export default Avatar;
