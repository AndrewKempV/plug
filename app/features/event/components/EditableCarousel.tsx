import React from "react";
import { CroppedImage } from "app/components/AvatarEditor/AvatarEditor";
import Carousel, {
  CarouselRenderItemInfo
} from "components/Carousel/SnapCarousel";
import { useTheme } from "app/theme";
import { StyleSheet } from "react-native";
import Metrics from "app/config/metrics";
import { ImageInput } from "./ImageInput";

interface Props {
  images: CroppedImage[];
  onRemove: (item: CroppedImage, idx?: number) => void;
  onImageSelected: (item: CroppedImage) => void;
  onPressAdd: () => void;
}
const CARD_WIDTH = 247;
const CAROUSEL_ITEM_SPACING = 15;
const CAROUSEL_ITEM_WIDTH = CARD_WIDTH + CAROUSEL_ITEM_SPACING;
const FIRST_ITEM_SNAP_OFFSET = 0;
const LAST_ITEM_SNAP_OFFSET = -(FIRST_ITEM_SNAP_OFFSET + 13);
const SNAP_OFFSET_MARGIN = 5;

export const EditableCarousel = ({
  images,
  onRemove,
  onImageSelected,
  onPressAdd
}: Props) => {
  const renderItem = ({
    item,
    index
  }: CarouselRenderItemInfo<CroppedImage>) => {
    const remove = () => onRemove(item, index);
    return (
      <ImageInput
        item={item}
        onRemove={remove}
        onImageSelected={onImageSelected}
        onPressAdd={onPressAdd}
      />
    );
  };
  const theme = useTheme();
  return (
    <Carousel
      data={images}
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
      keyExtractor={(item: CroppedImage, index: number) => index.toString()}
      callbackOffsetMargin={SNAP_OFFSET_MARGIN}
      firstItemOffset={FIRST_ITEM_SNAP_OFFSET}
      lastItemOffset={LAST_ITEM_SNAP_OFFSET}
    />
  );
};

const styles = StyleSheet.create({
  slider: {
    overflow: "visible"
  },
  sliderContentContainer: {
    paddingVertical: 0
  }
});
