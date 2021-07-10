import {
  StyleSheet,
  ImageProps,
  View,
  ViewStyle,
  Animated,
  Easing,
  ActivityIndicator,
  findNodeHandle,
  StyleProp,
  NativeSyntheticEvent,
  ImageErrorEventData,
  ImageLoadEventData,
  FlatList
} from "react-native";
import React, { Component } from "react";
import { measureLayout, LayoutMeasurement } from "../../utils/helpers";

export interface ParallaxImageProps extends ImageProps {
  carouselRef?: FlatList<any>; // passed from <Carousel />
  itemHeight?: number; // passed from <Carousel />
  itemWidth?: number; // passed from <Carousel />
  scrollPosition: Animated.Value; // passed from <Carousel />
  sliderHeight?: number; // passed from <Carousel />
  sliderWidth?: number; // passed from <Carousel />
  vertical?: boolean; // passed from <Carousel />
  containerStyle?: StyleProp<ViewStyle>;
  dimensions?: { height: number; width: number };
  fadeDuration?: number;
  parallaxFactor: number;
  showSpinner?: boolean;
  spinnerColor?: string;
}

type ImageLoadStatus = "Loading" | "Loaded" | "TransitionFinished" | "Error";

interface State {
  offset: number;
  width: number;
  height: number;
  status: ImageLoadStatus;
  animOpacity: Animated.Value;
}

export default class ParallaxImage extends Component<
  ParallaxImageProps,
  State
> {
  public static defaultProps = {
    containerStyle: {},
    fadeDuration: 500,
    parallaxFactor: 0.3,
    showSpinner: true,
    spinnerColor: "rgba(0, 0, 0, 0.4)"
  };

  readonly state: State = {
    offset: 0,
    width: 0,
    height: 0,
    status: "Loading", // 1 -> loading; 2 -> loaded // 3 -> transition finished; 4 -> error
    animOpacity: new Animated.Value(0)
  };

  container: View | null = null;
  mounted: boolean = false;

  setNativeProps(nativeProps: Record<string, any>) {
    if (this.container) {
      this.container.setNativeProps(nativeProps);
    }
  }

  componentDidMount() {
    this.mounted = true;
    setTimeout(() => {
      this.measureLayout();
    }, 0);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  measureLayout = () => {
    if (this.container) {
      const { carouselRef } = this.props;
      if (carouselRef) {
        const containerId = findNodeHandle(this.container)!;
        const carouselId = findNodeHandle(carouselRef)!;
        measureLayout(containerId, carouselId).then(this.onMeasureSuccess);
        // this.container.measureLayout(
        //     findNodeHandle(carouselRef)!,
        //     this.onMeasureSuccess,
        //     () => {return}
        // );
      }
    }
  };

  onLoad = (event: NativeSyntheticEvent<ImageLoadEventData>) => {
    const { animOpacity } = this.state;
    const { fadeDuration, onLoad } = this.props;
    if (!this.mounted) {
      return;
    }
    this.setState({ status: "Loaded" });
    if (onLoad) {
      onLoad(event);
    }

    Animated.timing(animOpacity, {
      toValue: 1,
      duration: fadeDuration,
      easing: Easing.out(Easing.quad),
      isInteraction: false,
      useNativeDriver: true
    }).start(() => {
      this.setState({ status: "TransitionFinished" });
    });
  };

  // If arg is missing from method signature, it just won't be called
  onError = (event: NativeSyntheticEvent<ImageErrorEventData>) => {
    const { onError } = this.props;
    this.setState({ status: "Error" });
    if (onError) {
      onError(event);
    }
  };

  get image() {
    const { status, animOpacity, offset, width, height } = this.state;
    const {
      scrollPosition,
      dimensions,
      vertical,
      sliderWidth,
      sliderHeight,
      parallaxFactor,
      style,
      ...other
    } = this.props;
    const parallaxPadding = (vertical ? height : width) * parallaxFactor;
    const requiredStyles = { position: "relative" };
    const dynamicStyles = {
      width: vertical ? width : width + parallaxPadding * 2,
      height: vertical ? height + parallaxPadding * 2 : height,
      opacity: animOpacity,
      transform: scrollPosition
        ? [
            {
              translateX: !vertical
                ? scrollPosition.interpolate({
                    inputRange: [offset - sliderWidth!, offset + sliderWidth!],
                    outputRange: [-parallaxPadding, parallaxPadding],
                    extrapolate: "clamp"
                  })
                : 0
            },
            {
              translateY: vertical
                ? scrollPosition.interpolate({
                    inputRange: [
                      offset - sliderHeight!,
                      offset + sliderHeight!
                    ],
                    outputRange: [-parallaxPadding, parallaxPadding],
                    extrapolate: "clamp"
                  })
                : 0
            }
          ]
        : []
    };

    return (
      <Animated.Image
        {...other}
        style={[styles.image, style, requiredStyles, dynamicStyles]}
        onLoad={this.onLoad}
        onError={status !== "TransitionFinished" ? this.onError : undefined} // prevent infinite-loop bug
      />
    );
  }

  get spinner() {
    const { status } = this.state;
    const { showSpinner, spinnerColor } = this.props;

    return status === "Loading" && showSpinner ? (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size={"small"}
          color={spinnerColor}
          animating={true}
        />
      </View>
    ) : (
      false
    );
  }

  onMeasureSuccess = ({ left, top, height, width }: LayoutMeasurement) => {
    const {
      vertical,
      sliderHeight,
      sliderWidth,
      itemHeight,
      itemWidth,
      dimensions
    } = this.props;
    const offset = vertical
      ? top - (sliderHeight! - itemHeight!) / 2
      : left - (sliderWidth! - itemWidth!) / 2;

    if (this.mounted) {
      this.setState({
        offset: offset,
        width:
          dimensions && dimensions.width ? dimensions.width : Math.ceil(width),
        height:
          dimensions && dimensions.height
            ? dimensions.height
            : Math.ceil(height)
      });
    }
  };

  render() {
    const { containerStyle } = this.props;

    return (
      <View
        ref={c => {
          this.container = c;
        }}
        pointerEvents={"none"}
        style={[containerStyle, styles.container]}
        onLayout={this.measureLayout}
      >
        {this.image}
        {this.spinner}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  image: {
    height: undefined,
    position: "relative",
    resizeMode: "cover",
    width: undefined
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center"
  }
});
