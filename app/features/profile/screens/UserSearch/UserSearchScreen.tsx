import _ from "lodash";
import React, { Component } from "react";
import {
  Alert,
  FlatList,
  Image,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
  StatusBar
} from "react-native";
import { Divider, ListItem, SocialIcon } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { NavigationScreenProps, NavigationEvents } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ApiClient } from "../../../../api/client";
import { UserProfileModel } from "../../../../api/profile";
import Images from "../../../../assets/images";
import { BackButton } from "../../../../components/Button";
import SearchBar from "../../../../components/SearchBar";
import SuggestedUserCard, {
  SuggestedUserCardProps
} from "../../../../components/SuggestedUserCard";
import { Colors } from "../../../../config/styles";
import { GetPropsFromDispatch } from "../../../../store/ActionCreators";
import AppActions from "../../../../store/AppActions";
import { StateStore } from "../../../../store/AppReducer";
import strings from "./strings";
import styles from "./styles";
import NavigationService from "app/utils/NavigationService";

type TBindActionCreators = typeof AppActions;

type StateFromDispatch = ReturnType<typeof mapStateToProps>;

type PropsFromDispatch = GetPropsFromDispatch<TBindActionCreators>;

const mapStateToProps = (state: StateStore) => ({
  suggestions: state.profileReducer.suggestions
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<TBindActionCreators, PropsFromDispatch>(
    AppActions,
    dispatch
  );

type ReduxProps = StateFromDispatch & PropsFromDispatch;
type ConnectedScreenProps = ReduxProps & NavigationScreenProps;

type UserSearchScreenProps = ConnectedScreenProps;

interface UserSearchScreenState {
  offset: number;
}

const initialState: UserSearchScreenState = {
  offset: 0
};

class UserSearchScreen extends Component<
  UserSearchScreenProps,
  UserSearchScreenState
> {
  public static navigationOptions = () => {
    return {
      headerLeft: null,
      header: null
    };
  };
  public readonly state: UserSearchScreenState = initialState;

  public componentDidMount() {
    this.props.getSuggestedUsers({ limit: 50 });
  }

  public render() {
    const { suggestions } = this.props;
    return (
      <View style={styles.container}>
        {this.renderSearchBar()}
        <View style={styles.contentContainer}>
          <ListItem
            contentContainerStyle={styles.facebookListItem}
            chevron={chevronProps}
            leftIcon={<Image source={Images.facebookLogo} />}
            title={"Find facebook friends"}
            onPress={() => Alert.alert("Accessing your facebook friend list")}
          />
          <Divider style={styles.divider} />
          <Text style={styles.sectionLabel}>{"Friend suggestions"}</Text>
          <View style={styles.listContainer}>
            <FlatList
              renderItem={this.renderSuggestedUser}
              data={suggestions}
              extraData={this.state}
              keyExtractor={(item, index) => String(item.userProfileId)}
            />
          </View>
        </View>
        <NavigationEvents onWillFocus={this.refresh} />
      </View>
    );
  }

  private renderSuggestedUser = ({
    item,
    index
  }: ListRenderItemInfo<UserProfileModel>) => {
    return (
      <SuggestedUserCard
        profileId={item.userProfileId!}
        firstName={item.firstName!}
        lastName={item.lastName!}
        bio={item.bio!}
        username={item.username!}
        avatarUri={item.profileImageUrl!}
        onPressRemove={this.remove}
      />
    );
  };

  private renderSearchBar() {
    return (
      <View style={styles.headerContainer}>
        <BackButton
          color={Colors.snow}
          borderColor={Colors.snow}
          onPress={this.goBack}
        />
        <SearchBar
          inputStyle={styles.searchBarInput}
          placeholder={strings.searchBarPlaceholder}
          hasCancel={false}
          animated={false}
        />
      </View>
    );
  }

  private remove = (index: number) => {};

  private goBack = () => {
    NavigationService.navigate("Profile");
  };

  private refresh = () => {
    StatusBar.setBarStyle("light-content", true);
    this.props.getSuggestedUsers({ limit: 50 });
  };
}

const chevronProps = {
  size: 15,
  color: Colors.charcoalGrey
};

export default connect<StateFromDispatch, PropsFromDispatch, {}, StateStore>(
  mapStateToProps,
  mapDispatchToProps
)(UserSearchScreen);
