import React, { useEffect } from "react";
import {
  StyleSheet,
  Image,
  View,
  StyleProp,
  ViewStyle,
  Text,
  Alert,
  TouchableWithoutFeedback
} from "react-native";
import { AxiosResponse } from "axios";

import {
  EventModel,
  UserProfileModel,
  BaseResponseModelUserProfileModel
} from "api/profile";
import { ApiClient } from "api/client";

import { BetterButton } from "components/Button";
import { Surface } from "components/Typings/Surface";
import { Box } from "app/components/Box";

import { Colors, Layout, Fonts, buildCircle } from "config/styles";
import Metrics from "config/metrics";

import { formatStartTime } from "utils/formatters";
import { ToggleFavoriteRequest } from "../actions";
import { makeCancellable } from "hooks/useCancellablePromise";
import NavigationService from "app/utils/NavigationService";

export const CARD_WIDTH = 248.2;

interface Props {
  event: EventModel;
  containerStyle?: StyleProp<ViewStyle>;
  toggleFavoriteEvent: ({ eventId, favorite }: ToggleFavoriteRequest) => void;
}

interface State {
  user: UserProfileModel;
}
const initialState: State = {
  user: {
    username: " "
  }
};

const MediumEventCard = ({
  event,
  containerStyle,
  toggleFavoriteEvent
}: Props) => {
  const [state, setState] = React.useState<State>(initialState);

  const userRef = React.useRef<UserProfileModel>();
  useEffect(() => {
    const cancellable = makeCancellable<
      AxiosResponse<BaseResponseModelUserProfileModel>
    >(ApiClient.instance.getUserProfile(event.ownerUserProfileId!));
    if (event.ownerUserProfileId) {
      cancellable.promise
        .then(response => {
          const user = response.data.data!.pop();
          if (user) {
            userRef.current = user;
            setState({ user: userRef.current });
          }
        })
        .catch(error => console.warn(error));
    }
    return cancellable.cancel;
  }, [event]);

  const { username } = state.user!;
  const {
    eventName,
    venueName,
    city,
    eventStartTime,
    eventEndTime,
    favorite,
    eventId
  } = event;

  const [isFavorite, setFavorite] = React.useState(favorite);
  const toggleFavorite = () => {
    toggleFavoriteEvent({
      favorite: isFavorite!,
      eventId: eventId!
    });
    setFavorite(prev => !prev);
  };

  const goToEventDetails = () =>
    NavigationService.push("EventDetail", {
      eventId: eventId
    });
  return (
    <Surface style={[styles.container, containerStyle]}>
      <TouchableWithoutFeedback onPress={goToEventDetails}>
        <View style={styles.imageContainer}>
          {event.primaryImageUrl && (
            <Image
              style={styles.image}
              source={{
                uri: event.primaryImageUrl ? event.primaryImageUrl : " "
              }}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
      <Box spaceHorizontal={16} spaceBottom={18} spaceTop={14}>
        <Box height={35} alignItems={"flex-start"} alignContent={"flex-start"}>
          <Text
            style={styles.eventName}
            ellipsizeMode={"tail"}
            numberOfLines={1}
            onPress={goToEventDetails}
          >
            {eventName}
          </Text>
          <Text
            style={styles.venueNameAndCity}
            ellipsizeMode={"tail"}
            numberOfLines={1}
            onPress={goToEventDetails}
          >
            {`${venueName || " "}, ${city || " "}`}
          </Text>
        </Box>
        <Box height={40} flexDirection={"row"}>
          <Box flexDirection={"column"} width={140} spaceTop={3}>
            <Text
              style={styles.eventDate}
              ellipsizeMode={"tail"}
              numberOfLines={1}
              onPress={goToEventDetails}
            >
              {formatStartTime(eventStartTime!)}
            </Text>
            <Text style={styles.eventOwnerLabel}>
              {`By @${username || "-"}`}
            </Text>
          </Box>
          <Box
            width={72}
            flexDirection={"row"}
            spaceLeft={10}
            alignItems={"flex-end"}
            justifyContent={"space-between"}
          >
            <BetterButton
              style={styles.shareButton}
              iconSetName={"Plugg"}
              iconName={"share"}
              iconStyle={styles.shareIcon}
              iconSize={Metrics.icons.xsmall}
              iconColor={Colors.charcoalGreyTwo}
              onPress={() => Alert.alert("Event sharing is not available yet")}
            />
            <BetterButton
              style={styles.favoriteButton}
              iconSetName={"ionicon"}
              iconName={isFavorite ? "md-heart" : "md-heart-empty"}
              iconStyle={styles.favoriteIcon}
              iconSize={Metrics.icons.xsmall}
              iconColor={isFavorite ? Colors.burgundy : Colors.charcoalGreyTwo}
              onPress={toggleFavorite}
            />
          </Box>
        </Box>
      </Box>
    </Surface>
  );
};

export default MediumEventCard;

const styles = StyleSheet.create({
  actionButtonContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: 30.3,
    justifyContent: "flex-end"
  },
  avatar: {
    height: 47.2,
    width: 47.2
  },
  container: {
    backgroundColor: Colors.snow,
    borderBottomLeftRadius: 13,
    borderBottomRightRadius: 13,
    borderColor: Colors.paleGrey,
    borderStyle: "solid",
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    borderWidth: 1,
    height: 200,
    shadowColor: "rgba(0, 0, 0, 0.16)",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    width: 248
  },

  tentContainer: {
    flexDirection: "row",
    height: 102.9,
    width: 248, //86.3
    borderBottomLeftRadius: 13,
    borderBottomRightRadius: 13
  },
  eventContentContainer: {
    width: 200, //86.3
    ...Layout.alignLeft
  },
  eventDate: {
    color: Colors.darkBurgundy,
    fontFamily: Fonts.type.base,
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "500",
    paddingBottom: 3,
    textAlign: "left",
    width: 140
  },
  eventName: {
    color: Colors.black,
    fontFamily: Fonts.type.base,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "bold",
    textAlign: "left"
  },
  eventOwnerLabel: {
    color: Colors.charcoalGrey,
    fontFamily: Fonts.type.base,
    fontSize: 11,
    fontStyle: "normal",
    fontWeight: "normal",
    letterSpacing: 0,
    lineHeight: 12,
    textAlign: "left",
    width: 140
  },
  favoriteButton: {
    ...buildCircle({
      radius: 26.7 / 2,
      backgroundColor: Colors.snow,
      position: "relative"
    }),
    backgroundColor: Colors.snow,
    borderColor: Colors.warmGreyA400,
    borderStyle: "solid",
    borderWidth: 1
  },
  favoriteIcon: {
    marginTop: 3,
    paddingLeft: 5
  },
  footerContainer: {
    flexDirection: "row",
    height: 36
  },
  image: {
    height: 145,
    width: 344.2
  },
  imageContainer: {
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    height: 97.1,
    overflow: "hidden",
    width: 248.2
  },
  profileContentContainer: {
    flexDirection: "row",
    height: 47.2,
    marginBottom: 12.7,
    width: 344.2
  },
  profileInfoContainer: {
    flexDirection: "column",
    marginLeft: 7.7
  },
  shareButton: {
    ...buildCircle({
      radius: 26.7 / 2,
      backgroundColor: Colors.transparent,
      position: "relative"
    }),
    borderColor: Colors.warmGreyA400,
    borderStyle: "solid",
    borderWidth: 1
  },
  shareIcon: {
    marginTop: 2,
    paddingRight: 12.2
  },
  username: {
    color: Colors.black,
    fontFamily: Fonts.type.base,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "500",
    height: 23,
    textAlign: "left"
  },
  venueNameAndCity: {
    height: 17,
    width: 262,
    // width: 155 + 108,
    fontFamily: Fonts.type.base,
    fontSize: 11,
    fontWeight: "normal",
    fontStyle: "normal",
    textAlign: "left",
    color: Colors.charcoalGreyTwo,
    marginBottom: 9
  }
});
