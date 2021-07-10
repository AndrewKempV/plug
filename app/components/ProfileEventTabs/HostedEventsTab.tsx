import _ from "lodash";
import React, { Component } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle
} from "react-native";
import { Divider } from "react-native-elements";
import { ApiClient } from "../../api/client";
import { EventModel, UserProfileModel } from "../../api/profile";
import { Colors, Fonts, Layout } from "../../config/styles";
import LayoutDebugger from "../../utils/LayoutDebugger";
import EmptyEventPlaceholder from "../EventCard/EmptyEventPlaceholder";
import { FavoriteEventList } from "../EventList";
import { MiniSuggestedUserCard } from "../SuggestedUserCard";
import NavigationService from "utils/NavigationService";
interface EventsTabProps {
  profile: UserProfileModel;
  events?: EventModel[];
  suggestions?: UserProfileModel[];
  self?: boolean;
  listContainer?: StyleProp<ViewStyle>;
}

interface EventsTabState {
  events: EventModel[];
}

const initialState: EventsTabState = {
  events: []
};

class HostedEventsTab extends Component<EventsTabProps, EventsTabState> {
  public readonly state = initialState;

  public componentDidMount() {
    this.updateEvents();
  }

  public render() {
    const { events } = this.state;
    const { profile, self } = this.props;
    if (_.isEmpty(this.state.events)) {
      return (
        <View style={Layout.container}>
          <View style={[styles.container, { maxHeight: 100 }]}>
            <EmptyEventPlaceholder
              title={self ? "No created events yet" : "No created events"}
              content={
                self
                  ? "Create and manage events, sell tickets and get analytics. Your events appear here."
                  : `@${profile!.username ||
                      "This user"} has not created an event`
              }
            />
          </View>
          {!this.props.self && <Divider style={styles.divider} />}
          {this.props.self
            ? this.renderCreateEventSection()
            : this.renderFriendSuggestions()}
        </View>
      );
    } else {
      return (
        <View style={[styles.listContainer, this.props.listContainer]}>
          <FavoriteEventList
            containerStyle={this.props.listContainer}
            events={events}
          />
        </View>
      );
    }
  }

  private renderCreateEventSection = () => {
    return (
      <View style={styles.createEventContainer}>
        <View style={styles.createEventLabelContainer}>
          <Text
            onPress={() => NavigationService.navigate("CreateEvent")}
            style={styles.createEventLabel}
          >
            {"Create event"}
          </Text>
        </View>
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

  private updateEvents = () => {
    ApiClient.instance
      .getHostedEventsForUser({
        offset: 0,
        limit: 20,
        userProfileId: this.props.profile.userProfileId!
      })
      .then(result => {
        console.log(result);
        if (result.data.data) {
          this.setState({ events: result.data.data });
        }
      })
      .then(() => {
        if (this.state.events.length === 0) {
          this.setState({ events: [] });
        }
      })
      .catch(error => error);
  };
}

const styles = StyleSheet.create({
  container: {
    ...Layout.container,
    backgroundColor: Colors.snow,
    paddingLeft: 10
  },
  createEventContainer: {
    ...Layout.container,
    ...Layout.alignCentered
  },
  createEventLabel: {
    ...Layout.textLeft,
    color: Colors.burgundy,
    fontFamily: "HelveticaNeue",
    fontSize: 17,
    fontStyle: "normal",
    fontWeight: "500",
    height: 21,
    marginBottom: 30,
    width: 100
  },
  createEventLabelContainer: {
    ...Layout.alignCentered
  },
  divider: {
    backgroundColor: Colors.paleGrey,
    height: 7
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

export default HostedEventsTab;
