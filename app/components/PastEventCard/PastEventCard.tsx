import React, { PureComponent } from "react";
import { Image, Text, View } from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import { ApiClient } from "../../api/client";
import { UserRelationshipModel } from "../../api/profile";
import Metrics from "../../config/metrics";
import { Colors } from "../../config/styles";
import Avatar from "../Avatar";
import { BetterButton, IconButton } from "../Button";
import { Surface } from "../Typings/Surface";
import styles from "./styles";

interface PastEventCardProps {
  eventImageUrl: string;
  eventName: string;
  eventVenue: string;
  eventId: string;
  eventHost: string;
  eventHostId: string;
  eventHostImageUrl: string;
}

interface PastEventCardState {
  favorited: boolean;
  relationship: UserRelationshipModel;
}

const initialState: PastEventCardState = {
  favorited: true,
  relationship: { followedBy: false, following: false, blocked: false }
};

class PastEventCard extends PureComponent<
  PastEventCardProps,
  PastEventCardState
> {
  public readonly state: PastEventCardState = initialState;

  public componentDidMount() {
    ApiClient.instance
      .getRelationship(this.props.eventHostId)
      .then(result => {
        if (result.data.data) {
          const relationship = result.data.data.pop()!;
          this.setState({ relationship });
        }
      })
      .catch(error => error);
  }

  public render() {
    const {
      eventImageUrl,
      eventName,
      eventVenue,
      eventId,
      eventHost,
      eventHostId,
      eventHostImageUrl
    } = this.props;
    const eventSource = { uri: eventImageUrl };
    const hostSource = { uri: eventHostImageUrl };
    return (
      <Surface style={styles.container}>
        <Image style={styles.image} source={eventSource} />
        <View style={styles.eventInfoContainer}>
          <Text
            style={styles.eventName}
            numberOfLines={1}
            ellipsizeMode={"tail"}
          >
            {eventName}
          </Text>
          <Text
            style={styles.eventVenue}
            numberOfLines={1}
            ellipsizeMode={"tail"}
          >
            {eventVenue}
          </Text>
          <View style={styles.hostContainer}>
            <Avatar face={{ source: hostSource }} circleSize={19} />
            <View style={styles.hostLabelContainer}>
              <Text
                style={styles.hostLabel}
                numberOfLines={1}
                ellipsizeMode={"tail"}
              >
                {"Host:"}
              </Text>
              <Text
                style={styles.hostNameLabel}
                numberOfLines={1}
                ellipsizeMode={"tail"}
              >{`@${eventHost}`}</Text>
            </View>
            <BetterButton
              style={styles.followButtonContainer}
              iconStyle={styles.followIcon}
              iconName={
                this.state.relationship.following ? "following" : "follow"
              }
              iconColor={Colors.burgundy}
              iconSize={16.5}
              onPress={this.handlePressFollow}
            />
          </View>
        </View>
      </Surface>
    );
  }

  private handlePressFollow = () => {
    const { following } = this.state.relationship;
    if (following === false) {
      ApiClient.instance
        .createFollower(this.props.eventHostId)
        .then(result => {
          this.setState({
            relationship: { ...this.state.relationship, following: true }
          });
        })
        .catch(error => error);
    } else {
      ApiClient.instance
        .removeFollower(this.props.eventHostId)
        .then(result => {
          this.setState({
            relationship: { ...this.state.relationship, following: false }
          });
        })
        .catch(error => error);
    }
  };
}

export default PastEventCard;
