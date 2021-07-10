import { Animated, Easing, Platform } from "react-native";
import { NavigationSceneRendererProps } from "react-navigation";

/**
 * Constructs a quadratic easing animation according to @param config.
 *
 * @param value
 * @param config
 */
export const ease = (
  value: Animated.Value,
  config: Animated.TimingAnimationConfig
) => {
  return Animated.timing(value, {
    ...config,
    useNativeDriver: true,
    easing: Easing.inOut(Easing.quad)
  });
};

/**
 * Interpolate a scale or y-axis animated value according to @param config.
 *
 * @param field A string which selects the interpolation variant.
 * @param value
 * @param config
 */
export const interpolate = (
  field: "scale" | "translateY",
  value: Animated.Value,
  config: Animated.InterpolationConfigType
) => {
  return {
    [field]: value.interpolate({
      inputRange: [0, 1],
      ...config
    })
  };
};
/**
 * Interpolate the scale value.
 *
 * @param value
 * @param config
 */
export const interpolateScale = (
  value: Animated.Value,
  config: Animated.InterpolationConfigType
) => {
  return interpolate("scale", value, config);
};
/**
 * Interpolate along the y-axis.
 *
 * @param value
 * @param config
 */
export const interpolateTranslateY = (
  value: Animated.Value,
  config: Animated.InterpolationConfigType
) => {
  return interpolate("translateY", value, config);
};

/**
 * Processes looped animation using the native driver.
 * This is necessary because Animated.sequence cannot handle looped animations that use the native driver.
 *
 * @param createAnimations
 * @param onStepStart
 */
export const loopAnimations = (
  createAnimations: () => Animated.CompositeAnimation[],
  onStepStart: (stepIndex: number) => void
) => {
  let animations = createAnimations();
  let currentAnimationIndex = 0;
  const animateStep = () => {
    animations[currentAnimationIndex].start(({ finished }) => {
      if (!finished) {
        return;
      }
      currentAnimationIndex++;
      if (currentAnimationIndex >= animations.length) {
        currentAnimationIndex = 0;
        animations = createAnimations();
      }
      onStepStart(currentAnimationIndex);
      animateStep();
    });
  };
  onStepStart(currentAnimationIndex);
  animateStep();
  const stopLoop = () => {
    animations.forEach(animation => animation.stop());
  };
  return stopLoop;
};

export const SlideFromRight = (
  index: number,
  position: Animated.Value,
  width: number
) => {
  const inputRange = [index - 1, index, index + 1];
  const outputRange = [width, 0, 0];
  const translateX = position.interpolate({ inputRange, outputRange });
  const slideFromRight = { transform: [{ translateX }] };
  return slideFromRight;
};

export const CollapseExpand = (
  index: number,
  position: Animated.AnimatedValue
) => {
  const inputRange = [index - 1, index, index + 1];
  const outputRange = [0, 1, 1];
  const opacity = position.interpolate({ inputRange, outputRange });
  const scaleY = position.interpolate({ inputRange, outputRange });
  return {
    opacity,
    transform: [{ scaleY }]
  };
};

export function fromLeft(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({
      layout,
      position,
      scene
    }: NavigationSceneRendererProps) => {
      const { index } = scene;
      const { initWidth } = layout;

      const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [-initWidth, 0, 0]
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      });

      return { opacity, transform: [{ translateX }] };
    }
  };
}

export function fromTop(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({
      layout,
      position,
      scene
    }: NavigationSceneRendererProps) => {
      const { index } = scene;
      const { initHeight } = layout;

      const translateY = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [-initHeight, 0, 0]
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      });

      return { opacity, transform: [{ translateY }] };
    }
  };
}

export function fromRight(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({
      layout,
      position,
      scene
    }: NavigationSceneRendererProps) => {
      const { index } = scene;
      const { initWidth } = layout;

      const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [initWidth, 0, 0]
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      });

      return { opacity, transform: [{ translateX }] };
    }
  };
}

export function fromBottom(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({
      layout,
      position,
      scene
    }: NavigationSceneRendererProps) => {
      const { index } = scene;
      const { initHeight } = layout;

      const translateY = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [initHeight, 0, 0]
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      });

      return { opacity, transform: [{ translateY }] };
    }
  };
}

export function fadeIn(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ position, scene }: NavigationSceneRendererProps) => {
      const { index } = scene;

      const opacity = position.interpolate({
        inputRange: [index - 1, index, index + 0.999, index + 1],
        outputRange: [0, 1, 1, 0]
        // inputRange: [index - 1, index],
        // outputRange: [0, 1],
      });

      return { opacity };
    }
  };
}

export function zoomIn(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ position, scene }: NavigationSceneRendererProps) => {
      const { index } = scene;
      let start = 0;

      if (Platform.OS !== "ios") {
        start = 0.005;
      }

      const scale = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [start, 1]
      });

      return { transform: [{ scale }] };
    }
  };
}

export function zoomOut(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ position, scene }: NavigationSceneRendererProps) => {
      const { index } = scene;

      const scale = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [10, 1]
      });

      return { transform: [{ scale }] };
    }
  };
}

export function flipY(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ position, scene }: NavigationSceneRendererProps) => {
      const { index } = scene;

      const rotateY = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: ["180deg", "0deg"]
      });

      return { transform: [{ rotateY }], backfaceVisibility: "hidden" };
    }
  };
}

export function flipX(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ position, scene }: NavigationSceneRendererProps) => {
      const { index } = scene;

      const rotateX = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: ["180deg", "0deg"]
      });

      return { transform: [{ rotateX }], backfaceVisibility: "hidden" };
    }
  };
}

export const crossFade = () => ({
  transitionSpec: {
    duration: 100,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing
  },
  screenInterpolator: ({ position, scene }: NavigationSceneRendererProps) => {
    const { index } = scene;
    const translateX = 0;
    const translateY = 0;

    const opacity = position.interpolate({
      inputRange: [index - 0.5, index],
      outputRange: [0.5, 1],
      extrapolate: "clamp"
    });

    return { opacity, transform: [{ translateY }] };
  }
});

export const TransitionConfiguration = () => {
  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: (sceneProps: NavigationSceneRendererProps) => {
      const {
        layout,
        position,
        scene
      }: NavigationSceneRendererProps = sceneProps;
      const width = layout.initWidth;
      const { index, route } = scene;
      const params = route.params || {}; // <- That's new
      const transition = params.transition || "default"; // <- That's new
      const result = {
        collapseExpand: CollapseExpand(index, position),
        default: SlideFromRight(index, position, width)
      };
      return transition !== "default" ? result.collapseExpand : result.default;
    }
  };
};
