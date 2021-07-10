import _ from "lodash";
import React, { Component } from "react";
import { Alert, ScrollView, View } from "react-native";
import { TouchableBox, Paragraph, Heading, Box } from "app/components";
import { Layout } from "../../config/styles";
import Chip from "../Chip";
import styles from "./styles";

class ChipCollection extends Component {
  public EventTags: string[] = [
    "Dance",
    "Specialty Cocktails",
    "Loud fun",
    "Outdoor events",
    "Trending music"
  ];

  public render() {
    return (
      <ScrollView contentContainerStyle={[Layout.verticalFlex]}>
        <Box
          minHeight={40}
          flex={1}
          flexGrow={1}
          flexDirection={"row"}
          flexWrap={"wrap"}
        >
          {this.EventTags.map((tag, index) => this.renderChip(tag, index))}
        </Box>
        {/* {partitions.map(this.renderRow)} */}
      </ScrollView>
    );
  }

  // public renderRow = (tags: string[], index: number) => {
  //   return (
  //     <View style={styles.rowContainer} key={index}>
  //       {tags.map(this.renderChip)}
  //     </View>
  //   );
  // };

  public renderChip = (tag: string, index: number) => {
    if (!_.isNil(tag)) {
      return (
        <TouchableBox
          debug
          shape={"ellipticalPill"}
          borderColor={"black"}
          borderWidth={1}
          key={index.toString()}
          flex={1}
          flexGrow={1}
          marginHorizontal={5}
          spaceHorizontal={18}
          height={32}
          minWidth={80}
          justifyContent={"center"}
          alignItems={"center"}
          backgroundColor={"transparent"}
        >
          <Heading size={14}>{tag}</Heading>
        </TouchableBox>
        // <Chip
        //   chipStyle={styles.chipContainer}
        //   value={tag}
        //   key={index.toString()}
        //   onPress={() => Alert.alert(`Show events associated with ${tag}`)}
        // />
      );
    }
  };
}

export default ChipCollection;
