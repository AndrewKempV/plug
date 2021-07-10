import React, { createRef, RefObject } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { ListItem } from "react-native-elements";
import BottomSheet from "reanimated-bottom-sheet";
import { Colors, Fonts, Layout } from "config/styles";
import { EventDetailModel } from "app/api/profile";

export type BottomMenuState = "Open" | "Closed";

interface EventDetailMenuProps {
  menuState: BottomMenuState;

  selectedIndex: number;
  onCancel?: () => void;
  onMessageHost?: () => void;
  onShare?: () => void;
  onReportEvent?: (event?: EventDetailModel) => void;
}

export default class EventDetailMenu extends React.PureComponent<
  EventDetailMenuProps
> {
  public static defaultProps: EventDetailMenuProps = {
    selectedIndex: 0,
    menuState: "Closed"
  };

  public sheetRef: RefObject<BottomSheet> = createRef<BottomSheet>();

  public renderInner = () => {
    const { onMessageHost, onShare } = this.props;

    return (
      <View style={styles.panel}>
        <ListItem
          title={"Share with friends"}
          titleStyle={styles.itemLabel}
          containerStyle={styles.itemContainer}
          onPress={onShare}
        />
        <ListItem
          title={"Message host"}
          titleStyle={styles.itemLabel}
          containerStyle={styles.itemContainer}
          onPress={onMessageHost}
        />
        <ListItem
          title={"Report event"}
          titleStyle={styles.itemLabel}
          containerStyle={styles.itemContainer}
          onPress={this.reportEvent}
        />
        <ListItem
          title={"Cancel"}
          titleStyle={styles.cancelLabel}
          onPress={this.cancel}
        />
      </View>
    );
  };

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
        visible={this.props.menuState === "Open"}
        animationType={"fade"}
        supportedOrientations={["portrait"]}
      >
        <View style={styles.container}>
          <View style={styles.panelContainer}>
            <BottomSheet
              ref={this.sheetRef}
              snapPoints={[289]}
              renderContent={this.renderInner}
              renderHeader={this.renderHeader}
              initialSnap={0}
              enabledInnerScrolling={false}
            />
            <View style={styles.map} />
          </View>
        </View>
      </Modal>
    );
  }

  private cancel = () => {
    if (this.sheetRef.current) {
      if (this.props.onCancel) {
        this.props.onCancel();
      }
      const sheet = this.sheetRef.current;
      sheet.snapTo(0);
    }
  };
  private reportEvent = () => {
    const { onReportEvent } = this.props;
    if (onReportEvent) {
      onReportEvent();
    }
  };
}

const IMAGE_SIZE = 200;

const styles = StyleSheet.create({
  // StyleSheet.create({
  container: {
    backgroundColor: Colors.A400,
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
    borderBottomColor: Colors.paleGrey,
    borderLeftColor: Colors.paleGrey,
    borderRightColor: Colors.paleGrey,
    borderTopColor: Colors.transparent,
    borderWidth: 1,
    height: 290,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 0
  },
  header: {
    ...Layout.horizontalTopCenter,
    backgroundColor: Colors.snow,
    borderBottomColor: Colors.transparent,
    borderBottomWidth: 0,
    borderLeftColor: Colors.paleGrey,
    borderLeftWidth: 1,
    borderRightColor: Colors.paleGrey,
    borderRightWidth: 1,
    borderTopColor: Colors.paleGrey,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    paddingTop: 10,
    shadowColor: "#000000"
  },
  panelHeader: {
    ...Layout.horizontalTopCenter,
    backgroundColor: Colors.snow
  },
  panelHandle: {
    backgroundColor: Colors.silver,
    borderRadius: 28,
    height: 6,
    marginBottom: 10,
    width: 56
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
    borderColor: Colors.transparent,
    borderWidth: 1,
    height: "100%",
    opacity: 1,
    width: "100%"
  },
  itemLabel: {
    ...Layout.textFullCenter,
    color: Colors.onyx,
    fontFamily: "Roboto",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "normal",
    letterSpacing: 0.01,
    lineHeight: 24,
    textAlign: "center"
  },
  cancelLabel: {
    ...Layout.textFullCenter,
    color: Colors.burgundy,
    fontFamily: Fonts.type.bold,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "600"
  },
  itemContainer: {
    borderBottomColor: Colors.paleGrey,
    borderBottomWidth: 1,
    height: 59.5
  },
  cardItemContainer: {
    borderBottomColor: Colors.paleGrey,
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 48,
    width: 328,
    ...Layout.alignCentered
  },
  cardIcon: {
    height: 16,
    marginBottom: 3,
    marginRight: 9,
    width: 21.6
  }
});
