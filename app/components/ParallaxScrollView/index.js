import React, { useState } from 'react';
import UIParallaxScrollView from 'react-native-parallax-scroll-view';

export const ParallaxScrollView = ({
  children,
  stickyHeaderHeight,
  ...restProps
}) => {
  const [altStickyHeaderHeight, setStickyHeaderHeight] = useState(1);
  const onScroll = event => {
    const threshold = 30;
    if (restProps.renderStickyHeader) {
      if (
        event.nativeEvent.contentOffset.y <= threshold &&
        altStickyHeaderHeight > 1
      ) {
        setStickyHeaderHeight(1);
      } else if (
        event.nativeEvent.contentOffset.y > threshold &&
        altStickyHeaderHeight === 1
      ) {
        setStickyHeaderHeight(stickyHeaderHeight);
      }
    }
  };
  return (
    <UIParallaxScrollView
      stickyHeaderHeight={altStickyHeaderHeight}
      scrollEvent={onScroll}
      {...restProps}>
      {children}
    </UIParallaxScrollView>
  );
};