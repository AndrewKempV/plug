/* @flow */
import React, { Component, createRef, RefObject, ReactElement } from "react";
import {
  View,
  Animated,
  Dimensions,
  FlatList,
  PanResponder,
  StyleSheet,
  PanResponderInstance,
  ListRenderItemInfo,
  GestureResponderEvent
} from "react-native";

import {
  GestureEvent,
  CarouselProps,
  CarouselGestureState as GestureState
} from "./types";
import LayoutDebugger from "../../utils/LayoutDebugger";
import { Divider } from "react-native-elements";
import { Colors } from "../../config/styles";

const { width: screenWidth } = Dimensions.get("window");
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

interface State {
  animatedValue: Animated.Value;
  currentIndex: number;
  itemWidthAnim: Animated.Value;
  scrollPosAnim: Animated.Value;
}

export default class HorizontalCarousel<T> extends Component<
  CarouselProps<T>,
  State
> {
  panResponder: PanResponderInstance;
  list: FlatList<T> | null = null;

  public static defaultProps = {
    contentOffset: 0,
    data: [],
    extractKey: (item: any, index: number) =>
      `sideswipe-carousel-item-${index}`,
    itemWidth: screenWidth,
    onEndReached: () => {},
    onEndReachedThreshold: 0.9,
    onGestureStart: () => {},
    onGestureRelease: () => {},
    onIndexChange: () => {},
    renderItem: () => null,
    shouldCapture: ({ dx }: GestureState) => dx * dx > 1,
    shouldRelease: () => false,
    threshold: 0,
    useVelocityForIndex: true,
    useNativeDriver: true
  };

  constructor(props: CarouselProps<T>) {
    super(props);

    const currentIndex: number = props.index || 0;
    const initialOffset: number =
      currentIndex * (props.itemWidth ? props.itemWidth : 0);
    const scrollPosAnim: Animated.Value = new Animated.Value(initialOffset);
    const itemWidthAnim: Animated.Value = new Animated.Value(props.itemWidth!);
    const animatedValue: Animated.Value = Animated.divide(
      scrollPosAnim,
      itemWidthAnim
    ) as Animated.Value;

    this.state = {
      animatedValue,
      currentIndex,
      itemWidthAnim,
      scrollPosAnim
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: this.handleGestureCapture,
      onPanResponderGrant: this.handleGestureStart,
      onPanResponderMove: this.handleGestureMove,
      onPanResponderRelease: this.handleGestureRelease,
      onPanResponderTerminationRequest: this.handleGestureTerminationRequest
    });
  }

  componentDidUpdate = (prevProps: CarouselProps<T>) => {
    const { contentOffset, index, itemWidth } = this.props;
    if (prevProps.itemWidth !== itemWidth) {
      this.state.itemWidthAnim.setValue(itemWidth!);
    }

    if (index && Number.isInteger(index!) && index !== prevProps.index) {
      this.setState(
        () => ({ currentIndex: index }),
        () => {
          setTimeout(() => {
            if (this.list) {
              this.list.scrollToIndex({
                animated: true,
                index: this.state.currentIndex,
                viewOffset: contentOffset
              });
            }
          });
        }
      );
    }
  };

  render = () => {
    const {
      contentContainerStyle,
      contentOffset,
      data,
      extractKey,
      flatListStyle,
      renderItem,
      style
    } = this.props;
    const { animatedValue, currentIndex } = this.state;
    const dataLength = data.length;

    return (
      <View
        style={[{ width: screenWidth }, style]}
        {...this.panResponder.panHandlers}
      >
        <FlatList
          horizontal={true}
          contentContainerStyle={[
            { paddingHorizontal: contentOffset },
            contentContainerStyle
          ]}
          data={data}
          getItemLayout={this.getItemLayout}
          keyExtractor={extractKey}
          initialScrollIndex={currentIndex}
          ref={(ref: FlatList<T>) => (this.list = ref)}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={[styles.flatList, flatListStyle]}
          onEndReached={this.props.onEndReached}
          onEndReachedThreshold={this.props.onEndReachedThreshold}
          scrollEventThrottle={1}
          onScroll={() => this.handleScroll(this.state.scrollPosAnim)}
          renderItem={({ item, index }: ListRenderItemInfo<T>) =>
            renderItem({
              item,
              currentIndex,
              itemIndex: index,
              itemCount: dataLength,
              animatedValue: animatedValue
            }) as ReactElement<any>
          }
          ItemSeparatorComponent={() => (
            <Divider style={{ width: 24, borderColor: Colors.transparent }} />
          )}
        />
      </View>
    );
  };

  getItemLayout = (data: T[] | null, index: number) => ({
    offset:
      (this.props.itemWidth || HorizontalCarousel.defaultProps.itemWidth) *
        index +
      (this.props.contentOffset ||
        HorizontalCarousel.defaultProps.contentOffset),
    length: this.props.itemWidth || HorizontalCarousel.defaultProps.itemWidth,
    index
  });

  handleGestureTerminationRequest = (
    e: GestureEvent,
    s: GestureState
  ): boolean => {
    if (this.props.shouldRelease) {
      return this.props.shouldRelease(s);
    }
    return false;
  };
  handleGestureCapture = (e: GestureEvent, s: GestureState): boolean => {
    if (this.props.shouldCapture) {
      return this.props.shouldCapture(s);
    }
    return false;
  };

  handleGestureStart = (e: GestureEvent, s: GestureState) => {
    if (this.props.onGestureStart) {
      this.props.onGestureStart(s);
    }
  };

  handleGestureMove = (e: GestureEvent, { dx }: GestureState) => {
    const currentOffset: number =
      this.state.currentIndex * this.props.itemWidth!;
    const resolvedOffset: number = currentOffset - dx;

    if (this.list !== null) {
      this.list.scrollToOffset({
        offset: resolvedOffset,
        animated: false
      });
    }
  };

  handleGestureRelease = (e: GestureEvent, { dx, vx }: GestureState) => {
    const currentOffset: number =
      this.state.currentIndex * this.props.itemWidth!;
    const resolvedOffset: number = currentOffset - dx;
    const resolvedIndex: number = Math.round(
      (resolvedOffset +
        (dx > 0 ? -this.props.threshold! : this.props.threshold!)) /
        this.props.itemWidth!
    );

    let newIndex: number;
    if (this.props.useVelocityForIndex) {
      const absoluteVelocity: number = Math.round(Math.abs(vx));
      const velocityDifference: number =
        absoluteVelocity < 1 ? 0 : absoluteVelocity - 1;

      newIndex =
        dx > 0
          ? Math.max(resolvedIndex - velocityDifference, 0)
          : Math.min(
              resolvedIndex + velocityDifference,
              this.props.data.length - 1
            );
    } else {
      newIndex =
        dx > 0
          ? Math.max(resolvedIndex, 0)
          : Math.min(resolvedIndex, this.props.data.length - 1);
    }

    if (this.list) {
      this.list.scrollToIndex({
        index: newIndex,
        animated: true,
        viewOffset: this.props.contentOffset
      });
    }

    this.setState(
      () => ({ currentIndex: newIndex }),
      () => {
        this.props.onIndexChange!(newIndex);
        //this.props.onGestureRelease();
      }
    );
  };

  handleScroll = (scrollPosAnim: Animated.Value) => {
    return Animated.event(
      [{ nativeEvent: { contentOffset: { x: scrollPosAnim } } }],
      { useNativeDriver: this.props.useNativeDriver }
    );
  };
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    flexGrow: 1
  }
});
