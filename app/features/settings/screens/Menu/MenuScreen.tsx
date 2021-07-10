import React, { Component } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Header, ListItem } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { BackButton } from "../../../../components/Button";
import Icon from "../../../../components/Icon";
import { Colors, Layout } from "../../../../config/styles";
import { GetPropsFromDispatch } from "../../../../store/ActionCreators";
import AppActions from "../../../../store/AppActions";
import { StateStore } from "../../../../store/AppReducer";
import { MenuOptions } from "./constants";
import NavigationService from "app/utils/NavigationService";

type TBindActionCreators = typeof AppActions;

type StateFromDispatch = ReturnType<typeof mapStateToProps>;

type PropsFromDispatch = GetPropsFromDispatch<TBindActionCreators>;

const mapStateToProps = (state: StateStore) => ({
  AuthState: state.authReducer
});
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<TBindActionCreators, PropsFromDispatch>(
    AppActions,
    dispatch
  );

type ReduxProps = StateFromDispatch & PropsFromDispatch;
type MenuScreenProps = ReduxProps & NavigationScreenProps;

export interface MenuItem {
  title: string;
  icon: string;
  subtitle?: string;
  goToScreen?: string;
}

class MenuScreen extends React.Component<MenuScreenProps> {
  public static navigationOptions = () => {
    return {
      headerLeft: null,
      header: null
    };
  };

  public render() {
    return (
      <View style={styles.container}>
        <View>
          <Header
            backgroundColor={Colors.snow}
            leftComponent={
              <BackButton
                onPress={() => NavigationService.navigate("Profile")}
              />
            }
            centerComponent={<Text style={styles.screenTitle}>{"Menu"}</Text>}
          />
        </View>
        <ListItem
          title={MenuOptions[0].title}
          leftElement={<Icon name={MenuOptions[0].icon} size={20} />}
          chevron={chevronIconProps}
          onPress={() => NavigationService.navigate("Settings")}
        />
        <ListItem
          title={MenuOptions[1].title}
          leftElement={<Icon name={MenuOptions[1].icon} size={20} />}
          chevron={chevronIconProps}
          onPress={() => NavigationService.navigate("SavedPayments")}
        />
        <ListItem
          title={MenuOptions[2].title}
          leftElement={<Icon name={MenuOptions[2].icon} size={20} />}
          chevron={chevronIconProps}
          onPress={() => NavigationService.navigate("Support")}
        />
        <ListItem
          title={MenuOptions[3].title}
          leftElement={<Icon name={MenuOptions[3].icon} size={20} />}
          chevron={chevronIconProps}
          onPress={() => NavigationService.navigate("About")}
        />
        <ListItem
          title={MenuOptions[4].title}
          leftElement={<Icon name={MenuOptions[4].icon} size={20} />}
          chevron={chevronIconProps}
          onPress={() => NavigationService.navigate("Suggestions")}
        />
        <ListItem
          title={MenuOptions[5].title}
          leftElement={<Icon name={MenuOptions[5].icon} size={20} />}
          onPress={() => NavigationService.navigate("Landing")}
        />
      </View>
    );
  }
}

const chevronIconProps = {
  size: 15,
  color: Colors.battleShipGrey
};

const styles = StyleSheet.create({
  container: {
    ...Layout.container
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
  }
});

export default connect<StateFromDispatch, PropsFromDispatch, {}, StateStore>(
  mapStateToProps,
  mapDispatchToProps
)(MenuScreen);
