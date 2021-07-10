import _ from "lodash";
import range from "ramda/es/range";
import React from "react";
import {
  Alert,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Avatar as NativeAvatar, Header } from "react-native-elements";
import Hyperlink from "react-native-hyperlink";
import Animated from "react-native-reanimated";
import InAppBrowser from "react-native-inappbrowser-reborn";
import { verticalScale } from "react-native-size-matters/extend";
import {
  NavigationState,
  SceneRendererProps,
  TabView,
} from "react-native-tab-view";
import FeatherIcon from "react-native-vector-icons/Feather";

import {
  NavigationEvents,
  SafeAreaView,
  NavigationEventPayload,
} from "react-navigation";
import { NavigationScreenProps } from "react-navigation";
import HeaderButtons from "react-navigation-header-buttons";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ApiClient } from "../../../../api/client";
import { FullUserProfileModel } from "../../../../api/profile";
import AsyncButton from "../../../../components/AsyncButton/AsyncButton";
import Avatar from "../../../../components/Avatar";
import { BackButton } from "../../../../components/Button";
import {
  BetterButton,
  BetterButtonProps,
} from "../../../../components/Button/Button";
import EventOrganizerSheet from "../../../../components/EventOrganizerSheet";
import {
  FavoriteEventsTab,
  HostedEventsTab,
  PastEventsTab,
} from "../../../../components/ProfileEventTabs";
import Metrics from "../../../../config/metrics";
import { Colors, Layout } from "../../../../config/styles";
import { GetPropsFromDispatch } from "../../../../store/ActionCreators";
import AppActions from "../../../../store/AppActions";
import { StateStore } from "../../../../store/AppReducer";
import strings from "./strings";
import styles from "./styles";
import NavigationService from "app/utils/NavigationService";

type TBindActionCreators = typeof AppActions;
type StateFromDispatch = ReturnType<typeof mapStateToProps>;
type PropsFromDispatch = GetPropsFromDispatch<TBindActionCreators>;

const mapStateToProps = (state: StateStore) => ({
  rawProfileImage: state.profileReducer.profileImage,
  AuthState: state.authReducer,
  ProfileState: state.profileReducer,
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<TBindActionCreators, PropsFromDispatch>(
    AppActions,
    dispatch
  );

type ReduxProps = StateFromDispatch & PropsFromDispatch;
type ConnectedScreenProps = ReduxProps & NavigationScreenProps;
interface Route {
  key: string;
  title: string;
  icon?: string;
}

type NavState = NavigationState<Route>;

const routes: Omit<Route, "icon">[] = [
  { key: "favorites", title: strings.favoriteTabTitle },
  { key: "history", title: strings.pastTabTitle },
  { key: "hosted", title: strings.hostedTabTitle },
];

interface State {
  routes: Omit<Route, "icon">[];
  index: number;
  profile: FullUserProfileModel;
  showBusinessPanel: boolean;
}

const initialState: State = {
  index: 0,
  routes,
  profile: {},
  showBusinessPanel: false,
};

class ProfileScreen extends React.Component<ConnectedScreenProps, State> {
  public static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    const { params } = navigation.state;
    let title: string;
    if (!_.isNil(params)) {
      title = params.username;
    } else {
      title = "Profile";
    }
    return {
      header: null,
      headerStyle: null,
      headerRight: null,
      headerLeft: null,
    };
  };

  public readonly state = initialState;

  public indicatorOffset: Animated.Value<number> = new Animated.Value<number>(
    0
  );

  public componentDidMount() {
    this.refresh();
    this.setProfileData();
  }

  public render = () => {
    const { index } = this.state;
    let profile;
    if (!_.isNil(this.props.ProfileState.profile)) {
      profile = this.props.ProfileState.profile;
    } else {
      profile = this.state.profile;
    }
    const icon: BetterButtonProps = {
      style: StyleSheet.flatten([styles.businessButton]),
      iconStyle: styles.businessIcon as StyleProp<TextStyle>,
      iconName: "add-users",
      iconSize: Metrics.icons.xxsmall,
      iconColor: Colors.black,
      onPress: () => this.props.navigation.navigate("UserSearch"),
      iconPosition: "left",
      labelPosition: "right",
    };
    const {
      profileImageUrl,
      firstName,
      lastName,
      bio,
      websiteUrl,
      followerCount,
      followingCount,
      username,
    } = profile;
    return (
      <View style={[Layout.container]}>
        <StatusBar
          networkActivityIndicatorVisible={true}
          hidden={false}
          barStyle={"dark-content"}
        />
        <View>
          <Header
            backgroundColor={Colors.snow}
            leftComponent={
              <AsyncButton
                buttonProps={icon}
                animatedLoadingProps={{
                  style: StyleSheet.flatten([styles.businessButton]),
                  loading: this.props.ProfileState.status === "STARTED",
                }}
              />
            }
            centerComponent={
              <Text style={styles.screenTitle}>
                {username ? `@${username}` : "Profile"}
              </Text>
            }
            rightComponent={
              <View style={Layout.horizontalCenter}>
                <BetterButton
                  style={StyleSheet.flatten([styles.businessButton])}
                  iconStyle={styles.businessIcon}
                  iconName={"business"}
                  iconSize={Metrics.icons.xxsmall}
                  iconColor={Colors.black}
                  onPress={this.showBusinessPanel}
                />
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => NavigationService.navigate("Menu")}
                >
                  <FeatherIcon
                    name={"menu"}
                    size={23}
                    color={Colors.black}
                    style={styles.menuIcon}
                    onPress={() => NavigationService.navigate("Menu")}
                  />
                </TouchableOpacity>
              </View>
            }
          />
        </View>
        <View style={[styles.profileContainer]}>
          <View
            style={[Layout.alignCentered, { marginTop: verticalScale(22) }]}
          >
            {this.renderAvatar(
              profileImageUrl || "",
              firstName || " ",
              lastName || " "
            )}
            <Text style={[styles.fullNameLabel]}>
              {this.formatNameLabel(firstName, lastName)}
            </Text>
            <Text style={styles.bioLabel} numberOfLines={3}>
              {bio || ""}
            </Text>
            <Hyperlink
              linkStyle={styles.websiteLabel}
              linkText={this.formatWebLinkLabel}
              onPress={this.handleOpenWebView}
            >
              <Text>{websiteUrl || ""}</Text>
            </Hyperlink>
            <View style={styles.connectionStatContainer}>
              <Text style={styles.numericalStatLabel}>
                {followerCount || 0}
              </Text>
              <Text style={styles.followersLabel}>{strings.followers}</Text>
              <Text style={styles.verticalDivider}>{`|`}</Text>
              <Text style={styles.numericalStatLabel}>
                {followingCount || 0}
              </Text>
              <Text style={styles.followingLabel}>{strings.following}</Text>
            </View>
            <BetterButton
              label={strings.editLabel}
              labelStyle={styles.editButtonInnerText}
              style={styles.editButtonContainer}
              onPress={() => NavigationService.navigate("EditProfile")}
            />
          </View>
        </View>
        <TabView
          renderScene={this.renderTabScene}
          renderTabBar={(props) => this.renderTabBar(props)}
          onIndexChange={(idx) => this.handleIndexChange(idx)}
          navigationState={{ index, routes }}
          initialLayout={{ height: 800, width: Metrics.screenWidth }}
          timingConfig={{ duration: 150 }}
          swipeEnabled={true}
        />
        <NavigationEvents onWillFocus={this.onNavigationFocus} />
        <EventOrganizerSheet
          visible={this.state.showBusinessPanel}
          onPressCancel={this.hideBusinessPanel}
        />
      </View>
    );
  };

  private renderTabScene = () => {
    const { profile, favorites, history, hosted } = this.props.ProfileState;
    switch (this.state.index) {
      case 0:
        return (
          <FavoriteEventsTab
            listContainer={styles.listContainer}
            profile={profile}
            events={favorites}
            self={true}
          />
        );
      case 1:
        return <PastEventsTab profile={profile} self={true} />;
      case 2:
        return (
          <HostedEventsTab profile={profile} events={history} self={true} />
        );
      default:
        return (
          <HostedEventsTab profile={profile} events={history} self={true} />
        );
    }
  };

  private renderTabBar = (
    props: SceneRendererProps & { navigationState: NavState }
  ) => {
    const translateX = this.buildIndicatorTranslation(props);
    return (
      <View style={styles.tabbarContainer}>
        <View style={styles.tabBar}>
          {props.navigationState.routes.map((route: Route, index: number) => {
            return (
              <TouchableWithoutFeedback
                key={route.key}
                onPress={() => props.jumpTo(route.key)}
              >
                {this.renderItem(props, { route, index })}
              </TouchableWithoutFeedback>
            );
          })}
        </View>
        <Animated.View
          style={[styles.activeTabContainer, { transform: [{ translateX }] }]}
        >
          <View style={styles.activeTabIndicator} />
        </Animated.View>
      </View>
    );
  };

  private renderItem = (
    {
      navigationState,
      position,
    }: { navigationState: NavState; position: Animated.Node<number> },
    { route, index }: { route: Route; index: number }
  ) => {
    // tslint:disable-next-line:no-shadowed-variable
    const inputRange = navigationState.routes.map((_, i) => i);

    const activeOpacity = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map((i: number) => (i === index ? 1 : 0)),
    });
    const inactiveOpacity = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map((i: number) => (i === index ? 0 : 1)),
    });

    return (
      <View style={styles.tab}>
        <Animated.View style={[styles.item, { opacity: inactiveOpacity }]}>
          <Text style={[styles.label, styles.inactive]}>{route.title}</Text>
        </Animated.View>
        <Animated.View
          style={[styles.item, styles.activeItem, { opacity: activeOpacity }]}
        >
          <Text style={[styles.label, styles.active]}>{route.title}</Text>
        </Animated.View>
      </View>
    );
  };

  private renderAvatar = (
    profileImageUrl: string,
    firstName: string,
    lastName: string
  ) => {
    const { rawProfileImage } = this.props;
    if (_.isNil(profileImageUrl) || profileImageUrl === "") {
      return (
        <NativeAvatar
          rounded={true}
          title={
            firstName
              ? firstName.charAt(0)
              : " " + lastName
              ? lastName.charAt(0)
              : ""
          }
          size={"large"}
        />
      );
    } else {
      const source = {
        uri:
          !_.isNil(rawProfileImage) &&
          !_.isNil(rawProfileImage.base64EncodedImage)
            ? `data:${rawProfileImage.contentType};base64,` +
              rawProfileImage.base64EncodedImage
            : profileImageUrl,
      };
      return <Avatar face={{ source }} circleSize={52} />;
    }
  };
  private handleIndexChange = (index: number) => {
    this.setState({ index });
  };

  private buildIndicatorTranslation = (
    props: SceneRendererProps & { navigationState: NavState }
  ) => {
    const { navigationState, position } = props;
    const width = Metrics.DEVICE_WIDTH;
    const count = navigationState.routes.length;
    const inputRange = range(0, count);
    const outputTranslationRange = inputRange.map(
      (index: number) => width * (index / count)
    );
    const translate = Animated.interpolate(position, {
      inputRange,
      outputRange: outputTranslationRange,
      extrapolateRight: Animated.Extrapolate.CLAMP,
    });
    return translate;
  };

  private formatNameLabel = (firstName?: string, lastName?: string) => {
    return _.isNil(firstName) || _.isNil(lastName)
      ? ""
      : `${firstName} ${lastName}`;
  };

  private formatWebLinkLabel = (url: string) => {
    return url;
  };

  private handleOpenWebView = async (url: string) => {
    if (await InAppBrowser.isAvailable()) {
      InAppBrowser.open(url, { modalTransitionStyle: "coverVertical" })
        .then((value) => {
          console.info(value);
        })
        .catch((error) => console.error(error));
    }
  };

  private showBusinessPanel = () => {
    this.setState({ showBusinessPanel: true });
  };

  private hideBusinessPanel = () => {
    this.setState({ showBusinessPanel: false });
  };

  private setProfileData = () => {
    ApiClient.instance
      .getOwnUserProfile()
      .then((prof) => {
        console.log(prof);
        if (!_.isNil(prof.data.data)) {
          const data = prof.data.data.pop()!;
          this.setState({ profile: data });
          this.props.navigation.setParams({ username: data.username });
        }
      })
      .catch((error) => error);
  };

  private onNavigationFocus = (payload: NavigationEventPayload) => {
    this.refresh();
  };

  private refresh = () => {
    StatusBar.setBarStyle("dark-content", true);
    this.props.getOwnUserProfile();
    this.props.getFavoriteEvents({ limit: 20, offset: 0 });
    this.props.getHostedEvents({ limit: 20, offset: 0 });
    this.props.getPastEvents({ limit: 20, offset: 0 });
    this.props.getBlockedUsers({ limit: 20, offset: 0 });
  };
}

export default connect<StateFromDispatch, PropsFromDispatch, {}, StateStore>(
  mapStateToProps,
  mapDispatchToProps
)(ProfileScreen);
