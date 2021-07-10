import React, { PureComponent } from "react";
import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import { scale } from "react-native-size-matters/extend";
import { Layout } from "../../config/styles";
import { ValueOrDefault } from "../../utils/helpers";
import Avatar from "../Avatar";
import { Face } from "../Avatar/Avatar";

interface RenderParams {
  faces: Face[];
  numFaces: number;
}

interface AvatarCollectionProps {
  faces: Face[];
  circleSize: number;
  hideOverflow?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  circleStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  overflowStyle?: StyleProp<ViewStyle>;
  overflowLabelStyle?: StyleProp<TextStyle>;
  render?: (params: RenderParams) => JSX.Element;
  numFaces?: number;
  offset: number;
}

export function renderFacePile(faces: Face[] = [], numFaces: number) {
  const entities = [...faces.reverse()];
  if (!entities.length) {
    return { facesToRender: [], overflow: 0 };
  }

  const facesWithImageUrls = entities.filter(e => e.source);
  if (!facesWithImageUrls.length) {
    return { facesToRender: [], overflow: 0 };
  }

  const facesToRender = facesWithImageUrls.slice(0, numFaces);
  const overflow = entities.length - facesToRender.length;

  return {
    facesToRender,
    overflow
  };
}

class AvatarCollection extends PureComponent<AvatarCollectionProps> {
  public static defaultProps: Partial<AvatarCollectionProps> = {
    circleSize: 20,
    numFaces: 4,
    offset: 1,
    hideOverflow: false
  };

  public render() {
    const {
      render,
      faces,
      numFaces,
      hideOverflow,
      containerStyle
    } = this.props;
    if (render) {
      const size = ValueOrDefault(numFaces, faces.length);
      return render({ faces, numFaces: size });
    }

    const { facesToRender, overflow } = renderFacePile(
      faces,
      ValueOrDefault(numFaces, faces.length)
    );

    return (
      <View style={[styles.container, containerStyle]}>
        {overflow > 0 && !hideOverflow && this.renderOverflowCircle(overflow)}
        {Array.isArray(facesToRender) && facesToRender.map(this.renderFace)}
      </View>
    );
  }
  private renderOverflowCircle = (overflow: number) => {
    const {
      circleStyle,
      overflowStyle,
      overflowLabelStyle,
      circleSize,
      offset
    } = this.props;

    const innerCircleSize = circleSize * 1.8;
    const marginLeft = circleSize * offset - circleSize / 1.6;

    return (
      <View style={[styles.circle, circleStyle]}>
        <View
          style={[
            styles.overflow,
            {
              width: innerCircleSize,
              height: innerCircleSize,
              borderRadius: circleSize,
              marginLeft
            },
            overflowStyle
          ]}
        >
          <Text
            style={[
              styles.overflowLabel,
              {
                fontSize: circleSize * 0.7
              },
              overflowLabelStyle
            ]}
          >
            +{overflow}
          </Text>
        </View>
      </View>
    );
  };

  private renderFace = (face: Face, index: number) => {
    const { circleStyle, imageStyle, circleSize, offset } = this.props;
    if (face && !face.source) {
      return null;
    }

    return (
      <Avatar
        key={face.id || index}
        face={face}
        circleStyle={circleStyle}
        imageStyle={imageStyle}
        circleSize={circleSize}
        offset={offset}
      />
    );
  };
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: 10,
    height: 20,
    width: 20
  },
  container: {
    ...Layout.alignCentered,
    alignSelf: "center",
    flexDirection: "row-reverse",
    flexWrap: "nowrap"
  },
  overflow: {
    alignItems: "center",
    backgroundColor: "#b6c0ca",
    justifyContent: "center",
    marginLeft: scale(18)
  },
  overflowLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: -1,
    marginLeft: scale(3)
  }
});

export default AvatarCollection;
