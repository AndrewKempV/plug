import deepMerge from "deepmerge";
import React from "react";

import { LayoutProvider } from "app/components/Layout/LayoutProvider";
import { DeepPartial } from "../utils/types";

import { defaultTheme } from "./defaultTheme";
import { Theme } from "./Theme";

export const ThemeContext = React.createContext<Theme>(defaultTheme);

export const ThemeConsumer = ThemeContext.Consumer;

export interface ThemeProviderProps {
  children?: React.ReactNode;
  theme?: DeepPartial<Theme>;
}

export const ThemeProvider = (props: ThemeProviderProps) => {
  const { children, theme } = props;
  const value = theme
    ? (deepMerge(defaultTheme, theme) as Theme)
    : defaultTheme;

  return (
    <ThemeContext.Provider value={value}>
      <LayoutProvider>{children}</LayoutProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return React.useContext(ThemeContext);
};
