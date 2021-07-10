import React, { Component } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import CardIO, {
  CardIOModule,
  CardIOUtilities
} from "react-native-awesome-card-io";
import DeviceInfo from "react-native-device-info";

export default class CreditCardScanner extends Component {
  public componentWillMount() {
    if (Platform.OS === "ios") {
      if (!DeviceInfo.isEmulator()) {
        CardIOUtilities.preload();
      }
    }
  }

  public scanCard = async () => {
    try {
      if (DeviceInfo.isEmulator()) {
        Alert.alert("Cannot scan card on emulator");
      } else {
        const card = await CardIOModule.scanCard({
          detectionMode: "AUTOMATIC"
        });
        console.log(card);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  public render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <TouchableOpacity onPress={this.scanCard}>
          <Text>Scan card!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
