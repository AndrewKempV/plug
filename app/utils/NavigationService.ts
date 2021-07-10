import {
  NavigationActions,
  StackActions,
  DrawerActions,
  NavigationParams,
  NavigationSetParamsActionPayload,
  NavigationContainerComponent
} from "react-navigation";

// https://github.com/react-navigation/react-navigation/issues/1439

let navigator: NavigationContainerComponent;

export function setTopLevelNavigator(
  navigatorRef: NavigationContainerComponent
) {
  navigator = navigatorRef;
}

export function goBack(key?: string) {
  navigator.dispatch(
    NavigationActions.back({
      key
    })
  );
}

export function reset(routeName: string, params?: NavigationParams) {
  navigator.dispatch(
    StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName,
          params
        })
      ]
    })
  );
}

export function navigate(routeName: string, params?: NavigationParams) {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

export function resetThenNavigate(
  routeToReset: string,
  routeToNavigate: string,
  resetParams?: NavigationParams,
  navParams?: NavigationParams
) {
  reset(routeToReset, resetParams);
  navigate(routeToNavigate, navParams);
}

export function navigateDeep(actions: any[]) {
  navigator.dispatch(
    actions.reduceRight(
      (prevAction: any, action: any) =>
        NavigationActions.navigate({
          routeName: action.routeName,
          params: action.params,
          action: prevAction
        }),
      undefined
    )
  );
}

export function getCurrentRoute(): string {
  if (navigator) {
    //@ts-ignore
    let route = navigator.state.nav;
    while (route.routes) {
      route = route.routes[route.index];
    }
    return route.routeName;
  } else {
    return "";
  }
}

export function replace(routeName: string, params?: NavigationParams) {
  navigator.dispatch(
    StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName, params })]
    })
  );
}

export function push(routeName: string, params?: NavigationParams) {
  navigator.dispatch(
    StackActions.push({
      routeName,
      params
    })
  );
}

export function pop(n?: number, immediate?: boolean) {
  navigator.dispatch(
    StackActions.pop({
      n,
      immediate
    })
  );
}

export function popToTop(key?: string, immediate?: boolean) {
  navigator.dispatch(
    StackActions.popToTop({
      key,
      immediate
    })
  );
}

export function openDrawer() {
  navigator.dispatch(DrawerActions.openDrawer());
}

export function closeDrawer() {
  navigator.dispatch(DrawerActions.closeDrawer());
}

export function setParams(options: NavigationSetParamsActionPayload) {
  navigator.dispatch(NavigationActions.setParams(options));
}

export default {
  navigate,
  setTopLevelNavigator,
  navigateDeep,
  reset,
  getCurrentRoute,
  openDrawer,
  closeDrawer,
  goBack,
  replace,
  push,
  pop,
  popToTop,
  setParams,
  resetThenNavigate
};
