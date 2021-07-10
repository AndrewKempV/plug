import _ from "lodash";
import React, { createRef, RefObject } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { ListItem } from "react-native-elements";
import Animated from "react-native-reanimated";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import BottomSheet from "reanimated-bottom-sheet";
import Metrics from "../../config/metrics";
import { Colors, Fonts, Layout } from "../../config/styles";

interface EventOrganizerSheetProps {
  onPressCancel?: () => void;
  position: Animated.Value<number>;
  visible: boolean;
}

export default class EventOrganizerSheet extends React.Component<
  EventOrganizerSheetProps
> {
  public static defaultProps: EventOrganizerSheetProps = {
    position: new Animated.Value<number>(0),
    visible: false
  };

  public sheetRef: RefObject<BottomSheet> = createRef<BottomSheet>();
  public position: Animated.Node<number> | null = null;

  public componentDidMount() {
    this.props.position.setValue(0);
  }

  public open = () => {
    this.props.position.setValue(0);
    Animated.interpolate(this.props.position, {
      inputRange: [0],
      outputRange: [1],
      extrapolate: Animated.Extrapolate.CLAMP
    });
  };

  public close = () => {
    this.props.position.setValue(1);
    Animated.interpolate(this.props.position, {
      inputRange: [1],
      outputRange: [0],
      extrapolate: Animated.Extrapolate.CLAMP
    });
  };

  public render() {
    return (
      <Modal
        presentationStyle={"overFullScreen"}
        transparent={true}
        visible={this.props.visible}
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
              snapPoints={[350, 0]}
              renderContent={this.renderInner}
              renderHeader={this.renderHeader}
              initialSnap={0}
              enabledInnerScrolling={false}
              callbackNode={this.props.position}
              enabledBottomInitialAnimation={true}
            />
            <View style={styles.map} />
          </View>
        </View>
      </Modal>
    );
  }

  private renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <Text style={styles.headerLabel}>{"Event Organizer"}</Text>
        <TouchableOpacity onPress={this.onDismiss}>
          <MaterialIcon
            style={styles.cancelButton}
            name={"cancel"}
            color={Colors.charcoalGrey}
            size={Metrics.icons.small}
            onPress={this.onDismiss}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  private renderInner = () => (
    <View style={styles.panel}>
      <ListItem
        title={"Analytics"}
        titleStyle={styles.itemLabel}
        chevron={chevronIconProps}
        onPress={() => Alert.alert("Going to analytics")}
      />
      <ListItem
        title={"Sell"}
        titleStyle={styles.itemLabel}
        chevron={chevronIconProps}
        onPress={() => Alert.alert("Going to sales")}
      />
      <ListItem
        title={"Check in"}
        titleStyle={styles.itemLabel}
        chevron={chevronIconProps}
        onPress={() => Alert.alert("Going to check in")}
      />
      <ListItem
        title={"Manage order"}
        titleStyle={styles.itemLabel}
        chevron={chevronIconProps}
        onPress={() => Alert.alert("Going to order management")}
      />
      <ListItem
        title={"More"}
        titleStyle={styles.itemLabel}
        onPress={() => Alert.alert("Showing more")}
      />
    </View>
  );

  private onDismiss = () => {
    if (!_.isNil(this.sheetRef.current)) {
      if (this.props.onPressCancel) {
        this.props.onPressCancel();
      }
      const sheet = this.sheetRef.current;
      sheet.snapTo(0);
    }
  };
}

const chevronIconProps = {
  size: 15,
  color: Colors.battleShipGrey
};

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
    ...Layout.container,
    backgroundColor: Colors.snow,
    bottom: 0,
    left: 0,
    opacity: 1,
    position: "absolute",
    right: 0
    // zIndex: 2 //causing problems on android
  },
  panel: {
    backgroundColor: Colors.snow,
    height: 600,
    opacity: 1
  },
  header: {
    backgroundColor: Colors.snow,
    borderColor: Colors.paleGrey,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    paddingTop: 20,
    shadowColor: "#000000"
  },
  headerLabel: {
    ...Layout.textCenter,
    color: Colors.onyx,
    fontFamily: Fonts.type.base,
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "bold",
    paddingLeft: 70
  },
  itemLabel: {
    ...Layout.textLeft,
    color: Colors.onyx,
    fontFamily: Fonts.type.bold,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "600"
  },
  panelHeader: {
    ...Layout.horizontalTopCenter,
    backgroundColor: Colors.snow,
    marginBottom: 10
  },
  panelHandle: {
    backgroundColor: "#00000040",
    borderRadius: 4,
    height: 7,
    marginBottom: 10,
    width: 70
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
  photo: {
    height: 225,
    marginTop: 30,
    width: "100%"
  },
  map: {
    backgroundColor: Colors.snow,
    borderColor: Colors.charcoalGrey,
    borderWidth: 1,
    height: "100%",
    opacity: 1,
    width: "100%"
  },
  cancelButton: {
    paddingLeft: 70
  }
});
