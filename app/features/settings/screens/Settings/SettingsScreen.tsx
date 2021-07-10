import _ from "lodash";
import React, { Component } from "react";
import { StyleSheet, Switch, Text, View, StatusBar } from "react-native";
import { Divider, Header, ListItem } from "react-native-elements";
import Permissions, { Status } from "react-native-permissions";
import {
  FlatList,
  NavigationEvents,
  NavigationScreenProps
} from "react-navigation";
import { bindActionCreators, Dispatch } from "redux";
import AuthApi from "../../../../api/auth";
import { BackButton } from "../../../../components/Button";
import Icon from "../../../../components/Icon";
import { Colors, Fonts, Layout } from "../../../../config/styles";
import { IUser } from "../../../../models/IUser";
import { GetPropsFromDispatch } from "../../../../store/ActionCreators";
import AppActions from "../../../../store/AppActions";
import { StateStore } from "../../../../store/AppReducer";
import { MapboxLocation } from "../../../../utils/MapboxService";
import Storage from "../../../../utils/storage";
import { MenuItem } from "../Menu/MenuScreen";
import { connect } from "react-redux";
import NavigationService from "app/utils/NavigationService";

type ActionCreators = typeof AppActions;
type StateFromDispatch = ReturnType<typeof mapStateToProps>;
type PropsFromDispatch = GetPropsFromDispatch<ActionCreators>;
type ReduxProps = StateFromDispatch & PropsFromDispatch;
type SettingsScreenProps = ReduxProps & NavigationScreenProps;

const mapStateToProps = (state: StateStore) => ({
  AuthState: state.authReducer
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<ActionCreators, PropsFromDispatch>(AppActions, dispatch);

const initVars = {
  username: "",
  password: ""
};

const initAttrs = {
  preferred_username: "",
  given_name: "",
  family_name: "",
  gender: "",
  phone: "",
  email: "",
  phone_number: ""
};

const cognitoUser = {
  auth: initVars,
  attributes: initAttrs
};

interface SettingsScreenState {
  user: IUser;
  location: MapboxLocation | null;
  email: string;
  contactsPermission: Status | string;
  pushNotificationPermission: Status | string;
  privateAccountEnabled: boolean;
}

const initialState: SettingsScreenState = {
  user: cognitoUser,
  email: "",
  contactsPermission: "undetermined",
  pushNotificationPermission: "undetermined",
  privateAccountEnabled: false,
  location: null
};

class SettingsScreen extends React.Component<
  SettingsScreenProps,
  SettingsScreenState
> {
  public static navigationOptions = () => {
    return {
      headerLeft: null,
      header: null
    };
  };

  public readonly state: SettingsScreenState = initialState;

  public async componentDidMount() {
    await this.onLoad();
  }

  public render() {
    return (
      <View style={styles.container}>
        <View>
          <Header
            style={styles.headerContainer}
            backgroundColor={Colors.snow}
            leftComponent={<BackButton onPress={this.goBack} />}
            centerComponent={
              <Text style={styles.screenTitle}>{"Settings"}</Text>
            }
          />
        </View>
        <Text style={styles.sectionTitle}>{"Account settings"}</Text>
        <ListItem
          title={"Email"}
          subtitle={<Text style={styles.subTitle}>{this.state.email}</Text>}
          chevron={chevronProps}
          onPress={() => NavigationService.navigate("ChangeEmail")}
        />
        <ListItem
          title={"Primary city"}
          subtitle={
            <Text style={styles.subTitle}>
              {this.state.location ? this.state.location.text : ""}
            </Text>
          }
          chevron={chevronProps}
          onPress={() =>
            NavigationService.navigate("ChangeLocation", {
              fromRoute: "Settings"
            })
          }
        />
        <ListItem
          title={"Allow push notifications"}
          rightElement={
            <Switch
              style={styles.switchContainer}
              onTintColor={Colors.purplishRed}
              onValueChange={this.handleToggleNotificationPermission}
              value={this.state.pushNotificationPermission === "authorized"}
            />
          }
        />
        <Divider style={styles.divider} />
        <Text style={styles.sectionTitle}>{"Privacy and security"}</Text>
        <ListItem
          title={"Password"}
          subtitle={
            <Text style={styles.changePasswordSubtitle}>
              {"Change password"}
            </Text>
          }
          chevron={chevronProps}
          onPress={() => NavigationService.navigate("ChangePassword")}
        />
        <ListItem
          title={"Blocked accounts"}
          chevron={chevronProps}
          onPress={() => NavigationService.navigate("BlockedAccounts")}
        />
        <ListItem
          title={"Allow access to my contacts"}
          rightElement={
            <Switch
              style={styles.switchContainer}
              onTintColor={Colors.purplishRed}
              value={this.state.contactsPermission === "authorized"}
              onValueChange={this.handleToggleContactPermission}
            />
          }
        />
        <ListItem
          title={"Private account"}
          rightElement={
            <Switch
              style={styles.switchContainer}
              onTintColor={Colors.purplishRed}
              onValueChange={this.handleTogglePrivateAccount}
              value={this.state.privateAccountEnabled}
            />
          }
        />
        <NavigationEvents onWillFocus={() => this.onLoad()} />
      </View>
    );
  }

  private onLoad = async () => {
    StatusBar.setBarStyle("dark-content", true);
    try {
      await this.SetEmail();
      await this.SetHomeLocation();
      await this.SetPermissions();
      this.props.getBlockedUsers({ limit: 20, offset: 0 });
    } catch (error) {
      throw error;
    }
  };

  private async SetEmail() {
    const attributes = await AuthApi.getAttributes();
    if (!_.isNil(attributes) && attributes.length >= 6) {
      const attr = attributes.find(attr => attr.Name === "email");
      if (attr) {
        const email = attr.Value;
        this.setState({ email });
      }
    }
  }

  private async SetHomeLocation() {
    const location = await Storage.getHomeLocation();
    this.setState({ location });
  }

  private async SetPermissions() {
    const response = await Permissions.checkMultiple([
      "contacts",
      "notification"
    ]);
    this.setState({
      contactsPermission: response.contacts,
      pushNotificationPermission: response.notification
    });
  }

  private handleToggleNotificationPermission = (enable: boolean) => {
    if (!enable) {
      Permissions.openSettings()
        .then(result => console.log(result))
        .catch(error => error);
    } else {
      Permissions.request("notification")
        .then(response => {
          if (
            response === "denied" ||
            response === "restricted" ||
            response === "undetermined"
          ) {
            Permissions.openSettings()
              .then(result => console.log(result))
              .catch(error => error);
          } else {
            this.setState({ pushNotificationPermission: response });
          }
        })
        .catch(error => error);
    }
  };

  private handleToggleContactPermission = (enable: boolean) => {
    if (!enable) {
      Permissions.openSettings()
        .then(result => console.log(result))
        .catch(error => error);
    } else {
      Permissions.request("contacts")
        .then(response => {
          if (
            response === "denied" ||
            response === "restricted" ||
            response === "undetermined"
          ) {
            Permissions.openSettings()
              .then(result => console.log(result))
              .catch(error => error);
          } else {
            this.setState({ contactsPermission: response });
          }
        })
        .catch(error => error);
    }
  };

  private handleTogglePrivateAccount = (enabled: boolean) => {
    this.setState({ privateAccountEnabled: enabled });
  };

  private goBack = () => {
    NavigationService.navigate("Menu");
  };
}

export default connect<StateFromDispatch, PropsFromDispatch, {}, StateStore>(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);

const chevronProps = { iconStyle: {} };

const styles = StyleSheet.create({
  changePasswordSubtitle: {
    fontFamily: Fonts.type.light,
    fontSize: 12,
    textAlign: "left"
  },
  container: {
    ...Layout.container
  },
  divider: {
    backgroundColor: Colors.paleGrey,
    height: 9
  },
  headerContainer: {
    borderBottomColor: Colors.paleGrey,
    borderBottomWidth: 1.5
  },
  itemTitle: {
    ...Layout.textCenter,
    color: Colors.onyx,
    fontFamily: "HelveticaNeue",
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "normal"
  },
  screenTitle: {
    ...Layout.textCenter,
    color: Colors.onyx,
    fontFamily: "HelveticaNeue",
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "500",
    height: 20,
    width: 141.7
  },
  sectionTitle: {
    ...Layout.textLeft,
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "bold",
    marginLeft: 16,
    marginTop: 10
  },
  subTitle: {
    fontFamily: Fonts.type.light,
    fontSize: 13,
    textAlign: "left"
  },
  switchContainer: {
    height: 23.9,
    width: 43.8
  },
  switchKnob: {
    backgroundColor: Colors.snow,
    borderColor: "#e4e7e8",
    borderStyle: "solid",
    borderWidth: 1,
    height: 20.8,
    shadowColor: "#00000048",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    width: 20.3
  }
});
