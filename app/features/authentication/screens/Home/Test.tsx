import Carousel from "../../../../components/Carousel/SnapCarousel";
import {
  ListRenderItemInfo,
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions
} from "react-native";
import React, { Component } from "react";
import { Colors, Layout } from "../../../../config/styles";
import LayoutDebugger from "../../../../utils/LayoutDebugger";
export class MyCarousel extends Component {
  _renderItem = ({ item, index }: ListRenderItemInfo<string>) => {
    return (
      <View style={styles.cell}>
        <Text>{item}</Text>
      </View>
    );
  };

  render() {
    return (
      <Carousel
        style={styles.container}
        containerCustomStyle={styles.container}
        data={["locust", "liarrust", "jamesdust"]}
        renderItem={this._renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        loop={true}
        loopClonesPerSide={3}
      />
    );
  }
}

const IS_IOS = Platform.OS === "ios";
const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

function wp(percentage: number) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const styles = LayoutDebugger.create({
  container: {
    ...Layout.container,
    backgroundColor: Colors.paleBlue,
    height: slideHeight,
    width: viewportWidth
  },
  cell: {
    backgroundColor: Colors.burgundy,
    height: slideHeight,
    width: itemWidth,
    ...Layout.alignCentered
  }
});
