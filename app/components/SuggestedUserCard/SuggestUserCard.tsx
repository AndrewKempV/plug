import React, { PureComponent } from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { NavigationScreenProps } from "react-navigation";
import { bindActionCreators, Dispatch } from "redux";
import { ApiClient } from "../../api/client";
import { UserRelationshipModel } from "../../api/profile";
import Images from "../../assets/images";
import Metrics from "../../config/metrics";
import { Colors, Fonts, Layout } from "../../config/styles";
import { GetPropsFromDispatch } from "../../store/ActionCreators";
import AppActions from "../../store/AppActions";
import { StateStore } from "../../store/AppReducer";
import LayoutDebugger from "../../utils/LayoutDebugger";
import Avatar from "../Avatar";
import { FollowButton } from "../Button";
import { Surface } from "../Typings/Surface";
import NavigationService from "app/utils/NavigationService";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

type TBindActionCreators = typeof AppActions;

type StateFromDispatch = ReturnType<typeof mapStateToProps>;

type PropsFromDispatch = GetPropsFromDispatch<TBindActionCreators>;

const mapStateToProps = (state: StateStore) => ({
  ProfileState: state.profileReducer
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<TBindActionCreators, PropsFromDispatch>(
    AppActions,
    dispatch
  );

type ReduxProps = StateFromDispatch & PropsFromDispatch;

export interface SuggestedUserCardProps {
  profileId: string;
  avatarUri: string;
  firstName: string;
  lastName: string;
  bio: string;
  username: string;
  onPressRemove: (index: any) => void;
  index?: number;
}

interface SuggestedUserCardState {
  relationship: UserRelationshipModel;
  isLoading?: boolean;
  isFollowLoading?: boolean;
}

const initialState: SuggestedUserCardState = {
  relationship: {},
  isLoading: false,
  isFollowLoading: false
};

class SuggestedUserCard extends PureComponent<
  SuggestedUserCardProps,
  SuggestedUserCardState
> {
  public readonly state: SuggestedUserCardState = initialState;

  public isLoading: boolean = false;

  public loading(isLoading: boolean) {
    this.setState({ isLoading });
  }
  public followLoading(isFollowLoading: boolean) {
    this.setState({ isFollowLoading });
  }

  public componentDidMount() {
    this.loading(true);
    ApiClient.instance
      .getRelationship(this.props.profileId)
      .then(result => {
        if (result.data.data) {
          const relationship = result.data.data.pop()!;
          this.setState({ relationship });
          this.loading(false);
        }
      })
      .catch(error => error);
  }

  public render() {
    const goToUserProfile = () =>
      NavigationService.push("OtherProfile", {
        profileId,
        priorRoute: NavigationService.getCurrentRoute()
      });
    const remove = () => this.props.onPressRemove(this.props.index);
    const {
      firstName,
      lastName,
      bio,
      username,
      avatarUri,
      profileId
    } = this.props;
    const source: ImageSourcePropType = avatarUri
      ? { uri: avatarUri }
      : Images.demoAvatar;
    const { followedBy, following } = this.state.relationship;
    return (
      <Surface
        style={[
          styles.container,
          { borderBottomColor: Colors.paleGrey, borderBottomWidth: 1 }
        ]}
      >
        <Avatar
          face={{ source, id: profileId }}
          circleSize={35}
          onPress={goToUserProfile}
        />
        <View style={styles.profileInfoContainer}>
          <TouchableWithoutFeedback onPress={goToUserProfile}>
            <Text
              style={styles.fullName}
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >
              {`${firstName} ${lastName}`}
            </Text>
            <Text
              style={styles.userName}
              numberOfLines={1}
              ellipsizeMode={"tail"}
            >{`@${username}`}</Text>
          </TouchableWithoutFeedback>
          <Text
            style={styles.bioLabel}
            numberOfLines={1}
            ellipsizeMode={"tail"}
          >
            {bio}
          </Text>
          <Text
            style={styles.followedBy}
            numberOfLines={1}
            ellipsizeMode={"tail"}
          >
            {followedBy || ""}
          </Text>
        </View>
        <View style={styles.actionButtonContainer}>
          <FollowButton
            loading={this.state.isFollowLoading}
            style={styles.followButton}
            onPress={this.handlePressFollow}
            followed={following}
          />
          <MaterialIcon
            style={styles.removeButton}
            name={"cancel"}
            color={Colors.charcoalGrey}
            size={Metrics.icons.small}
            onPress={remove}
          />
        </View>
      </Surface>
    );
  }

  private handlePressFollow = () => {
    const { following } = this.state.relationship;
    if (following === false) {
      this.followLoading(true);
      ApiClient.instance
        .createFollower(this.props.profileId)
        .then(result => {
          this.setState({
            relationship: { ...this.state.relationship, following: true },
            isFollowLoading: false
          });
        })
        .catch(error => error);
    } else {
      this.followLoading(true);
      ApiClient.instance
        .removeFollower(this.props.profileId)
        .then(result => {
          this.setState({
            relationship: { ...this.state.relationship, following: false },
            isFollowLoading: false
          });
        })
        .catch(error => error);
    }
  };
}

const styles = StyleSheet.create({
  // StyleSheet.create({
  container: {
    ...Layout.horizontalFlex,
    ...Layout.alignLeft,
    ...Layout.paddingDefault,
    borderBottomColor: Colors.paleGrey,
    borderBottomWidth: 1,
    marginLeft: 10,
    paddingTop: 30
  },
  profileInfoContainer: {
    ...Layout.verticalFlex,
    ...Layout.alignLeft,
    paddingLeft: 10,
    width: 205
  },
  image: {
    width: 70,
    height: 70,
    // borderStyle: 'solid',
    borderWidth: 1,
    borderColor: "#6a7074"
  },
  fullName: {
    ...Layout.textLeft,
    color: Colors.onyx,
    fontFamily: Fonts.type.medium,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500"
  },
  userName: {
    ...Layout.textLeft,
    color: Colors.charcoalGreyA350,
    fontFamily: "HelveticaNeue",
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "normal"
  },
  bioLabel: {
    ...Layout.textLeft,
    color: Colors.darkGrey,
    fontFamily: "HelveticaNeue",
    fontSize: 11,
    fontStyle: "normal",
    fontWeight: "normal",
    marginTop: 6
  },
  followedBy: {
    ...Layout.textLeft,
    color: Colors.darkGrey,
    fontFamily: "HelveticaNeue",
    fontSize: 11,
    fontStyle: "normal",
    fontWeight: "normal"
  },
  actionButtonContainer: {
    ...Layout.verticalFlex,
    alignItems: "center",
    height: 75,
    justifyContent: "center",
    width: 150
  },
  followButton: {
    height: 29.1,
    width: 88.2,
    ...Layout.alignCentered
  },
  removeButton: {
    marginTop: 10
  }
});

export default SuggestedUserCard;
