import React, { PureComponent } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Fonts from "../../config/Fonts";
import Metrics from "../../config/metrics";
import { Colors, Layout } from "../../config/styles";
import { Surface } from "../Typings/Surface";

interface HostedEventCardProps {
  imageUri: string;
  eventName: string;
  eventVenue: string;
  startDate: string;
  startTime: string;
  endTime: string;
}

class HostedEventCard extends PureComponent<HostedEventCardProps> {
  public render() {
    const {
      imageUri,
      eventName,
      eventVenue,
      startDate,
      startTime,
      endTime
    } = this.props;
    const source = { uri: imageUri };
    return (
      // <Box
      //   flexDirection={"row"}
      //   flex={1}
      //   alignItems={"flex-start"}
      //   justifyContent={"flex-start"}
      // >
      <Surface style={styles.container}>
        <Image style={styles.image} source={source} />
        <View style={styles.eventInfoContainer}>
          <Text style={styles.eventName}>{eventName}</Text>
          <Text style={styles.eventVenue}>{eventVenue}</Text>
          <Text
            style={styles.dateLabel}
          >{`${startDate}: ${startTime} - ${endTime}`}</Text>
        </View>
      </Surface>
      // </Box>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Layout.horizontalFlex,
    ...Layout.alignLeft
  },
  dateLabel: {
    ...Layout.textLeft,
    color: Colors.darkBurgundy,
    fontFamily: Fonts.type.base,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "500",
    textAlign: "left"
  },
  eventInfoContainer: {
    ...Layout.verticalFlex,
    ...Layout.alignLeft,
    paddingLeft: 16.7
  },
  eventName: {
    ...Layout.textLeft,
    color: Colors.onyx,
    fontFamily: Fonts.type.medium,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "500"
  },
  eventVenue: {
    ...Layout.textLeft,
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "500",
    textAlign: "left"
  },
  image: {
    borderColor: Colors.paleGrey,
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 1,
    height: 89,
    width: 102
  }
});

export default HostedEventCard;
