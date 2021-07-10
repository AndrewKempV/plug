import _ from "lodash";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ListRenderItemInfo
} from "react-native";
import { Divider } from "react-native-elements";
import { ApiClient } from "../../api/client";
import { EventModel, UserProfileModel } from "../../api/profile";
import Fonts from "../../config/Fonts";
import { Colors, Layout } from "../../config/styles";
import ChipCollection from "../ChipCollection";
import EmptyEventPlaceholder from "../EventCard/EmptyEventPlaceholder";
import PastEventList from "../EventList/PastEventList";
import { MiniSuggestedUserCard } from "../SuggestedUserCard";

interface EventHostPair {
  event: EventModel;
  host: UserProfileModel;
}
interface PastEventsTabProps {
  profile?: UserProfileModel;
  self?: boolean;
  suggestions?: UserProfileModel[];
}

interface PastEventsTabState {
  events: EventModel[];
  hosts: UserProfileModel[];
  EventToHostMap: EventHostPair[];
}

const initialState: PastEventsTabState = {
  events: [],
  hosts: [],
  EventToHostMap: []
};

class PastEventsTab extends Component<PastEventsTabProps, PastEventsTabState> {
  public readonly state: PastEventsTabState = initialState;

  public componentDidMount() {
    this.updateEvents();
  }

  public render() {
    const { profile } = this.props;
    const { EventToHostMap } = this.state;
    const { events, hosts } = this.state;
    if (_.isEmpty(EventToHostMap)) {
      return (
        <View style={Layout.container}>
          <View style={[styles.container, { maxHeight: 100 }]}>
            <EmptyEventPlaceholder
              title={"No past events yet"}
              content={
                this.props.self
                  ? "RSVP or buy tickets to an event. We’ll show that history here."
                  : `Events @${profile!.username ||
                      "this user"} got tickets to in the past will be shown here`
              }
            />
          </View>
          <Divider style={{ height: 7, backgroundColor: Colors.paleGrey }} />
          {this.props.self
            ? this.renderEventTags()
            : this.renderFriendSuggestions()}
        </View>
      );
    } else {
      return (
        <View style={styles.listContainer}>
          <PastEventList EventToHostMap={EventToHostMap} />
        </View>
      );
    }
  }

  private renderEventTags = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.taggedEventsTitle}>{"Show me events for..."}</Text>
        <ChipCollection />
      </View>
    );
  };

  private renderFriendSuggestions = () => {
    const suggestions = this.props.suggestions!;
    return (
      <View style={styles.container}>
        <Text style={styles.taggedEventsTitle}>{"Who to follow"}</Text>
        <FlatList
          data={suggestions}
          renderItem={this.renderSuggestedUser}
          keyExtractor={(item, index) => String(item.userProfileId)}
          horizontal={true}
        />
      </View>
    );
  };

  private renderSuggestedUser = ({
    item,
    index
  }: ListRenderItemInfo<UserProfileModel>) => {
    return (
      <MiniSuggestedUserCard
        profileId={item.userProfileId!}
        firstName={item.firstName!}
        lastName={item.lastName!}
        username={item.username!}
        avatarUri={item.profileImageUrl!}
      />
    );
  };

  private async updateEvents() {
    const { userProfileId } = this.props.profile!;
    return await new Promise((resolve, reject) =>
      ApiClient.instance
        .getPastEventsForUser({
          offset: 0,
          limit: 20,
          userProfileId: userProfileId!
        })
        .then(response => {
          // console.log(response);
          if (response.data.data) {
            const events = response.data.data;
            this.setState({ events });
            events.forEach((value, index) => {
              if (!_.isNil(value) && !_.isNil(value.ownerUserProfileId)) {
                ApiClient.instance
                  .getUserProfile(value.ownerUserProfileId!)
                  .then(host => {
                    if (!_.isNil(host.data.data)) {
                      const eventHost = host.data.data.pop()!;
                      const pair: EventHostPair = {
                        event: value,
                        host: eventHost
                      };
                      this.setState({
                        events,
                        hosts: [...this.state.hosts, eventHost],
                        EventToHostMap: [...this.state.EventToHostMap, pair]
                      });
                      // console.log(this.state);
                    }
                  })
                  .catch(error => error);
              }
            });
            resolve();
          }
        })
        .catch(error => error)
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Layout.container,
    backgroundColor: Colors.snow,
    paddingLeft: 15,
    paddingRight: 15
  },
  listContainer: {
    ...Layout.container,
    backgroundColor: Colors.snow
  },
  taggedEventsTitle: {
    color: Colors.darkGrey,
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.input,
    fontStyle: "normal",
    fontWeight: "bold",
    marginBottom: 15,
    paddingTop: 10,
    textAlign: "left"
  }
});

export default PastEventsTab;
