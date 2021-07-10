import React from "react";
import {
  StyleProp,
  TouchableOpacity,
  ViewStyle,
  StyleSheet
} from "react-native";
import { NavigationParams, NavigationScreenProp } from "react-navigation";
import { NavigationRoute, SafeAreaView } from "react-navigation";
import { Box, Spacing } from "app/components";
import { Colors } from "app/config/styles";
import useDimensions from "app/hooks/useDimensions";
import { isIPhoneX } from "app/config/metrics";

interface RenderIconParams {
  route: NavigationRoute<NavigationParams>;
  focused: boolean;
  tintColor: string;
}

interface TabBarProps {
  style: StyleProp<ViewStyle>;
  navigation: NavigationScreenProp<
    NavigationRoute<NavigationParams>,
    NavigationParams
  >;
  activeTintColor: string;
  inactiveTintColor: string;
  renderIcon: (params: RenderIconParams) => JSX.Element;
  jumpTo: (route: string) => void;
}

interface TabIconProps {
  route: NavigationRoute<NavigationParams>;
  activeTintColor: string;
  inactiveTintColor: string;
  focused: boolean;
  renderIcon: (params: RenderIconParams) => JSX.Element;
  onPress: () => void;
}

const TabBar = ({
  style,
  navigation,
  activeTintColor,
  inactiveTintColor,
  renderIcon,
  jumpTo
}: TabBarProps) => {
  const { index, routes } = navigation.state;
  const dimensions = useDimensions();

  return (
    <SafeAreaView
      pointerEvents="box-none"
      style={styles.container as StyleProp<ViewStyle>}
      forceInset={{ top: "never", bottom: "always" }}
    >
      <SafeAreaView
        style={[styles.fakeBackground as StyleProp<ViewStyle>, style]}
        forceInset={{ top: "never", bottom: "always" }}
      >
        <Spacing size={49} orientation={"vertical"} />
      </SafeAreaView>
      <Box
        flex={1}
        flexDirection={"row"}
        alignItems={"flex-end"}
        justifyContent={"space-evenly"}
      >
        {routes.map((route: NavigationRoute<NavigationParams>, idx: number) => {
          const focused = index === idx;
          if (!route.params || !route.params.navigationDisabled) {
            const onPress = () =>
              (!route.params || !route.params.navigationDisabled) &&
              jumpTo(route.key);

            return (
              <TabIcon
                key={route.key}
                route={route}
                renderIcon={renderIcon}
                focused={focused}
                activeTintColor={activeTintColor}
                inactiveTintColor={inactiveTintColor}
                onPress={onPress}
              />
            );
          }

          const Icon = renderIcon({
            route,
            focused,
            tintColor: focused ? activeTintColor : inactiveTintColor
          });

          return {
            ...Icon,
            key: "simple"
          };
        })}
      </Box>
      <Box
        shape={"circle"}
        height={60}
        width={60}
        position={"absolute"}
        bottom={isIPhoneX() ? 32 : 0}
        left={dimensions.width / 2 - 30}
        zIndex={-1}
        backgroundColor={"white"}
      />
    </SafeAreaView>
  );
};

const TabIcon = ({
  route,
  renderIcon,
  focused,
  activeTintColor,
  inactiveTintColor,
  onPress
}: TabIconProps) => (
  <TouchableOpacity
    style={styles.tabItemStyle as StyleProp<ViewStyle>}
    onPress={onPress}
  >
    {renderIcon({
      route,
      focused,
      tintColor: focused ? activeTintColor : inactiveTintColor
    })}
  </TouchableOpacity>
);

TabIcon.defaultProps = {
  focused: false
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    minHeight: 95,
    bottom: 0,
    position: "absolute",
    width: "100%"
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-evenly"
  },
  fakeBackground: {
    position: "absolute",
    width: "100%",
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    backgroundColor: Colors.snow,
    shadowColor: Colors.A300,
    shadowOffset: {
      width: 0,
      height: -3
    },
    shadowRadius: 30,
    shadowOpacity: 1
  },
  spacer: {
    height: 49
  },
  tabItemStyle: {
    alignItems: "center",
    height: 50,
    justifyContent: "center",
    width: 50
  }
});

export { TabBar };
