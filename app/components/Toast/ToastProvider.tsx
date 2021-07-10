import React, { useState } from "react";
import { View } from "react-native";
import { timing } from "react-native-redash";
import Animated, { Easing } from "react-native-reanimated";
const { interpolate, useCode, Clock, set } = Animated;
import { Toast, ToastId, ToastInstance, ToastSettings } from ".";

export interface ToastContextValue {
  danger: (toastSettings: ToastSettings) => ToastInstance;
  notify: (toastSettings: ToastSettings) => ToastInstance;
  success: (toastSettings: ToastSettings) => ToastInstance;
  warning: (toastSettings: ToastSettings) => ToastInstance;
  removeToast: (id: ToastId) => void;
}

const defaultToastInstance: ToastInstance = {
  id: "1",
  onRemove: () => null
};

const defaultToastContext: ToastContextValue = {
  danger: () => defaultToastInstance,
  notify: () => defaultToastInstance,
  removeToast: id => {
    return;
  },
  success: () => defaultToastInstance,
  warning: () => defaultToastInstance
};

export const ToastContext = React.createContext(defaultToastContext);

export const useToast = () => {
  return React.useContext(ToastContext);
};

// const AnimatedView = Animated.View;

export type ToastPosition = "top" | "bottom";

const hasCustomId = (toastSettings: ToastSettings) => !!toastSettings.id;

interface ToastProviderState {
  toasts: ToastInstance[];
}

const initialState: ToastProviderState = {
  toasts: []
};

enum ActionType {
  ADD_TOAST = "ADD_TOAST",
  REMOVE_TOAST = "REMOVE_TOAST"
}

type Action =
  | { type: ActionType.ADD_TOAST; payload: { toast: ToastInstance } }
  | { type: ActionType.REMOVE_TOAST; payload: { id: ToastId } };

const reducer = (state: ToastProviderState, action: Action) => {
  switch (action.type) {
    case ActionType.ADD_TOAST:
      return { toasts: [...state.toasts, action.payload.toast] };
    case ActionType.REMOVE_TOAST:
      return {
        toasts: state.toasts.filter(toast => toast.id !== action.payload.id)
      };
    default:
      throw new Error();
  }
};

const getTransitionConfig = (offset: number, position: ToastPosition) => {
  if (position === "top") {
    return {
      enter: { translateY: offset },
      from: { translateY: -500 },
      leave: { translateY: -500 }
    };
  }

  return {
    enter: { translateY: -offset },
    from: { translateY: 500 },
    leave: { translateY: 500 }
  };
};

const OFFSET = 500;
const POSITION = "top";

export interface ToastProviderProps {
  children?: React.ReactNode;
}

export const ToastProvider = (props: ToastProviderProps) => {
  const { children } = props;
  const idCounterRef = React.useRef(0);
  // Use reducer because we want access previous value of state
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const createToastInstance = (toastSettings: ToastSettings): ToastInstance => {
    const uniqueId = ++idCounterRef.current;
    const id = hasCustomId(toastSettings)
      ? `${toastSettings.id}-${uniqueId}`
      : `${uniqueId}`;

    return {
      id,
      onRemove: () =>
        dispatch({ type: ActionType.REMOVE_TOAST, payload: { id } }),
      ...toastSettings
    };
  };

  const notify = React.useCallback(
    (toastSettings: ToastSettings) => {
      const toastInstance = createToastInstance(toastSettings);

      // If there's a custom toast ID passed, close existing toasts with the same custom ID
      if (hasCustomId(toastSettings)) {
        for (const toast of state.toasts) {
          // Since unique ID is still appended to a custom ID, skip the unique ID and check only prefix
          if (String(toast.id).startsWith(String(toastSettings.id))) {
            dispatch({
              payload: { id: toast.id },
              type: ActionType.REMOVE_TOAST
            });
          }
        }
      }

      dispatch({
        type: ActionType.ADD_TOAST,
        payload: { toast: toastInstance }
      });

      return toastInstance;
    },
    [state.toasts]
  );

  const [expanded, expand] = useState(false);
  const animation = new Animated.Value(expanded ? 1 : 0);
  const clock = new Clock();
  useCode(
    () =>
      set(
        animation,
        timing({
          clock,
          to: expanded ? 0 : 1,
          duration: 4000,
          easing: Easing.in(Easing.ease)
        })
      ),
    [animation]
  );
  // const height = bInterpolate(animation, 0, 1);
  const translateY = interpolate(animation, {
    inputRange: [0, 1],
    outputRange: [0, 200],
    extrapolate: Animated.Extrapolate.CLAMP
  });

  // const transitionConfig = getTransitionConfig(OFFSET, POSITION);
  // const driver = timing({
  //   duration: 3000,
  //   from: 500,
  //   to: 812,
  //   easing: Easing.exp
  // });

  //   const s = transitionConfig.enter.translateY;
  //   const spring = withSpring({
  //     snapPoints: [
  //       transitionConfig.from.translateY,
  //       transitionConfig.leave.translateY
  //     ],
  //     value: new Animated.Value(100),
  //     velocity: new Animated.Value(20),
  //     state: s
  //   });
  //   const transitions = useTransition(state.toasts, toast => toast.id);
  //   const transition = useTransition(
  //     open,
  //     not(bin(open)),
  //     bin(open),
  //     3000,
  //     Easing.inOut(Easing.ease)
  //   );

  return (
    <ToastContext.Provider
      value={{
        danger: (toastSettings: ToastSettings) =>
          notify({ ...toastSettings, intent: "danger" }),
        notify: (toastSettings: ToastSettings) => notify({ ...toastSettings }),
        success: (toastSettings: ToastSettings) =>
          notify({ ...toastSettings, intent: "success" }),
        warning: (toastSettings: ToastSettings) =>
          notify({ ...toastSettings, intent: "warning" }),

        removeToast: (id: ToastId) =>
          dispatch({ type: ActionType.REMOVE_TOAST, payload: { id } })
      }}
    >
      {children}
      <View
        style={{
          left: 32,
          marginBottom: 0,
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 0,
          maxWidth: 560,
          position: "absolute",
          right: 32,
          top: 0,
          zIndex: 100
        }}
      >
        {state.toasts.map(toast => (
          <Animated.View
            key={`${toast.id}-container`}
            // @ts-ignore
            style={{
              position: "absolute",
              width: "100%",
              transform: [{ translateY }]
            }}
          >
            <Toast {...toast} />
          </Animated.View>
        ))}
      </View>
    </ToastContext.Provider>
  );
};
