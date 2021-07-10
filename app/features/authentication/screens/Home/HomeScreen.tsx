import { Auth } from "aws-amplify";
import _ from "lodash";
import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import {BottomNavigation} from 'react-native-paper';
import Permissions from "react-native-permissions";
import { NavigationScreenProps } from "react-navigation";
import { Colors, Layout, text } from "../../../../config/styles";
import { IUsername } from "../../../../types/auth";
import { requestLocationPermission } from "../../../../utils/permissions";
import Storage from "../../../../utils/storage";
// import { MyCarousel } from './Test';
// import Example from './Example';

type State = IUsername;

const initialState = {
  username: "",
};
export default class HomeScreen extends React.Component<
  NavigationScreenProps,
  State
> {
  public readonly state = initialState;

  public componentWillMount = async () => {
    const username = await Storage.getTempValue();
    if (!_.isNil(username)) {
      this.setState({ username });
    }
    Auth.currentAuthenticatedUser()
      .then((result) => {
        // tslint:disable-next-line:no-console
        console.log(result);
      })
      .catch((err) => this.props.navigation.navigate("Landing"));

    Permissions.request("notification")
      .then((response) => {
        requestLocationPermission()
          .then((granted) => {
            if (!granted) {
              this.props.navigation.navigate("Location");
            }
          })
          .catch((error) => error);
        // tslint:disable-next-line:no-console
      })
      .catch((error) => console.error(error));
  };

  public render = (): JSX.Element => {
    return (
      <View style={styles.container} />
      // <Example/>
      // <Container style={[Layout.verticalTopCenter]}>
      //     <Header
      //         style={{ backgroundColor: Colors.transparent }}
      //         iosBarStyle={'light-content'}
      //         androidStatusBarColor={Colors.bordeaux}
      //         transparent={true}
      //         translucent={true}
      //         noShadow={true}>
      //         <Left>
      //             <Button
      //                 transparent={true}
      //                 onPressIn={()=> this.props.navigation.navigate('Landing')}>
      //             <NativeIcon
      //                 name="arrow-back"
      //                 style={{ color: Colors.black }}
      //                 onPress={()=> this.props.navigation.navigate('Landing')} />
      //             </Button>
      //         </Left>
      //         <Body>
      //             <Text style={text.regularDark}> {'Home'} </Text>
      //         </Body>
      //         <Right/>
      //     </Header>
      //     <TouchableOpacity style={styles.button} onPress={() => { Auth.signOut().then(() =>  this.props.navigation.navigate('Landing')) }}>
      //         <Text>Sign out</Text>
      //     </TouchableOpacity>
      //     <TouchableOpacity style={styles.button} onPress={() => { this.props.navigation.navigate('Location')}}>
      //         <Text>Go to Location Screen</Text>
      //     </TouchableOpacity>

      // </Container>
    );
  };
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#DDDDDD",
    borderColor: "#000000",
    borderRadius: 5,
    borderWidth: 1,
    margin: 5,
    padding: 5,
    width: "70%",
  },
  container: {
    alignItems: "center",
    backgroundColor: "#c2c6c7",
    flex: 1,
    justifyContent: "center",
  },
  spacer: {
    height: 10,
  },
  textField: {
    borderColor: "#AAAAAA",
    borderWidth: 1,
    margin: 5,
    padding: 5,
    width: "70%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  welcome: {
    fontSize: 20,
    margin: 10,
    textAlign: "center",
  },
});
