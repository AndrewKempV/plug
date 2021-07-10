//  @flow

import React, { ReactNode } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";

import getTooltipCoordinate from "./getCoordinates";
import Triangle from "./Triangle";

interface TooltipState {
  isVisible: boolean;
  yOffset: number;
  xOffset: number;
  elementWidth: number;
  elementHeight: number;
}

interface TooltipProps {
  children?: ReactNode;
  withPointer?: boolean;
  popover?: ReactNode;
  toggleOnPress?: boolean;
  height: number | string;
  width: number | string;
  containerStyle?: StyleProp<ViewStyle>;
  pointerColor?: string;
  onClose?: () => void;
  onOpen?: () => void;
  withOverlay?: boolean;
  overlayColor?: string;
  backgroundColor?: string;
  highlightColor?: string;
}

class Tooltip extends React.Component<TooltipProps, TooltipState> {
  public static defaultProps: TooltipProps = {
    withOverlay: true,
    highlightColor: "transparent",
    withPointer: true,
    toggleOnPress: true,
    height: 40,
    width: 150,
    containerStyle: {},
    backgroundColor: "#617080",
    onClose: () => {
      return;
    },
    onOpen: () => {
      return;
    }
  };

  public readonly state = {
    isVisible: false,
    yOffset: 0,
    xOffset: 0,
    elementWidth: 0,
    elementHeight: 0
  };

  public renderedElement: React.RefObject<View> = React.createRef();

  public toggleTooltip = () => {
    const { onClose } = this.props;
    this.getElementPosition();
    this.setState(prevState => {
      if (prevState.isVisible && Platform.OS !== "ios" && onClose) {
        onClose();
      }

      return { isVisible: !prevState.isVisible };
    });
  };

  public wrapWithPress = (toggleOnPress?: boolean, children?: ReactNode) => {
    if (toggleOnPress) {
      return (
        <TouchableOpacity onPress={this.toggleTooltip} activeOpacity={1}>
          {children}
        </TouchableOpacity>
      );
    }

    return children;
  };

  public getTooltipStyle = () => {
    const { yOffset, xOffset, elementHeight, elementWidth } = this.state;
    const {
      height,
      backgroundColor,
      width,
      withPointer,
      containerStyle
    } = this.props;

    const { x, y } = getTooltipCoordinate(
      xOffset,
      yOffset,
      elementWidth,
      elementHeight,
      Dimensions.get("screen").width,
      Dimensions.get("screen").height,
      width,
      height,
      withPointer
    );
    const style: StyleProp<ViewStyle> = {
      zIndex: 1,
      position: "absolute",
      left: x,
      top: y,
      width,
      height,
      backgroundColor,
      // default styles
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      borderRadius: 10,
      padding: 10
    };
    return StyleSheet.flatten([containerStyle, style]);
  };

  public renderPointer = (tooltipY: number) => {
    const { yOffset, xOffset, elementHeight, elementWidth } = this.state;
    const { backgroundColor, pointerColor } = this.props;
    const pastMiddleLine = yOffset > tooltipY;

    return (
      <View
        style={{
          position: "absolute",
          top: pastMiddleLine ? yOffset - 13 : yOffset + elementHeight - 2,
          left: xOffset + elementWidth / 2 - 7.5
        }}
      >
        <Triangle
          style={{ borderBottomColor: pointerColor || backgroundColor }}
          isDown={pastMiddleLine}
        />
      </View>
    );
  };
  public renderContent = (withTooltip: boolean) => {
    const { popover, withPointer, toggleOnPress, highlightColor } = this.props;

    if (!withTooltip) {
      return this.wrapWithPress(toggleOnPress, this.props.children);
    }

    const { yOffset, xOffset, elementWidth, elementHeight } = this.state;
    const tooltipStyle = this.getTooltipStyle();
    return (
      <View>
        <View
          style={{
            position: "absolute",
            top: yOffset,
            left: xOffset,
            backgroundColor: highlightColor,
            overflow: "visible",
            width: elementWidth,
            height: elementHeight
          }}
        >
          {this.props.children}
        </View>
        {withPointer && this.renderPointer(tooltipStyle.top as number)}
        <View style={tooltipStyle}>{popover}</View>
      </View>
    );
  };

  public componentDidMount() {
    // wait to compute onLayout values.
    setTimeout(this.getElementPosition, 500);
  }

  public getElementPosition = () => {
    if (this.renderedElement.current) {
      this.renderedElement.current.measureInWindow(
        (xOffset, yOffset, elementWidth, elementHeight) => {
          this.setState({
            xOffset,
            yOffset,
            elementWidth,
            elementHeight
          });
        }
      );
    }
  };

  public render() {
    const { isVisible } = this.state;
    const { onOpen, onClose, withOverlay, overlayColor } = this.props;

    return (
      <View collapsable={false} ref={this.renderedElement}>
        {this.renderContent(false)}
        <Modal
          visible={isVisible}
          animationType={"fade"}
          animated={true}
          transparent={true}
          onShow={onOpen}
          onRequestClose={onClose}
        >
          <TouchableOpacity
            style={styles.container(withOverlay, overlayColor)}
            onPress={this.toggleTooltip}
            activeOpacity={1}
          >
            {this.renderContent(true)}
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

const styles = {
  container: (
    withOverlay?: boolean,
    overlayColor?: string
  ): StyleProp<ViewStyle> => ({
    backgroundColor: withOverlay
      ? overlayColor
        ? overlayColor
        : "rgba(250, 250, 250, 0.70)"
      : "transparent",
    flex: 1
  })
};

export default Tooltip;

/**
 * Usage: 
 *  <Tooltip
      containerStyle={styles.tooltipContainer}
      withPointer={true}
      toggleOnPress={true}
      width={328}
      height={45}
      backgroundColor={Colors.white}
      popover={<Text style={styles.tooltipLabel}>{'Add the name as it is on your card to make it easy to identify.'}</Text>}
  >
      <Text style={styles.tooltipLabel}>{'Add the name as it is on your card to make it easy to identify.'}</Text>
  </Tooltip>
 */
