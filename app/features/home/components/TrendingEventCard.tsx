import _ from "lodash";
import React from "react";
import { Animated, Text, View, StyleSheet } from "react-native";
import { EventModel } from "app/api/profile";
import { Colors, Layout, Fonts } from "app/config/styles";
import { getDistanceInMiles } from "app/utils/helpers";
import { Surface } from "app/components/Typings/Surface";
import { MapboxLocation } from "app/utils/MapboxService";
import { GeolocationData } from "app/hooks/useGeolocation";
import { verticalScale, scale } from "react-native-size-matters/extend";
import { FeaturedBadge } from "./FeaturedBadge";
import ParallaxImage, {
  ParallaxImageProps
} from "app/components/Carousel/ParallaxImage";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import NavigationService from "app/utils/NavigationService";
const AnimatedSurface = Animated.createAnimatedComponent(Surface);

interface Props {
  event: EventModel;
  featured?: boolean;
  location?: MapboxLocation;
  parallaxProps: Omit<ParallaxImageProps, "source" | "parallaxFactor">;
}

const TrendingEventCard = ({ event, location, parallaxProps }: Props) => {
  let distance = -1;
  if (location) {
    const goal: GeolocationData = {
      longitude: Number.parseFloat(event.longitude || "0.0"),
      latitude: Number.parseFloat(event.latitude || "0.0")
    };
    const [longitude, latitude] = location.center;
    const start: GeolocationData = {
      longitude,
      latitude
    };
    distance = Math.ceil(getDistanceInMiles(start, goal, 1));
  }
  // const goToUserProfile = () => NavigationService.push('OtherProfile', {
  //   profileId: event.ownerUserProfileId,
  //   priorRoute: NavigationService.getCurrentRoute()
  // });
  const goToEventDetail = () =>
    NavigationService.navigate("EventDetail", {
      eventId: event.eventId,
      fromRoute: NavigationService.getCurrentRoute()
    });
  return (
    <AnimatedSurface style={styles.container}>
      {event.primaryImageUrl && (
        <TouchableWithoutFeedback onPress={goToEventDetail}>
          <ParallaxImage
            source={{ uri: event.primaryImageUrl }}
            containerStyle={styles.imageContainer}
            style={styles.image}
            parallaxFactor={0.5}
            showSpinner={true}
            spinnerColor={Colors.onyx}
            {...parallaxProps}
          />
        </TouchableWithoutFeedback>
      )}
      <View style={styles.contentContainer}>
        <TouchableWithoutFeedback onPress={goToEventDetail}>
          <Text
            style={styles.venueNameLabel}
            ellipsizeMode={"tail"}
            numberOfLines={1}
          >
            {event.venueName}
          </Text>
          <Text
            style={styles.hostLabel}
            ellipsizeMode={"tail"}
            numberOfLines={1}
          >
            {event.eventName}
          </Text>
        </TouchableWithoutFeedback>

        <View style={styles.footerContainer}>
          <Text
            style={styles.ambianceLabel}
            ellipsizeMode={"tail"}
            numberOfLines={1}
            onPress={goToEventDetail}
          >
            {`${"Restaurant"} · ${
              distance >= 0 && distance <= 2500 ? distance : "-"
            } mi`}
          </Text>
          <FeaturedBadge containerStyle={styles.featureBadgeContainer} />
        </View>
      </View>
    </AnimatedSurface>
  );
};

const CARD_HEIGHT = verticalScale(209);
export const CARD_WIDTH = scale(233);
const IMAGE_HEIGHT = verticalScale(122);
const CONTENT_HEIGHT = verticalScale(87.5);
const TOP_BORDER_RADIUS = 13;

const styles = StyleSheet.create({
  ambianceLabel: {
    color: Colors.charcoalGreyTwo,
    fontFamily: Fonts.type.base,
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal",
    height: 14,
    letterSpacing: 0,
    lineHeight: 14,
    textAlign: "left"
  },
  bottomContainer: {
    height: CONTENT_HEIGHT,
    width: CARD_WIDTH,
    ...Layout.alignCentered,
    backgroundColor: Colors.snow,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  container: {
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    ...Layout.verticalFlex,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: Colors.paleGrey,
    borderTopLeftRadius: TOP_BORDER_RADIUS,
    borderTopRightRadius: TOP_BORDER_RADIUS,
    borderWidth: 1,
    shadowColor: "#00000029",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 1,
    shadowRadius: 6
  },

  contentContainer: {
    ...Layout.container,
    ...Layout.alignCenterLeft,
    marginHorizontal: 17.8,
    marginVertical: 15.2
  },
  featureBadgeContainer: {
    marginLeft: 30
  },
  footerContainer: {
    flexDirection: "row",
    height: 18
  },
  hostLabel: {
    color: Colors.charcoalGreyTwo,
    fontFamily: Fonts.type.base,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "500",
    height: 15,
    letterSpacing: 0,
    lineHeight: 17,
    marginBottom: 7,
    textAlign: "left"
  },
  image: {
    height: IMAGE_HEIGHT,
    width: CARD_WIDTH
  },
  imageContainer: {
    borderTopLeftRadius: TOP_BORDER_RADIUS,
    borderTopRightRadius: TOP_BORDER_RADIUS,
    height: IMAGE_HEIGHT,
    overflow: "hidden",
    width: CARD_WIDTH
  },
  venueNameLabel: {
    color: Colors.black,
    fontFamily: Fonts.type.base,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "500",
    height: 18,
    letterSpacing: 0,
    lineHeight: 18,
    textAlign: "left"
  }
});
export default TrendingEventCard;
