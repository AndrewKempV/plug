import _ from "lodash";
import React, { createRef, RefObject } from "react";
import { Modal, StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { ListItem } from "react-native-elements";
import BottomSheet from "reanimated-bottom-sheet";
import { Colors, Fonts, Layout } from "app/config/styles";
import LayoutDebugger from "app/utils/LayoutDebugger";

export interface BottomMenuItemProps {
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
}

interface BottomMenuProps {
  items: BottomMenuItemProps[];
  onPressDismiss?: () => void;
}

export default class BottomSheetMenu extends React.Component<BottomMenuProps> {
  public static defaultProps: BottomMenuProps = {
    items: []
  };

  public sheetRef: RefObject<BottomSheet> = createRef<BottomSheet>();

  public renderInner = () => (
    <View style={styles.panel}>
      {this.props.items.map((item, index) => (
        <ListItem key={`menu-item_${index}`} {...item} />
      ))}
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
        supportedOrientations={[
          "portrait",
          "portrait-upside-down",
          "landscape",
          "landscape-left",
          "landscape-right"
        ]}
        onRequestClose={() => {
          return;
        }}
      >
        <View style={styles.container}>
          <View style={styles.panelContainer}>
            <BottomSheet
              ref={this.sheetRef}
              snapPoints={[350, 250, 50]}
              renderContent={this.renderInner}
              renderHeader={this.renderHeader}
              initialSnap={0}
              enabledInnerScrolling={false}
              enabledBottomInitialAnimation={true}
            />
            <View style={styles.map} />
          </View>
        </View>
      </Modal>
    );
  }
}

const IMAGE_SIZE = 200;

const styles = LayoutDebugger.create({
  // StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)"
  },
  box: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE
  },
  panelContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.snow,
    marginHorizontal: 10
  },
  panel: {
    height: 600,
    padding: 20,
    backgroundColor: Colors.snow,
    borderColor: Colors.paleGrey,
    borderWidth: 1
  },
  header: {
    ...Layout.horizontalTopCenter,
    backgroundColor: Colors.snow,
    shadowColor: "#000000",
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: Colors.paleGrey,
    borderWidth: 1
  },
  panelHeader: {
    ...Layout.horizontalTopCenter,
    backgroundColor: Colors.snow
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10
  },
  panelTitle: {
    fontSize: 27,
    height: 35
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10
  },
  panelButton: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#318bfb",
    alignItems: "center",
    marginVertical: 10
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white"
  },
  map: {
    height: "100%",
    width: "100%",
    backgroundColor: Colors.snow,
    opacity: 1,
    borderColor: Colors.charcoalGrey,
    borderWidth: 1
  },
  itemLabel: {
    ...Layout.textFullCenter,
    fontFamily: Fonts.type.bold,
    fontSize: 18,
    fontWeight: "600",
    fontStyle: "normal",
    color: Colors.onyx
  },
  itemContainer: {
    borderBottomColor: Colors.paleGrey,
    borderBottomWidth: 2
  }
});
