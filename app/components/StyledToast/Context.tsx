import styled from "styled-components/native";
import { space, SpaceProps } from "styled-system";
import * as React from "react";
import { LayoutAnimation, UIManager } from "react-native";
import Box from "./Box";
import Toast, { ToastConfig, ToastInternalConfig } from "./Toast";
import { getStatusBarHeight } from "app/config/metrics";
export const ToastWrapper = styled.View<SpaceProps>`
  ${space};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
`;

type ToastContextType = {
  toast?: (options: ToastConfig) => void;
  position?: "TOP" | "BOTTOM";
  offset?: number;
};

export const ToastContext = React.createContext<Partial<ToastContextType>>({});

export const useToast = () => React.useContext(ToastContext);

const originalOffset = getStatusBarHeight(true) + 16;

UIManager &&
  UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export type FullToastConfig = ToastConfig & ToastInternalConfig;

const ToastProvider: React.FC<ToastContextType> = ({
  children,
  position,
  offset: offsetProp
}) => {
  const [toasts, setToasts] = React.useState<FullToastConfig[]>([]);

  const toast = (newToast: ToastConfig) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setToasts(prevToasts =>
      position === "BOTTOM"
        ? [...prevToasts, { index: prevToasts.length, id: uuid(), ...newToast }]
        : [{ index: prevToasts.length, id: uuid(), ...newToast }, ...prevToasts]
    );
  };

  const hideToast = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setToasts(prevToasts => prevToasts.filter(el => el.id !== id));
  };

  const offset = offsetProp || originalOffset;

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Box
        px={4}
        left={0}
        right={0}
        position="absolute"
        pointerEvents="box-none"
        pt={position === "BOTTOM" ? 0 : offset}
        pb={position === "BOTTOM" ? offset : 0}
        style={position === "BOTTOM" ? { bottom: 0 } : { top: 0 }}
      >
        {toasts.map((config: ToastConfig & ToastInternalConfig) => {
          return (
            <Toast
              position={position}
              key={config.id}
              onClose={id => hideToast(id)}
              {...config}
            />
          );
        })}
      </Box>
    </ToastContext.Provider>
  );
};

export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default ToastProvider;
