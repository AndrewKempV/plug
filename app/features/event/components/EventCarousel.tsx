import React from "react";
import MediumEventCard, { CARD_WIDTH } from "./MediumEventCard";
import { StyleSheet } from "react-native";
import { EventModel } from "api/profile";
import { scale } from "react-native-size-matters/extend";
import Carousel, {
  CarouselRenderItemInfo
} from "components/Carousel/SnapCarousel";
import Metrics from "config/metrics";
import { ToggleFavoriteRequest } from "../actions";

const CAROUSEL_ITEM_SPACING = 15;
const CAROUSEL_ITEM_WIDTH = CARD_WIDTH + CAROUSEL_ITEM_SPACING;
const FIRST_ITEM_SNAP_OFFSET = 48;
const LAST_ITEM_SNAP_OFFSET = -(FIRST_ITEM_SNAP_OFFSET + 13);
const SNAP_OFFSET_MARGIN = 5;

interface Props {
  events: EventModel[];
  onFavoriteEvent: (req: ToggleFavoriteRequest) => void;
}

export function EventCarousel({ events, onFavoriteEvent }: Props) {
  const renderItem = ({ item }: CarouselRenderItemInfo<EventModel>) => {
    return (
      <MediumEventCard event={item} toggleFavoriteEvent={onFavoriteEvent} />
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
      callbackOffsetMargin={SNAP_OFFSET_MARGIN}
      firstItemOffset={scale(FIRST_ITEM_SNAP_OFFSET)}
      lastItemOffset={scale(LAST_ITEM_SNAP_OFFSET)}
    />
  );
}

const styles = StyleSheet.create({
  slider: {
    overflow: "visible"
  },
  sliderContentContainer: {
    paddingVertical: 0
  }
});
