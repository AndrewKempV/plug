import React, { Component } from "react";
import { Animated } from "react-native";
import Svg, {
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Rect,
  Stop
} from "react-native-svg";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
// tslint:disable-next-line:no-var-requires
const interpolate = require("d3-interpolate");

export type ContentLoaderProps = Partial<{
  primaryColor: string;
  secondaryColor: string;
  duration: number;
  width: string | number;
  height: string | number;
  viewBox: string;
  x1: string;
  y1: string;
  x2: string;
  y2: string;
}>;

const defaultProps = {
  primaryColor: "#eeeeee",
  secondaryColor: "#dddddd",
  duration: 2000,
  width: 300,
  height: 200,
  x1: "0",
  y1: "0",
  x2: "100%",
  y2: "0"
};

export type ContentLoaderState = Readonly<{
  offsetValues: number[];
  offsets: number[];
  frequency: number;
}>;

class ContentLoader extends Component<ContentLoaderProps, ContentLoaderState> {
  public static defaultProps = defaultProps;
  public animationProgress: Animated.Value = new Animated.Value(0);
  public isRunning: boolean = false;
  constructor(props: ContentLoaderProps) {
    super(props);

    this.state = {
      offsetValues: [-2, -1.5, -1],
      offsets: [
        0.0001,
        0.0002,
        0.0003 // Avoid duplicate value cause error in Android
      ],
      frequency: (props.duration || defaultProps.duration) / 2
    };
    this.loopAnimation = this.loopAnimation.bind(this);
  }

  public clamp01(x: number) {
    if (x > 1) {
      return 1;
    }
    if (x < 0) {
      return 0;
    }
    return x;
  }
  public componentDidMount() {
    this.isRunning = true;
    this.loopAnimation();
  }
  public componentWillUnmount() {
    this.isRunning = false;
    // this.isMounted = false;
  }
  public loopAnimation() {
    // setup interpolate
    const interpolator = interpolate.interpolate(this.state, {
      offsetValues: [1, 1.5, 2]
    });

    // start animation
    const start = Date.now();
    const animation = () => {
      const now = Date.now();
      let t = (now - start) / (this.props.duration || defaultProps.duration);
      if (t > 1) {
        t = 1;
      }

      const newState = interpolator(t);
      const offsetValues: number[] = [];
      offsetValues[0] = this.clamp01(newState.offsetValues[0]);
      offsetValues[1] = this.clamp01(newState.offsetValues[1]);
      offsetValues[2] = this.clamp01(newState.offsetValues[2]);

      // Make sure at least two offsets are different
      if (
        offsetValues[0] !== offsetValues[1] ||
        offsetValues[0] !== offsetValues[2] ||
        offsetValues[1] !== offsetValues[2]
      ) {
        if (this.isRunning) {
          this.setState({ offsets: offsetValues });
        }
      }
      if (t < 1) {
        requestAnimationFrame(animation);
      }
    };
    requestAnimationFrame(animation);

    // Setup loop animation
    Animated.sequence([
      Animated.timing(this.animationProgress, {
        toValue: 1,
        duration: this.state.frequency
      }),
      Animated.timing(this.animationProgress, {
        toValue: 0,
        duration: this.state.frequency
      })
    ]).start(event => {
      if (event.finished) {
        this.loopAnimation();
      }
    });
  }
  public render() {
    const { height, width, viewBox = `0 0 ${width} ${height}` } = this.props;
    return (
      <AnimatedSvg width={width} height={height} viewBox={viewBox}>
        <Defs>
          <LinearGradient
            id="grad"
            x1={this.props.x1}
            y1={this.props.y1}
            x2={this.props.x2}
            y2={this.props.y2}
          >
            <Stop
              offset={this.state.offsets[0]}
              stopColor={this.props.primaryColor}
              stopOpacity="1"
            />
            <Stop
              offset={this.state.offsets[1]}
              stopColor={this.props.secondaryColor}
              stopOpacity="1"
            />
            <Stop
              offset={this.state.offsets[2]}
              stopColor={this.props.primaryColor}
              stopOpacity="1"
            />
          </LinearGradient>
          <ClipPath id="clip">
            <G>{this.props.children}</G>
          </ClipPath>
        </Defs>

        <Rect
          x="0"
          y="0"
          height={height}
          width={width}
          fill="url(#grad)"
          clipPath="url(#clip)"
        />
      </AnimatedSvg>
    );
  }
}

export default ContentLoader;
