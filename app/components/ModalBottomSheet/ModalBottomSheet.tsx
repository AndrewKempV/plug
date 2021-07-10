import _ from "lodash";
import React, { createRef, RefObject } from "react";
import { Alert, Modal, StyleSheet, View } from "react-native";
import { ListItem } from "react-native-elements";
import BottomSheet from "reanimated-bottom-sheet";
import { Colors, Fonts, Layout } from "app/config/styles";

interface ModalBottomSheetProps {
  onPressCancel?: () => void;
  onPressBlock?: () => void;
  onPressMessage?: () => void;
}

export default class ModalBottomSheet extends React.Component<
  ModalBottomSheetProps
> {
  public sheetRef: RefObject<BottomSheet> = createRef<BottomSheet>();

  public renderInner = () => (
    <View style={styles.panel}>
      <ListItem
        title={"Share profile"}
        titleStyle={styles.itemLabel}
        containerStyle={{
          borderBottomColor: Colors.paleGrey,
          borderBottomWidth: 2
        }}
        onPress={() => Alert.alert("Sharing profile")}
      />
      <ListItem
        title={"Message"}
        titleStyle={styles.itemLabel}
        containerStyle={{
          borderBottomColor: Colors.paleGrey,
          borderBottomWidth: 2
        }}
        onPress={this.props.onPressMessage}
      />
      <ListItem
        title={"Report"}
        titleStyle={styles.itemLabel}
        containerStyle={{
          borderBottomColor: Colors.paleGrey,
          borderBottomWidth: 2
        }}
        onPress={() => Alert.alert("Going to the user report screen")}
      />
      <ListItem
        title={"Block"}
        titleStyle={styles.itemLabel}
        containerStyle={{
          borderBottomColor: Colors.paleGrey,
          borderBottomWidth: 2
        }}
        onPress={this.props.onPressBlock}
      />
      <ListItem
        title={"Cancel"}
        titleStyle={styles.itemLabel}
        onPress={this.cancel}
      />
    </View>
  );

  public renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHandle} />
    </View>
  );

  public render() {
    return (
      <Modal
        presentationStyle={"overFullScreen"}
        transparent={true}
        visible={true}
        animationType={"fade"}
        supportedOrientations={["portrait"]}
        onRequestClose={() => {
          return;
        }}
      >
        <View style={styles.container}>
          <View style={styles.panelContainer}>
            <BottomSheet
              ref={this.sheetRef}
              snapPoints={[350, 0]}
              renderContent={this.renderInner}
              renderHeader={this.renderHeader}
              initialSnap={0}
              enabledBottomInitialAnimation={true}
            />
            <View style={styles.map} />
          </View>
        </View>
      </Modal>
    );
  }

  private cancel = () => {
    if (!_.isNil(this.sheetRef.current)) {
      if (this.props.onPressCancel) {
        this.props.onPressCancel();
      }
      const sheet = this.sheetRef.current;
      sheet.snapTo(0);
    }
  };
}

const IMAGE_SIZE = 200;

const styles = StyleSheet.create({
  // StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    flex: 1
  },
  box: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE
  },
  panelContainer: {
    backgroundColor: Colors.snow,
    bottom: 0,
    left: 0,
    marginHorizontal: 10,
    position: "absolute",
    right: 0
  },
  panel: {
    backgroundColor: Colors.snow,
    borderColor: Colors.paleGrey,
    borderWidth: 1,
    height: 600,
    padding: 20
  },
  header: {
    ...Layout.horizontalTopCenter,
    backgroundColor: Colors.snow,
    borderColor: Colors.paleGrey,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    paddingTop: 20,
    shadowColor: "#000000"
  },
  panelHeader: {
    ...Layout.horizontalTopCenter,
    backgroundColor: Colors.snow
  },
  panelHandle: {
    backgroundColor: "#00000040",
    borderRadius: 4,
    height: 8,
    marginBottom: 10,
    width: 40
  },
  panelTitle: {
    fontSize: 27,
    height: 35
  },
  panelSubtitle: {
    color: "gray",
    fontSize: 14,
    height: 30,
    marginBottom: 10
  },
  panelButton: {
    alignItems: "center",
    backgroundColor: "#318bfb",
    borderRadius: 10,
    marginVertical: 10,
    padding: 20
  },
  panelButtonTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold"
  },
  map: {
    backgroundColor: Colors.snow,
    borderColor: Colors.charcoalGrey,
    borderWidth: 1,
    height: "100%",
    opacity: 1,
    width: "100%"
  },
  itemLabel: {
    ...Layout.textFullCenter,
    color: Colors.onyx,
    fontFamily: Fonts.type.bold,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "600"
  }
});
