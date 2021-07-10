import _ from "lodash";
import React, { Component } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text as NativeText,
  View
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import {
  createBottomTabNavigator,
  NavigationParams,
  NavigationRoute,
  NavigationScreenOptions,
  NavigationScreenProp,
  NavigationScreenProps
} from "react-navigation";
import { NavigationScreenConfigProps } from "react-navigation";
import { createStackNavigator } from "react-navigation";
import Icon from "../components/Icon";
import { TabBar, TabBarToggle } from "../components/TabBar";
import { Colors } from "../config/styles";
import HomeScreen from "../features/home/screens/Home";
import OtherHome from "../features/authentication/screens/Home/HomeScreen";
import OtherProfileScreen from "../features/profile/screens/OtherProfile";
import OtherProfilePopupScreen from "../features/profile/screens/OtherProfilePopup";
import ProfileScreen from "../features/profile/screens/Profile";
import UserSearchScreen from "../features/profile/screens/UserSearch";
import AboutScreen from "../features/settings/screens/About";
import AddPaymentScreen from "../features/settings/screens/AddPayment";
import BlockedAccountsScreen from "../features/settings/screens/BlockedAccounts";
import ChangeEmailScreen from "../features/settings/screens/ChangeEmail";
import ChangeLocationScreen from "../features/settings/screens/ChangeLocation";
import ChangePasswordScreen from "../features/settings/screens/ChangePassword";
import MenuScreen from "../features/settings/screens/Menu";
import SavedPaymentsScreen from "../features/settings/screens/SavedPayments";
import SettingsScreen from "../features/settings/screens/Settings";
import CreateEventScreen from "app/features/event/screens/CreateEvent";
import NavigationService from "utils/NavigationService";
import styles from "./styles";
import { fromRight, fromBottom } from "app/utils/animations";
import { SvgIcon } from "app/components";
import { Playground } from "app/components/Wrapper/Playground";
import { TypographyPlayground } from "app/components/Typography/TypographyPlayground";
import SvgIcons from "app/assets/svgs";

const fromBottomConfig = () => fromBottom(500);

const CreateEventStack = createStackNavigator(
  {
    CreateEvent: CreateEventScreen
  },
  {
    initialRouteName: "CreateEvent",
    headerMode: "none",
    mode: Platform.select({ ios: "modal", android: "card" }),
    transitionConfig: fromBottomConfig
  }
);
CreateEventStack.navigationOptions = ({
  navigation
}: NavigationScreenProps): NavOptions => {
  const { index, routes } = navigation.state;
  let tabBarVisible = true;
  if (index >= 0) {
    tabBarVisible = false;
  } else {
    routes.forEach((route, idx) => {
      if (!_.isNil(route.params) && !_.isNil(route.params.tabBarVisible)) {
        tabBarVisible = route.params.tabBarVisible;
      }
    });
  }

  return {
    tabBarVisible,
    tabBarIcon: ({ tintColor }: any) => (
      <TabBarToggle
        navigation={navigation}
        actionSize={30}
        toggleSize={50}
        animateIcon={false}
        icon={
          <MaterialIcon
            name="add"
            color="#FFFFFF"
            size={24}
            onPress={() => NavigationService.navigate("CreateEvent")}
          />
        }
      />
    ),
    gesturesEnabled: false,
    swipeEnabled: false,
    header: null
  };
};

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen
  },
  {
    initialRouteName: "Home",
    headerMode: "none",
    mode: Platform.select({ ios: "modal", android: "card" }),
    navigationOptions: () => ({
      tabBarIcon: ({ tintColor }: any) => (
        <Icon name="home" color={tintColor} size={20} />
      )
    })
  }
);

const CalendarStack = createStackNavigator(
  {
    Calendar: TypographyPlayground
  },
  {
    initialRouteName: "Calendar",
    headerMode: "none",
    mode: Platform.select({ ios: "modal", android: "card" }),
    navigationOptions: () => ({
      tabBarIcon: ({ tintColor }: any) => (
        <Icon name={"notifications"} color={tintColor} size={20} />
      )
    })
  }
);

const OfferStack = createStackNavigator(
  {
    Offer: OtherHome
  },
  {
    initialRouteName: "Offer",
    headerMode: "none",
    mode: Platform.select({ ios: "modal", android: "card" }),
    navigationOptions: () => ({
      tabBarIcon: ({ tintColor }: any) => (
        <Icon name={"tickets"} color={tintColor} size={20} />
      )
    })
  }
);

const ProfileStack = createStackNavigator(
  {
    Profile: ProfileScreen,
    OtherProfile: OtherProfileScreen,
    OtherProfilePopup: OtherProfilePopupScreen,
    UserSearch: UserSearchScreen,
    Settings: SettingsScreen,
    Menu: MenuScreen,
    About: AboutScreen,
    ChangeEmail: ChangeEmailScreen,
    ChangePassword: ChangePasswordScreen,
    ChangeLocation: ChangeLocationScreen,
    BlockedAccounts: BlockedAccountsScreen,
    SavedPayments: SavedPaymentsScreen,
    AddPayment: AddPaymentScreen,
    CreateEventStack
  },
  {
    initialRouteName: "Profile",
    headerMode: "screen",
    mode: Platform.select({ ios: "modal", android: "card" }),
    transitionConfig: () => fromRight(500)
  }
);

export type NavOptions =
  | NavigationScreenOptions
  | ((
      navigationOptionsContainer: NavigationScreenConfigProps & {
        navigationOptions: NavigationScreenProp<
          NavigationRoute<NavigationParams>,
          NavigationParams
        >;
      }
    ) => NavigationScreenOptions)
  | undefined;

ProfileStack.navigationOptions = ({
  navigation
}: NavigationScreenProps): NavOptions => {
  const { index, routes } = navigation.state;
  let tabBarVisible = true;
  if (index >= 1) {
    tabBarVisible = false;
  } else {
    routes.forEach((route, idx) => {
      if (!_.isNil(route.params) && !_.isNil(route.params.tabBarVisible)) {
        tabBarVisible = route.params.tabBarVisible;
      }
    });
  }

  return {
    tabBarVisible,
    tabBarIcon: ({ tintColor }: any) => (
      <View style={[styles.profileButtonContainer, { borderColor: tintColor }]}>
        {/* {SvgIcons.profile} */}
        {/* <SvgIcon
          name={"profile"}
          height={40}
          width={40}
          fill={"#000000"}
          stroke={"#000000"}
          strokeWidth={5}
        /> */}
        <Icon name="profile" color={tintColor} size={16} />
      </View>
    ),
    gesturesEnabled: false,
    swipeEnabled: false,
    header: null
  };
};

const RadialBarStack = createStackNavigator(
  {
    RadialBar: () => null
  },
  {
    initialRouteName: "RadialBar",
    headerMode: "none",
    mode: Platform.select({ ios: "modal", android: "card" }),
    navigationOptions: ({ navigation }: NavigationScreenProps) => ({
      tabBarIcon: () => (
        <TabBarToggle
          navigation={navigation}
          actionSize={30}
          toggleSize={50}
          animateIcon={false}
          icon={<MaterialIcon name="add" color="#FFFFFF" size={24} />}
        />
      )
    })
  }
);

const TabsNavigator = createBottomTabNavigator(
  {
    Home: HomeStack,
    Calendar: CalendarStack,
    CreateEventStack,
    Offers: OfferStack,
    Profile: ProfileStack
  },
  {
    tabBarComponent: TabBar,
    tabBarOptions: {
      showLabel: false,
      activeTintColor: "#800020",
      inactiveTintColor: "#9F9F9F",
      style: {
        backgroundColor: Colors.snow,
        shadowColor: "rgba(0, 0, 0, 0.03)",
        shadowOffset: {
          width: 0,
          height: -3
        },
        shadowRadius: 30,
        shadowOpacity: 1
      },
      tabStyle: {}
    },
    tabBarPosition: "bottom",
    initialRouteName: "Home"
  }
);

export default TabsNavigator;
