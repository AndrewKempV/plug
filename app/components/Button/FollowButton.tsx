import React, { PureComponent } from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
  ViewStyle
} from "react-native";
import Fonts from "../../config/Fonts";
import Metrics from "../../config/metrics";
import { Colors, Layout } from "../../config/styles";
import { BetterButton } from "./Button";

interface FollowButtonProps extends ViewProps {
  onPress?: () => void;
  active?: boolean;
  followed?: boolean;
  iconStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  loading?: boolean;
}

class FollowButton extends PureComponent<FollowButtonProps> {
  public render() {
    const {
      onPress,
      active,
      followed,
      iconStyle,
      labelStyle,
      loading
    } = this.props;
    return (
      <View style={this.props.style}>
        <BetterButton
          loading={loading}
          interval={300}
          style={!followed ? styles.container : styles.followingContainer}
          labelStyle={[
            !followed ? styles.label : styles.followingLabel,
            labelStyle
          ]}
          iconStyle={iconStyle}
          label={!followed ? "Follow" : "Following"}
          onPress={onPress}
          active={active}
          iconName={!followed ? "follow" : "following"}
          iconSize={Metrics.icons.xxsmall}
          iconColor={!followed ? Colors.snow : Colors.burgundy}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Layout.horizontalTopCenter,
    backgroundColor: Colors.burgundy,
    borderColor: Colors.burgundy,
    borderRadius: 25,
    borderStyle: "solid",
    borderWidth: 2,
    height: 29.1,
    paddingVertical: 5,
    width: 88.2
  },
  followingContainer: {
    ...Layout.horizontalTopCenter,
    backgroundColor: Colors.snow,
    borderColor: Colors.burgundy,
    borderRadius: 25,
    borderStyle: "solid",
    borderWidth: 2,
    height: 36,
    paddingVertical: 5,
    width: 103.6
  },
  followingLabel: {
    ...Layout.textFullCenter,
    color: Colors.burgundy,
    fontFamily: "HelveticaNeue",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "500",
    height: 17,
    letterSpacing: 0,
    lineHeight: 17,
    textAlign: "center",
    width: 62
  },
  label: {
    ...Layout.textFullCenter,
    color: Colors.snow,
    fontFamily: Fonts.type.base,
    fontSize: 13,
    fontWeight: "600",
    height: 19,
    width: 50
  }
});

export default FollowButton;
