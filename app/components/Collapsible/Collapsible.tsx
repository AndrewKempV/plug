import React, { useState, Fragment } from "react";
import { TouchableWithoutFeedback, ViewStyle, StyleProp } from "react-native";

import Animated, { Easing } from "react-native-reanimated";
import { bInterpolate, bin, useTransition } from "react-native-redash";

const { not } = Animated;

interface RequiredProps {
  renderHeader: (
    transition: Animated.Value<number>
  ) => React.ElementType<{}> | Element;
  headerContainerStyle?: StyleProp<ViewStyle>;
  renderContent: (
    transition: Animated.Value<number>
  ) => React.ElementType<{}> | Element;
  contentContainerStyle?: StyleProp<ViewStyle>;
  contentHeight: number;
  renderFooter: (
    transition: Animated.Value<number>
  ) => React.ElementType<{}> | Element;
  footerContainerStyle?: StyleProp<ViewStyle>;
}

type OptionalProps = Partial<{
  collapsedContentHeight: number;
  transitionDuration: number;
  open: boolean;
}>;

type CollapsibleProps = RequiredProps & OptionalProps;

export default ({
  renderHeader,
  headerContainerStyle,
  renderContent,
  contentHeight,
  contentContainerStyle,
  renderFooter,
  footerContainerStyle,
  collapsedContentHeight = 0,
  transitionDuration = 400,
  open = true
}: CollapsibleProps) => {
  const transition = useTransition(
    open,
    not(bin(open)),
    bin(open),
    transitionDuration,
    Easing.inOut(Easing.ease)
  );
  const height = bInterpolate(
    transition,
    collapsedContentHeight,
    contentHeight
  );
  return (
    <Fragment>
      <Animated.View style={[headerContainerStyle]}>
        {renderHeader(transition)}
      </Animated.View>
      <Animated.View style={[contentContainerStyle, { height }]}>
        {renderContent(transition)}
      </Animated.View>
      <Animated.View style={footerContainerStyle}>
        {renderFooter(transition)}
      </Animated.View>
    </Fragment>
  );
};
