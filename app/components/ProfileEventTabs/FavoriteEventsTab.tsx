import _ from "lodash";
import React, { Component } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from "react-native";
import { Divider } from "react-native-elements";
import { bindActionCreators, Dispatch } from "redux";
import { ApiClient } from "../../api/client";
import { EventModel, UserProfileModel } from "../../api/profile";
import { Colors, Fonts, Layout } from "../../config/styles";
import { GetPropsFromDispatch } from "../../store/ActionCreators";
import AppActions from "../../store/AppActions";
import { StateStore } from "../../store/AppReducer";
import ChipCollection from "../ChipCollection";
import EmptyEventPlaceholder from "../EventCard/EmptyEventPlaceholder";
import { FavoriteEventList } from "../EventList";
import { MiniSuggestedUserCard } from "../SuggestedUserCard";

type TBindActionCreators = typeof AppActions;

type StateFromDispatch = ReturnType<typeof mapStateToProps>;

type PropsFromDispatch = GetPropsFromDispatch<TBindActionCreators>;

const mapStateToProps = (state: StateStore) => ({
  AuthState: state.authReducer,
  ProfileState: state.profileReducer
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<TBindActionCreators, PropsFromDispatch>(
    AppActions,
    dispatch
  );

type ReduxProps = StateFromDispatch & PropsFromDispatch;

interface FavoriteEventsTabProps {
  profile: UserProfileModel;
  self: boolean;
  events?: EventModel[];
  suggestions?: UserProfileModel[];
  listContainer?: StyleProp<ViewStyle>;
}

interface FavoriteEventsTabState {
  events: EventModel[];
}

const initialState: FavoriteEventsTabState = {
  events: []
};

class FavoriteEventsTab extends Component<
  FavoriteEventsTabProps,
  FavoriteEventsTabState
> {
  public static defaultProps: FavoriteEventsTabProps = {
    self: true,
    profile: {},
    events: []
  };

  public readonly state: FavoriteEventsTabState = initialState;

  public componentDidMount() {
    this.updateEvents();
  }

  public render() {
    const { profile, listContainer, self } = this.props;
    const { events } = !_.isEmpty(this.props.events) ? this.props : this.state;
    if (events!.length === 0) {
      return (
        <View style={Layout.container}>
          <View style={[styles.container, { maxHeight: 100 }]}>
            <EmptyEventPlaceholder
              title={"No favorite events yet"}
              content={
                this.props.self
                  ? "Tap the heart icon on an event to save it here."
                  : `When @${profile.username} has favorite events, you’ll see them here`
              }
            />
          </View>
          <Divider style={styles.divider} />
          {this.props.self
            ? this.renderEventTags()
            : this.renderFriendSuggestions()}
        </View>
      );
    } else {
      return (
        <View style={[styles.listContainer, listContainer]}>
          <FavoriteEventList
            self={self}
            events={events!}
            containerStyle={listContainer}
          />
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

  private updateEvents = () => {
    ApiClient.instance
      .getFavoriteEventsForUser({
        offset: 0,
        limit: 20,
        userProfileId: this.props.profile.userProfileId!
      })
      .then(events => {
        if (events) {
          this.setState({ events });
        }
      })
      .catch(error => error);
  };
}

const styles = StyleSheet.create({
  container: {
    ...Layout.container,
    backgroundColor: Colors.snow,
    paddingLeft: 10,
    paddingRight: 15
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

export default FavoriteEventsTab;
