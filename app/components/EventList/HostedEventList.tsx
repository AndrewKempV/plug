import React, { Component } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleProp,
  View,
  ViewStyle
} from "react-native";
import { EventModel } from "../../api/profile";
import { HostedEventCard } from "../../components/EventCard";
import Metrics from "../../config/metrics";
import styles from "./styles";
interface FavoriteEventListProps {
  profileId?: string;
  containerStyle?: StyleProp<ViewStyle>;
  events: EventModel[];
}

interface FavoriteEventListState {
  loading: boolean;
}

class FavoriteEventList extends Component<
  FavoriteEventListProps,
  FavoriteEventListState
> {
  public render() {
    const { events } = this.props;
    return (
      <View style={this.props.containerStyle}>
        <FlatList
          style={styles.list}
          keyExtractor={(item, index) => index.toString()}
          data={events}
          renderItem={this.renderEventCard}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
        />
      </View>
    );
  }

  private renderEventCard({ item, index }: ListRenderItemInfo<EventModel>) {
    return (
      <HostedEventCard
        eventName={item.eventName || ""}
        eventVenue={item.venueName || ""}
        imageUri={item.primaryImageUrl || ""}
        startTime={item.eventStartTime || ""}
        endTime={item.eventEndTime || ""}
        startDate={"24 July"}
      />
    );
  }
}

export default FavoriteEventList;
