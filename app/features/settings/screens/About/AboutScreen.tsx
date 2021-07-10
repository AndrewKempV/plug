import React, { Component } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Header, ListItem } from "react-native-elements";
import { BackButton } from "components/Button";
import { Colors, Layout } from "config/styles";
import NavigationService from "utils/NavigationService";

class AboutScreen extends Component {
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
              <BackButton onPress={() => NavigationService.navigate("Menu")} />
            }
            centerComponent={<Text style={styles.screenTitle}>{"About"}</Text>}
          />
        </View>
        <ListItem
          title={"Privacy Policy"}
          chevron={chevronIconProps}
          onPress={() => NavigationService.navigate("Settings")}
        />
        <ListItem
          title={"Terms of Service"}
          chevron={chevronIconProps}
          onPress={() => NavigationService.navigate("Payments")}
        />
        <ListItem
          title={"Rate the app"}
          onPress={() => NavigationService.navigate("Rating")}
        />
        <ListItem
          title={"Like us on Facebook"}
          onPress={() => Alert.alert("Going to facebook.")}
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

export default AboutScreen;
