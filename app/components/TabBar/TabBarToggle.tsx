import React, { Component } from "react";
import {
  Animated,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  View,
  ViewStyle
} from "react-native";
import { NavigationScreenProps } from "react-navigation";
import { Colors } from "../../config/styles";
import { timeout } from "../../utils/helpers";
import NavigationService from "app/utils/NavigationService";

const DEFAULT_TOGGLE_SIZE = 80;
const DEFAULT_ACTION_SIZE = 40;
const DEFAULT_TOGGLE_ANIMATION_DURATION = 300;
const DEFAULT_ACTION_STAGING_DURATION = 100;
const DEFAULT_ACTION_ANIMATION_DURATION = 200;
const DEFAULT_NAVIGATION_DELAY = 500;
const DEFAULT_EXPANDING_ANGLE = 135;

interface Route {
  routeName: string;
  color: string;
  icon: React.ReactNode;
  onPress?: () => void;
}

interface TabBarToggleProps {
  routes: Route[];
  actionSize: number;
  actionVibration: boolean;
  actionExpandingAngle: number;
  toggleVibration: boolean;
  toggleColor: string;
  toggleSize: number;
  toggleAnimationDuration: number;
  actionAnimationDuration: number;
  actionStagingDuration: number;
  navigationDelay: number;
  icon: React.ReactNode;
  animateIcon: boolean;
}

const defaultProps: Partial<TabBarToggleProps> = {
  routes: [],
  actionSize: DEFAULT_ACTION_SIZE,
  actionExpandingAngle: DEFAULT_EXPANDING_ANGLE,
  toggleColor: Colors.burgundy,
  toggleSize: DEFAULT_TOGGLE_SIZE,
  navigationDelay: DEFAULT_NAVIGATION_DELAY,
  toggleAnimationDuration: DEFAULT_TOGGLE_ANIMATION_DURATION,
  actionAnimationDuration: DEFAULT_ACTION_ANIMATION_DURATION,
  actionStagingDuration: DEFAULT_ACTION_STAGING_DURATION,
  animateIcon: true
};

interface State {
  measured: boolean;
  active: boolean;
}

const initialState = {
  measured: false,
  active: false
};

class TabBarToggle extends Component<
  TabBarToggleProps & NavigationScreenProps,
  State
> {
  public static defaultProps: Partial<TabBarToggleProps> = defaultProps;
  public activation = new Animated.Value(0);
  public activationActions: Animated.Value[] = [];
  public readonly state = initialState;

  public actionPressed = (route: Route) => {
    this.togglePressed();
    const { actionVibration, navigationDelay } = this.props;
    if (actionVibration) {
      Vibration.vibrate(0, false);
    }

    if (route.routeName) {
      timeout(
        () => NavigationService.navigate(route.routeName),
        navigationDelay
      );
    }
    if (route.onPress) {
      route.onPress();
    }
  };

  public togglePressed = () => {
    const {
      routes,
      toggleVibration,
      toggleAnimationDuration,
      actionAnimationDuration,
      actionStagingDuration,
      animateIcon
    } = this.props;

    if (this.state.active) {
      this.setState({ active: false });

      if (animateIcon) {
        Animated.parallel([
          animateIcon &&
            Animated.timing(this.activation, {
              toValue: 0,
              duration: toggleAnimationDuration
            }),
          Animated.stagger(
            actionStagingDuration,
            routes.map((v, i) =>
              Animated.timing(this.activationActions[routes.length - 1 - i], {
                toValue: 0,
                duration: actionAnimationDuration
              })
            )
          )
        ]).start();
      } else {
        Animated.stagger(
          actionStagingDuration,
          routes.map((v, i) =>
            Animated.timing(this.activationActions[routes.length - 1 - i], {
              toValue: 0,
              duration: actionAnimationDuration
            })
          )
        ).start();
      }
    } else {
      this.setState({ active: true });
      if (animateIcon) {
        Animated.parallel([
          animateIcon &&
            Animated.timing(this.activation, {
              toValue: 1,
              duration: toggleAnimationDuration
            }),
          Animated.stagger(
            actionStagingDuration,
            routes.map((v, i) =>
              Animated.timing(this.activationActions[i], {
                toValue: 1,
                duration: actionAnimationDuration
              })
            )
          )
        ]).start();
      } else {
        Animated.stagger(
          actionStagingDuration,
          routes.map((v, i) =>
            Animated.timing(this.activationActions[i], {
              toValue: 1,
              duration: actionAnimationDuration
            })
          )
        ).start();
      }
    }
    if (toggleVibration) {
      Vibration.vibrate(0, false);
    }
  };

  public renderActions = () => {
    const { routes, actionSize, actionExpandingAngle } = this.props;

    const STEP = actionExpandingAngle / routes.length;

    return routes.map((route, i) => {
      const offset = (STEP * (i + 1)) / DEFAULT_EXPANDING_ANGLE - 0.5;
      const angle = -90 + DEFAULT_EXPANDING_ANGLE * offset - STEP / 2;
      const radius = 80;

      const x = radius * Math.cos((-angle * Math.PI) / 180);
      const y = radius * Math.sin((-angle * Math.PI) / 180);

      const activationScale = this.activationActions[i].interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1]
      });

      const activationPositionX = this.activationActions[i].interpolate({
        inputRange: [0, 1],
        outputRange: [0, x]
      });

      const activationPositionY = this.activationActions[i].interpolate({
        inputRange: [0, 1],
        outputRange: [0, y]
      });

      const AnimatedTouchable = Animated.createAnimatedComponent(
        TouchableOpacity
      );

      return (
        <Animated.View
          key={`action_${i}`}
          style={[
            styles.actionContainer,
            {
              marginLeft: -actionSize / 2,
              left: activationPositionX,
              bottom: activationPositionY,
              transform: [{ scale: activationScale }]
            }
          ]}
        >
          <AnimatedTouchable
            style={[
              styles.actionContent,
              {
                width: actionSize,
                height: actionSize,
                borderRadius: actionSize / 2,
                backgroundColor: route.color
              }
            ]}
            onPress={() => this.actionPressed(route)}
          >
            {route.icon}
          </AnimatedTouchable>
        </Animated.View>
      );
    });
  };

  /**
   * Create animation values for each action.
   */
  public makeActivations = (routes: Route[]) => {
    routes.forEach(
      (v, i) => (this.activationActions[i] = new Animated.Value(0))
    );
    this.setState({ measured: true });
  };

  public componentWillReceiveProps(nextProps: TabBarToggleProps) {
    if (nextProps.routes !== this.props.routes) {
      this.makeActivations(nextProps.routes);
    }
  }

  public componentDidMount() {
    this.makeActivations(this.props.routes);
  }

  public render() {
    const { icon, toggleColor, toggleSize } = this.props;

    // const activationRotate = this.activation.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: ["0deg", "135deg"]
    // });

    const activationScale = this.activation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.25, 1]
    });

    const AnimatedTouchable = Animated.createAnimatedComponent(
      TouchableOpacity
    );

    return (
      <View pointerEvents="box-none" style={styles.container}>
        {/* {this.state.measured && (
          <View style={styles.actionsWrapper}>{this.renderActions()}</View>
        )} */}
        <AnimatedTouchable onPress={this.togglePressed} activeOpacity={1}>
          <Animated.View
            style={[
              styles.toggleButton,
              {
                transform: [
                  // { rotate: activationRotate },
                  { scale: activationScale }
                ],
                width: toggleSize,
                height: toggleSize,
                borderRadius: toggleSize / 2,
                backgroundColor: toggleColor
              }
            ]}
          >
            {icon}
          </Animated.View>
        </AnimatedTouchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actionContainer: {
    position: "absolute"
  },
  actionContent: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  actionsWrapper: {
    bottom: 0,
    position: "absolute"
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end"
  },
  toggleButton: {
    alignItems: "center",
    justifyContent: "center",
    left: 0,
    top: 0
  },
  toggleIcon: {
    color: "white",
    fontSize: 20
  }
});

export { TabBarToggle };
