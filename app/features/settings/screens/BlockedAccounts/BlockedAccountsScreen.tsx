import React, { Component } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Header } from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ApiClient } from "../../../../api/client";
import { UserProfileModel } from "../../../../api/profile";
import BlockedUserCard from "../../../../components/BlockedUserCard";
import { BackButton } from "../../../../components/Button";
import { Colors, Layout } from "../../../../config/styles";
import { GetPropsFromDispatch } from "../../../../store/ActionCreators";
import AppActions from "../../../../store/AppActions";
import { StateStore } from "../../../../store/AppReducer";
import styles from "./styles";
import NavigationService from "app/utils/NavigationService";

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
type ConnectedScreenProps = ReduxProps;

interface BlockedAccountsScreenState {
  blocked: UserProfileModel[];
}

const initialState: BlockedAccountsScreenState = {
  blocked: []
};

class BlockedAccountsScreen extends Component<
  ConnectedScreenProps,
  BlockedAccountsScreenState
> {
  public static navigationOptions = () => {
    return {
      headerLeft: null,
      header: null
    };
  };

  public readonly state: BlockedAccountsScreenState = initialState;

  public async componentDidMount() {
    const { blocked } = this.props.ProfileState;
    blocked.forEach(profileId => {
      ApiClient.instance
        .getUserProfile(profileId)
        .then(response => {
          const profile = response.data.data!.pop()!;
          this.setState(prevState => ({
            blocked: [...prevState.blocked, profile]
          }));
        })
        .catch(error => error);
    });
  }

  public render() {
    return (
      <View style={styles.container}>
        <View>
          <Header
            backgroundColor={Colors.snow}
            leftComponent={<BackButton onPress={this.goBack} />}
            centerComponent={
              <Text style={styles.screenTitle}>{"Blocked accounts"}</Text>
            }
          />
        </View>
        <View style={styles.listContainer}>
          <FlatList
            renderItem={this.renderBlockedUser}
            data={this.state.blocked}
            extraData={this.state}
            keyExtractor={(item, index) => String(item.userProfileId)}
          />
        </View>
      </View>
    );
  }

  private renderBlockedUser = ({
    item,
    index
  }: ListRenderItemInfo<UserProfileModel>) => {
    return (
      <BlockedUserCard
        profileId={item.userProfileId!}
        firstName={item.firstName!}
        lastName={item.lastName!}
        bio={item.bio!}
        username={item.username!}
        avatarUri={item.profileImageUrl!}
      />
    );
  };

  private goBack = () => {
    NavigationService.navigate("Settings");
  };
}

export default connect<StateFromDispatch, PropsFromDispatch, {}, StateStore>(
  mapStateToProps,
  mapDispatchToProps
)(BlockedAccountsScreen);
