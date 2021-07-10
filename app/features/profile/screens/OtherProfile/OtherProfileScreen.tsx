import _ from "lodash";
import range from "ramda/es/range";
import React from "react";
import {
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Header } from "react-native-elements";
import { Avatar as NativeAvatar } from "react-native-elements";
import Hyperlink from "react-native-hyperlink";
import Animated from "react-native-reanimated";
import { verticalScale } from "react-native-size-matters/extend";

import {
  NavigationState,
  SceneRendererProps,
  TabView,
} from "react-native-tab-view";
import Ionicon from "react-native-vector-icons/Ionicons";
import { NavigationEvents } from "react-navigation";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ApiClient } from "../../../../api/client";
import {
  FullUserProfileModel,
  UserProfileModel,
  UserRelationshipModel,
} from "../../../../api/profile";
import Avatar from "../../../../components/Avatar";
import { BackButton, FollowButton } from "../../../../components/Button";
import { BetterButton } from "../../../../components/Button/Button";
import MessageKeyboardAccessory from "../../../../components/MessageKeyboardAccessory";
import ModalBottomSheet from "../../../../components/ModalBottomSheet";
import ModalDialog from "../../../../components/ModalDialog";
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
import InAppBrowser from "react-native-inappbrowser-reborn";

type TBindActionCreators = typeof AppActions;
type StateFromDispatch = ReturnType<typeof mapStateToProps>;
type PropsFromDispatch = GetPropsFromDispatch<TBindActionCreators>;

const mapStateToProps = (state: StateStore) => ({
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
  relation: UserRelationshipModel;
  isKeyboardAccessoryVisible: boolean;
  isProfileActionPanelVisible: boolean;
  isBlockModalVisible: boolean;
}

const initialState: State = {
  index: 0,
  routes,
  profile: {},
  relation: {
    following: false,
    followedBy: false,
    notificationsEnabled: false,
  },
  isKeyboardAccessoryVisible: false,
  isProfileActionPanelVisible: false,
  isBlockModalVisible: false,
};

class OtherProfileScreen extends React.Component<ConnectedScreenProps, State> {
  public static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    //const { params } = navigation.state;
    return {
      //params,
      headerStyle: null,
      header: null,
      headerTitle: null,
      headerRight: null,
      headerLeft: null,
    };
  };

  public readonly state = initialState;

  public indicatorOffset: Animated.Value<number> = new Animated.Value<number>(
    0
  );

  public profileId: string = "";
  public priorRoute: string = "";

  public async componentDidMount() {
    const param: string = this.props.navigation.getParam("profileId");
    if (param) {
      this.profileId = param;
      await this.setProfileData();
      await this.setRelationship();
    }
    const route: string = this.props.navigation.getParam("priorRoute");
    if (route) {
      this.priorRoute = route;
    }
  }

  public handleIndexChange = (index: number) => {
    this.setState({ index });
  };

  public buildIndicatorTranslation = (
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

  public render = () => {
    const { index, profile } = this.state;
    const { profileImageUrl, username } = profile;
    return (
      <View style={styles.container}>
        <StatusBar
          networkActivityIndicatorVisible={true}
          hidden={false}
          barStyle={"dark-content"}
        />

        {this.renderHeader(username || "")}
        {this.renderProfileView(profile)}
        {this.renderTabView({ index, routes })}

        <NavigationEvents
          onWillFocus={() => () => {
            this.setProfileData();
            this.setRelationship();
          }}
        />
        {this.state.isProfileActionPanelVisible && (
          <ModalBottomSheet
            onPressCancel={this.hideProfileActionPanel}
            onPressBlock={this.showBlockUserModal}
            onPressMessage={this.showMessagePanel}
          />
        )}
        {this.state.isKeyboardAccessoryVisible && (
          <MessageKeyboardAccessory onDismiss={this.hideMessagePanel} />
        )}
        {this.renderBlockUserDialog(username!)}
      </View>
    );
  };

  private renderHeader = (username: string) => {
    return (
      <View>
        <Header
          backgroundColor={Colors.snow}
          leftComponent={
            <BackButton
              onPress={() => {
                if (this.priorRoute === "EventDetail") {
                  NavigationService.goBack();
                } else if (this.priorRoute === "Home") {
                  NavigationService.resetThenNavigate(
                    "Profile",
                    this.priorRoute
                  );
                } else {
                  NavigationService.navigate(this.priorRoute);
                }
              }}
            />
          }
          centerComponent={
            <Text
              style={styles.screenTitle}
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {username ? `@${username}` : ""}
            </Text>
          }
          rightComponent={
            <TouchableOpacity
              style={styles.overflowButton}
              onPress={this.showProfileActionPanel}
            >
              <Ionicon
                style={styles.overflowButtonIcon}
                name={"ios-more"}
                size={Metrics.icons.small}
                color={Colors.black}
                onPress={this.showProfileActionPanel}
              />
            </TouchableOpacity>
          }
        />
      </View>
    );
  };

  private renderProfileView = ({
    userProfileId,
    firstName,
    lastName,
    profileImageUrl,
    websiteUrl,
    bio,
  }: UserProfileModel) => {
    const source = { uri: profileImageUrl };
    const profileId = userProfileId;
    return (
      <View style={[styles.profileContainer]}>
        <View style={[Layout.alignCentered, { marginTop: verticalScale(22) }]}>
          {this.renderAvatar(
            profileId || "",
            profileImageUrl!,
            firstName || " ",
            lastName || " "
          )}
          <Text style={[styles.fullNameLabel]}>
            {this.formatNameLabel(firstName, lastName)}
          </Text>
          <Text
            style={styles.bioLabel}
            numberOfLines={3}
            ellipsizeMode={"tail"}
          >
            {bio || ""}
          </Text>
          <Hyperlink
            linkStyle={styles.websiteLabel}
            linkText={this.formatWebLinkLabel}
            onPress={this.handleOpenWebView}
          >
            <Text numberOfLines={1} ellipsizeMode={"tail"}>
              {websiteUrl || ""}
            </Text>
          </Hyperlink>
          {this.renderButtonSection()}
        </View>
      </View>
    );
  };

  private renderAvatar = (
    profileId: string,
    profileImageUrl: string,
    firstName: string,
    lastName: string
  ) => {
    const openProfilePopup = () =>
      this.props.navigation.push("OtherProfilePopup", {
        profileId: { profileId },
      });
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
          onPress={openProfilePopup}
        />
      );
    } else {
      const source = { uri: profileImageUrl };
      return (
        <Avatar face={{ source }} circleSize={52} onPress={openProfilePopup} />
      );
    }
  };

  private renderButtonSection = () => {
    return (
      <View style={styles.buttonSectionContainer}>
        <BetterButton
          style={[
            styles.messageButtonContainer,
            this.state.relation.following
              ? { marginHorizontal: 5 }
              : { marginHorizontal: 0 },
          ]}
          iconStyle={styles.messageIcon}
          iconName={"direct-message"}
          iconColor={Colors.burgundy}
          iconSize={17.5}
          onPress={this.showMessagePanel}
        />
        {this.state.relation.following && (
          <BetterButton
            style={
              this.state.relation.notificationsEnabled
                ? styles.notificationButtonContainerEnabled
                : styles.notificationButtonContainer
            }
            iconStyle={styles.notificationIcon}
            iconName={
              this.state.relation.notificationsEnabled
                ? "notification-allowed"
                : "notification"
            }
            iconColor={
              this.state.relation.notificationsEnabled
                ? Colors.snow
                : Colors.burgundy
            }
            iconSize={17.5}
            onPress={this.toggleNotification}
          />
        )}
        <FollowButton
          style={
            this.state.relation.following
              ? styles.followingButton
              : styles.followButton
          }
          iconStyle={styles.followButtonIcon}
          labelStyle={styles.followButtonLabel}
          followed={this.state.relation.following}
          onPress={this.handleFollow}
        />
      </View>
    );
  };

  private renderTabScene = () => {
    switch (this.state.index) {
      case 0:
        return (
          <FavoriteEventsTab
            self={false}
            profile={this.state.profile}
            suggestions={this.props.ProfileState.suggestions}
          />
        );
      case 1:
        return (
          <PastEventsTab
            self={false}
            profile={this.state.profile}
            suggestions={this.props.ProfileState.suggestions}
          />
        );
      case 2:
        return (
          <HostedEventsTab
            self={false}
            profile={this.state.profile}
            suggestions={this.props.ProfileState.suggestions}
          />
        );
      default:
        return (
          <HostedEventsTab
            self={false}
            profile={this.state.profile}
            suggestions={this.props.ProfileState.suggestions}
          />
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

  // tslint:disable-next-line:no-shadowed-variable
  private renderTabView = ({ index, routes }: NavState) => {
    return (
      <TabView
        renderScene={this.renderTabScene}
        renderTabBar={(props) => this.renderTabBar(props)}
        onIndexChange={(idx) => this.handleIndexChange(idx)}
        navigationState={{ index, routes }}
        initialLayout={{ height: 800, width: Metrics.screenWidth }}
        timingConfig={{ duration: 150 }}
        swipeEnabled={true}
      />
    );
  };

  private renderBlockUserDialog = (username: string) => {
    if (this.state.isBlockModalVisible) {
      return (
        <ModalDialog
          dialogStyle={styles.blockUserDialog}
          subTitleStyle={styles.blockUserContent}
          title={`Block @${username}?`}
          subTitle={strings.blockUserContent}
          active={this.state.isBlockModalVisible}
          transparent={false}
          buttons={[
            {
              containerStyle: styles.blockButton,
              labelStyle: styles.blockLabel,
              label: "Block",
              onPress: this.onPressBlockUser,
            },
            {
              containerStyle: styles.cancelButton,
              labelStyle: styles.cancelLabel,
              label: "Cancel",
              onPress: this.hideBlockUserModal,
            },
          ]}
        />
      );
    }
  };

  private formatNameLabel = (firstName?: string, lastName?: string) => {
    return _.isNil(firstName) || _.isNil(lastName)
      ? ""
      : `${firstName} ${lastName}`;
  };

  private formatWebLinkLabel = (url: string) => {
    return url;
    // return _.startsWith(url, 'https://') ? _.replace(url, 'https://', '') : _.startsWith(url, 'http://') ? _.replace(url, 'http://', '') : url;
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

  private setProfileData = async () => {
    try {
      const prof = await ApiClient.instance.getUserProfile(this.profileId);
      if (prof.data.data) {
        const data = prof.data.data.pop()!;
        this.setState({ profile: data });
        this.props.navigation.setParams({ username: data.username });
      }
      const response = await ApiClient.instance.getRelationship(this.profileId);
      if (response.data.data) {
        const relation = response.data.data.pop()!;
        this.setState({ relation });
      }
    } catch (error) {
      console.log("error in setProfileData");
    }
  };

  private setRelationship = async () => {
    try {
      const response = await ApiClient.instance.getRelationship(this.profileId);
      if (response.data.data) {
        const relation = response.data.data.pop()!;
        this.setState({ relation });
      }
    } catch (error) {
      console.log(error);
    }
  };

  private handleFollow = () => {
    const { following } = this.state.relation;
    const { userProfileId } = this.state.profile;
    if (!_.isNil(userProfileId)) {
      if (following === false) {
        ApiClient.instance
          .createFollower(userProfileId)
          .then(() => {
            this.setState((prevState) => ({
              ...prevState,
              relation: { ...this.state.relation, following: true },
            }));
          })
          .catch((error) => error);
      } else {
        ApiClient.instance
          .removeFollower(userProfileId)
          .then(() => {
            this.setState((prevState) => ({
              ...prevState,
              relation: { ...this.state.relation, following: false },
            }));
          })
          .catch((error) => error);
      }
    }
  };

  private toggleNotification = async () => {
    try {
      const response = await ApiClient.instance.toggleNotification(
        !this.state.relation.notificationsEnabled,
        this.profileId
      );
      if (response.data.data) {
        this.setState((prevState) => ({
          relation: {
            ...prevState.relation,
            notificationsEnabled: !prevState.relation.notificationsEnabled,
          },
        }));
      }
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log(error);
    }
  };

  private showMessagePanel = () => {
    this.hideProfileActionPanel();
    this.setState({ isKeyboardAccessoryVisible: true });
  };

  private hideMessagePanel = () => {
    this.setState({ isKeyboardAccessoryVisible: false });
  };

  private showProfileActionPanel = () => {
    this.setState({ isProfileActionPanelVisible: true });
  };

  private hideProfileActionPanel = () => {
    this.setState({ isProfileActionPanelVisible: false });
  };

  private showBlockUserModal = () => {
    this.hideProfileActionPanel();
    this.setState({ isBlockModalVisible: true });
  };

  private hideBlockUserModal = () => {
    this.setState({ isBlockModalVisible: false });
  };

  private onPressBlockUser = () => {
    ApiClient.instance
      .createBlock(this.profileId)
      .then(() => {
        this.setState({
          isBlockModalVisible: false,
          relation: {
            ...this.state.relation,
            blocked: true,
          },
        });
      })
      .catch((error) => error);
  };
}

export default connect<StateFromDispatch, PropsFromDispatch, {}, StateStore>(
  mapStateToProps,
  mapDispatchToProps
)(OtherProfileScreen);
