import _ from "lodash";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Header } from "react-native-elements";
import Hyperlink from "react-native-hyperlink";
import { Avatar as NativeAvatar } from "react-native-elements";
import InAppBrowser from "react-native-inappbrowser-reborn";
import FeatherIcon from "react-native-vector-icons/Feather";
import Ionicon from "react-native-vector-icons/Ionicons";
import { NavigationScreenProps } from "react-navigation";
import { ApiClient } from "../../../../api/client";
import {
  UserProfileModel,
  UserRelationshipModel,
} from "../../../../api/profile";
import Avatar from "../../../../components/Avatar";
import { BetterButton, FollowButton } from "../../../../components/Button";
import Metrics from "../../../../config/metrics";
import { Colors, Layout } from "../../../../config/styles";
import styles from "./styles";
import NavigationService from "app/utils/NavigationService";

interface OtherProfilePopupScreenState {
  profile: UserProfileModel;
  relation: UserRelationshipModel;
}

const initialState: OtherProfilePopupScreenState = {
  profile: {},
  relation: {},
};

export default class OtherProfilePopupScreen extends React.Component<
  NavigationScreenProps,
  OtherProfilePopupScreenState
> {
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

  public profileId: string = "";

  public async componentDidMount() {
    const param = this.props.navigation.getParam("profileId");
    if (param.profileId) {
      this.profileId = param.profileId as string;
      await this.setProfileData();
      await this.setRelationship();
    }
  }

  public render() {
    const { profile } = this.state;
    return (
      <View style={Layout.container}>
        {this.renderHeader()}
        {this.renderProfile(profile)}
      </View>
    );
  }

  private renderProfile = ({
    userProfileId,
    firstName,
    lastName,
    profileImageUrl,
    websiteUrl,
    bio,
  }: UserProfileModel) => {
    return (
      <View style={styles.profileContainer}>
        {this.renderAvatar(profileImageUrl!, firstName || "", lastName || "")}
        <Text style={[styles.fullNameLabel]}>
          {this.formatNameLabel(firstName, lastName)}
        </Text>
        <Text style={styles.bioLabel} numberOfLines={3} ellipsizeMode={"tail"}>
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
    );
  };

  private renderAvatar = (
    profileImageUrl: string,
    firstName: string,
    lastName: string
  ) => {
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
          size={"xlarge"}
        />
      );
    } else {
      const source = { uri: profileImageUrl };
      return <Avatar face={{ source }} circleSize={156.5} />;
    }
  };

  private renderHeader = () => {
    return (
      <View>
        <Header
          leftComponent={
            <FeatherIcon
              style={{ paddingLeft: Metrics.margin }}
              name={"x"}
              color={Colors.black}
              size={Metrics.icons.small}
              onPress={() => NavigationService.pop()}
            />
          }
          centerComponent={
            <Text style={styles.screenTitle}>
              {`@${this.state.profile.username}` || "Profile"}
            </Text>
          }
          rightComponent={
            <TouchableOpacity
              style={styles.overflowButton}
              onPress={() => Alert.alert("Showing profile action panel")}
            >
              <Ionicon
                name={"ios-more"}
                size={Metrics.icons.small}
                color={Colors.black}
                style={styles.overflowButtonIcon}
                onPress={() => Alert.alert("Showing profile action panel")}
              />
            </TouchableOpacity>
          }
          style={Layout.horizontalFlex}
          backgroundColor={Colors.iceBlue}
        />
      </View>
    );
  };

  private renderButtonSection = () => {
    return (
      <View style={Layout.horizontalFlex}>
        <BetterButton
          style={styles.messageButtonContainer}
          iconStyle={styles.messageIcon}
          iconName={"send-msg"}
          iconColor={Colors.burgundy}
          iconSize={17.5}
          onPress={() => Alert.alert("Showing messaging view")}
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
          style={styles.followButton}
          iconStyle={styles.followButtonIcon}
          labelStyle={styles.followButtonIcon}
          followed={this.state.relation.following}
          onPress={this.handleFollow}
        />
      </View>
    );
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
      console.log(error);
    }
  };

  private setRelationship = async () => {
    try {
      const response = await ApiClient.instance.getRelationship(this.profileId);
      console.log(response);
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
          .then((result) => {
            this.setState({
              relation: { ...this.state.relation, following: true },
            });
          })
          .catch((error) => error);
      } else {
        ApiClient.instance
          .removeFollower(userProfileId)
          .then((result) => {
            this.setState({
              relation: { ...this.state.relation, following: false },
            });
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
      console.log(response);
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
}
