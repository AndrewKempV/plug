import _ from "lodash";
import React from "react";
import { View } from "react-native";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { FullUserProfileModel } from "../../../../api/profile";
import ProfileEditor from "../../../../components/ProfileEditor/ProfileEditor";
import { GetPropsFromDispatch } from "../../../../store/ActionCreators";
import AppActions from "../../../../store/AppActions";
import { StateStore } from "../../../../store/AppReducer";

type ActionCreatorProps = typeof AppActions;

type StateFromDispatch = ReturnType<typeof mapStateToProps>;

type PropsFromDispatch = GetPropsFromDispatch<ActionCreatorProps>;

const mapStateToProps = (state: StateStore) => ({
  AuthState: state.authReducer,
  ProfileState: state.profileReducer
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<ActionCreatorProps, PropsFromDispatch>(
    AppActions,
    dispatch
  );

type ReduxProps = StateFromDispatch & PropsFromDispatch;
type EditProfileScreenProps = ReduxProps & NavigationScreenProps;
interface EditProfileScreenState {
  profile: FullUserProfileModel;
}
class EditProfileScreen extends React.Component<
  EditProfileScreenProps,
  EditProfileScreenState
> {
  public static navigationOptions = () => {
    return {
      headerTitle: null,
      headerRight: null,
      header: null,
      headerLeft: null,
      headerTransparent: true
    };
  };

  public readonly state: EditProfileScreenState = { profile: {} };

  public render() {
    const {
      firstName,
      lastName,
      username,
      websiteUrl,
      bio,
      phoneNumber,
      gender,
      profileImageUrl
    } = this.props.ProfileState.profile;
    return (
      <View>
        <ProfileEditor
          firstName={firstName || ""}
          lastName={lastName || ""}
          username={username || ""}
          website={websiteUrl || ""}
          bio={bio || ""}
          phone={phoneNumber || ""}
          gender={gender || ""}
          email={""}
          profileUri={profileImageUrl || ""}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

export default connect<StateFromDispatch, PropsFromDispatch, {}, StateStore>(
  mapStateToProps,
  mapDispatchToProps
)(EditProfileScreen);
