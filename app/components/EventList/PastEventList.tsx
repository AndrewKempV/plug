import React, { Component } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleProp,
  View,
  ViewStyle
} from "react-native";
import { EventModel, UserProfileModel } from "../../api/profile";
import { HostedEventCard } from "../../components/EventCard";
import Metrics from "../../config/metrics";
import PastEventCard from "../PastEventCard";
import styles from "./styles";
interface EventHostPair {
  event: EventModel;
  host: UserProfileModel;
}

interface PastEventListProps {
  profileId?: string;
  containerStyle?: StyleProp<ViewStyle>;
  EventToHostMap: EventHostPair[];
}

interface PastEventListState {
  loading: boolean;
}

class PastEventList extends Component<PastEventListProps, PastEventListState> {
  public render() {
    const { EventToHostMap } = this.props;
    return (
      <View style={this.props.containerStyle}>
        <FlatList
          style={styles.list}
          keyExtractor={(item, index) => index.toString()}
          data={EventToHostMap}
          renderItem={this.renderEventCard}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
        />
      </View>
    );
  }

  private renderEventCard({ item, index }: ListRenderItemInfo<EventHostPair>) {
    const { event, host } = item;
    return (
      <PastEventCard
        eventName={event.eventName || ""}
        eventVenue={event.venueName || ""}
        eventImageUrl={event.primaryImageUrl || ""}
        eventId={event.eventId || ""}
        eventHostId={event.ownerUserProfileId || ""}
        eventHost={host.username || ""}
        eventHostImageUrl={host.profileImageUrl || ""}
      />
    );
  }
}

export default PastEventList;
