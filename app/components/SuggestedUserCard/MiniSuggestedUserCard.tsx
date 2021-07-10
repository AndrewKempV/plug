import React, { PureComponent } from "react";
import { ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import { ApiClient } from "../../api/client";
import { UserRelationshipModel } from "../../api/profile";
import Images from "../../assets/images";
import { Colors, Fonts, Layout } from "../../config/styles";
import Avatar from "../Avatar";
import { FollowButton } from "../Button";
import { Surface } from "../Typings/Surface";
import NavigationService from "app/utils/NavigationService";

interface MiniSuggestedUserCardProps {
  profileId: string;
  avatarUri: string;
  firstName: string;
  lastName: string;
  username: string;
}

interface MiniSuggestedUserCardState {
  relationship: UserRelationshipModel;
}

const initialState: MiniSuggestedUserCardState = {
  relationship: { following: false }
};

class MiniSuggestedUserCard extends PureComponent<
  MiniSuggestedUserCardProps,
  MiniSuggestedUserCardState
> {
  public readonly state = initialState;

  public componentDidMount() {
    ApiClient.instance
      .getRelationship(this.props.profileId)
      .then(result => {
        if (result.data.data) {
          const relationship = result.data.data.pop()!;
          this.setState({ relationship });
        }
      })
      .catch(error => error);
  }

  public render() {
    const { firstName, lastName, username, avatarUri, profileId } = this.props;
    const source: ImageSourcePropType = avatarUri
      ? { uri: avatarUri }
      : Images.demoAvatar;
    const { following } = this.state.relationship;
    const goToOtherProfile = () =>
      NavigationService.push("OtherProfile", {
        profileId,
        priorRoute: NavigationService.getCurrentRoute()
      });
    return (
      <Surface style={styles.container}>
        <Avatar
          face={{ source, id: profileId }}
          circleSize={35}
          onPress={goToOtherProfile}
        />
        <View style={styles.profileInfoContainer}>
          <Text
            style={styles.fullName}
            numberOfLines={1}
            ellipsizeMode={"tail"}
            onPress={goToOtherProfile}
          >
            {`${firstName} ${lastName}`}
          </Text>
          <Text
            style={styles.userName}
            numberOfLines={1}
            ellipsizeMode={"tail"}
          >{`@${username}`}</Text>
          <FollowButton
            style={styles.followButton}
            onPress={this.handlePressFollow}
            followed={following}
          />
        </View>
      </Surface>
    );
  }

  private handlePressFollow = () => {
    const { following } = this.state.relationship;
    if (following === false) {
      ApiClient.instance
        .createFollower(this.props.profileId)
        .then(() => {
          this.setState({
            relationship: { ...this.state.relationship, following: true }
          });
        })
        .catch(error => error);
    } else {
      ApiClient.instance
        .removeFollower(this.props.profileId)
        .then(() => {
          this.setState({
            relationship: { ...this.state.relationship, following: false }
          });
        })
        .catch(error => error);
    }
  };
}

export default MiniSuggestedUserCard;

const styles = StyleSheet.create({
  container: {
    ...Layout.horizontalFlex,
    ...Layout.alignLeft,
    ...Layout.paddingDefault
  },
  followButton: {
    ...Layout.alignCentered,
    height: 29.1,
    marginTop: 5,
    width: 88.2
  },
  fullName: {
    ...Layout.textLeft,
    color: Colors.onyx,
    fontFamily: Fonts.type.medium,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500"
  },
  image: {
    width: 70,
    height: 70,
    // borderStyle: 'solid',
    borderWidth: 1,
    borderColor: "#6a7074"
  },
  profileInfoContainer: {
    ...Layout.verticalFlex,
    ...Layout.alignLeft,
    paddingLeft: 10,
    width: 150
  },
  userName: {
    ...Layout.textLeft,
    color: Colors.charcoalGreyA350,
    fontFamily: "HelveticaNeue",
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "normal"
  }
});
