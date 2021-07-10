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
import FavoriteEventCard from "../../components/FavoriteEventCard";
import styles from "./styles";
interface FavoriteEventListProps {
  profileId?: string;
  containerStyle?: StyleProp<ViewStyle>;
  events: EventModel[];
  self?: boolean;
}

interface FavoriteEventListState {
  loading: boolean;
  events: EventModel[];
}

const initialState: FavoriteEventListState = {
  loading: false,
  events: []
};

class FavoriteEventList extends Component<
  FavoriteEventListProps,
  FavoriteEventListState
> {
  public readonly state = initialState;

  public componentDidMount() {
    const { events } = this.props;
    this.setState({ events });
  }

  public componentWillReceiveProps(nextProps: FavoriteEventListProps) {
    const { events } = nextProps;
    this.setState({ events });
  }

  public render() {
    const { containerStyle } = this.props;
    return (
      <View style={containerStyle}>
        <FlatList
          style={styles.list}
          keyExtractor={this.extractKey}
          data={this.state.events}
          renderItem={this.renderEventCard}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
        />
      </View>
    );
  }

  private renderEventCard = ({
    item,
    index
  }: ListRenderItemInfo<EventModel>) => {
    const { self } = this.props;
    return (
      <FavoriteEventCard
        event={item}
        onRemove={
          self ? () => this.handleRemove(index, item.eventId!) : undefined
        }
      />
    );
  };

  private extractKey = (item: EventModel, index: number) => item.eventId!;

  private handleRemove = (index: number, id: string) => {
    console.log(index);
    const start = this.state.events.slice(0, index);
    const end = this.state.events.slice(index + 1);
    this.setState({
      events: start.concat(end)
    });
  };
}

export default FavoriteEventList;
