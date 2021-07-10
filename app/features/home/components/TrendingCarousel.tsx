import React, { useState, useRef } from "react";
import TrendingEventCard, { CARD_WIDTH } from "./TrendingEventCard";
import { Dimensions, ListRenderItemInfo, StyleSheet } from "react-native";
import { EventModel } from "../../../api/profile";
import LayoutDebugger from "../../../utils/LayoutDebugger";
import { verticalScale, scale } from "react-native-size-matters/extend";
import { MapboxLocation } from "../../../utils/MapboxService";
import Carousel, {
  CarouselRenderItemInfo
} from "../../../components/Carousel/SnapCarousel";
import Metrics from "../../../config/metrics";
import { Location } from "../../../features/location/reducer";

const CAROUSEL_ITEM_SPACING = 15;
const CAROUSEL_ITEM_WIDTH = CARD_WIDTH + CAROUSEL_ITEM_SPACING;
const FIRST_ITEM_SNAP_OFFSET = 48;
const LAST_ITEM_SNAP_OFFSET = -(FIRST_ITEM_SNAP_OFFSET + 13);
const SNAP_OFFSET_MARGIN = 5;

interface Props {
  events: EventModel[];
  location?: MapboxLocation;
}

interface State {
  currentIndex: number;
}

const initialState: State = {
  currentIndex: 0
};

export function TrendingCarousel({ events, location }: Props) {
  const [state, setState] = useState<State>(initialState);
  const renderItem = ({
    item,
    index,
    parallaxProps
  }: CarouselRenderItemInfo<EventModel>) => {
    return (
      <TrendingEventCard
        event={item}
        location={location}
        parallaxProps={parallaxProps}
      />
    );
  };
  return (
    <Carousel
      data={events}
      renderItem={renderItem}
      containerCustomStyle={styles.slider}
      contentContainerCustomStyle={styles.sliderContentContainer}
      sliderWidth={Metrics.DEVICE_WIDTH}
      itemWidth={CAROUSEL_ITEM_WIDTH}
      hasParallaxImages={true}
      firstItem={0}
      inactiveSlideScale={0.918}
      inactiveSlideOpacity={0.7}
      inactiveSlideShift={0}
      loop={false}
      loopClonesPerSide={0}
      autoplay={false}
      enableMomentum={true}
      activeAnimationType={"spring"}
      activeAnimationOptions={{
        friction: 4,
        tension: 40
      }}
      keyExtractor={(item, index) =>
        item.eventId ? item.eventId : index.toString()
      }
      onSnapToItem={(index: number) => setState({ currentIndex: index })}
      callbackOffsetMargin={SNAP_OFFSET_MARGIN}
      firstItemOffset={scale(FIRST_ITEM_SNAP_OFFSET)}
      lastItemOffset={scale(LAST_ITEM_SNAP_OFFSET)}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: verticalScale(200)
  },
  slider: {
    overflow: "visible" // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 0 // for custom animation
  }
});

const { width: viewportWidth } = Dimensions.get("window");

function wp(percentage: number) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}
