import React, { Component } from "react";
import Orientation from "react-native-orientation";
import { NavigationContainerComponent } from "react-navigation";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AppContainer from "navigators/AppNavigator";
import store, { persistedStore } from "store/index";
import { ThemeProvider } from "./theme";
import NavigationService from "./utils/NavigationService";
import { defaultTheme } from "./theme/defaultTheme";
import Blueprint, { Guides } from "react-native-ui-blueprint";
import { ToastProvider } from "app/components/StyledToast";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import theme from "app/utils/styled-theme";
import { configureApp } from "./utils/helpers";

configureApp();
export default class App extends Component {
  public componentDidMount = () => {
    Orientation.lockToPortrait();
  };

  private setRef = (navigatorRef: NavigationContainerComponent) =>
    NavigationService.setTopLevelNavigator(navigatorRef);

  public render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistedStore}>
          <ThemeProvider theme={defaultTheme}>
            <StyledThemeProvider theme={theme}>
              <ToastProvider>
                <Blueprint guides={[]}>
                  <AppContainer ref={this.setRef} />
                </Blueprint>
              </ToastProvider>
            </StyledThemeProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    );
  }
}
