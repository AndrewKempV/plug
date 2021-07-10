import React, { useEffect } from "react";
import {
  StyleSheet,
  Image,
  View,
  StyleProp,
  ViewStyle,
  Text,
  Alert
} from "react-native";
import {
  EventModel,
  UserProfileModel,
  BaseResponseModelUserProfileModel
} from "../../../api/profile";
import { Surface } from "../../../components/Typings/Surface";
import { Colors, Layout, Fonts } from "../../../config/styles";
import Avatar from "../../../components/Avatar";
import { ApiClient } from "../../../api/client";
import { BetterButton } from "../../../components/Button";
import Metrics from "../../../config/metrics";
import { formatEventTime, formatStartTime } from "../../../utils/formatters";
import { ToggleFavoriteRequest } from "../../event/actions";
import { makeCancellable } from "../../../hooks/useCancellablePromise";
import { AxiosResponse } from "axios";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import NavigationService from "app/utils/NavigationService";
interface Props {
  event: EventModel;
  containerStyle?: StyleProp<ViewStyle>;
  toggleFavoriteEvent: ({ eventId, favorite }: ToggleFavoriteRequest) => void;
}

interface State {
  user: UserProfileModel;
}
const initialState: State = {
  user: {}
};

const LargeEventCard = ({
  event,
  containerStyle,
  toggleFavoriteEvent
}: Props) => {
  const [state, setState] = React.useState<State>(initialState);
  const userRef = React.useRef<UserProfileModel>();
  const fakeTimeLastSeen = (Math.round(Math.random() * 100) % 10) + 1;
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

  const { profileImageUrl, username } = state.user;

  const {
    eventName,
    venueName,
    city,
    eventStartTime,
    eventEndTime,
    favorite,
    eventId
  } = event;

  const source = {
    uri: profileImageUrl ? profileImageUrl : ""
  };
  const toggleFavorite = () => {
    toggleFavoriteEvent({
      favorite: favorite!,
      eventId: eventId!
    });
  };
  const goToUserProfile = () =>
    NavigationService.push("OtherProfile", {
      profileId: event.ownerUserProfileId,
      priorRoute: NavigationService.getCurrentRoute()
    });
  const goToEventDetail = () =>
    NavigationService.navigate("EventDetail", {
      eventId: event.eventId,
      fromRoute: NavigationService.getCurrentRoute()
    });
  const share = () => Alert.alert("Event sharing is not available yet");
  return (
    <Surface style={[styles.container, containerStyle]}>
      <View style={styles.profileContentContainer} collapsable={true}>
        <Avatar face={{ source }} circleSize={23.6} onPress={goToUserProfile} />
        <View style={styles.profileInfoContainer} collapsable={true}>
          <Text
            style={styles.username}
            ellipsizeMode={"tail"}
            numberOfLines={1}
            onPress={goToUserProfile}
          >
            {username || ""}
          </Text>
          <Text
            style={styles.lastObserved}
            ellipsizeMode={"tail"}
            numberOfLines={1}
          >{`${fakeTimeLastSeen} hours ago`}</Text>
        </View>
      </View>
      <View style={styles.imageContainer}>
        {event.primaryImageUrl && (
          <TouchableWithoutFeedback onPress={goToEventDetail}>
            <Image
              style={styles.image}
              source={{
                uri: event.primaryImageUrl ? event.primaryImageUrl : ""
              }}
            />
          </TouchableWithoutFeedback>
        )}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.eventContentContainer} collapsable={true}>
          <Text
            style={styles.eventName}
            ellipsizeMode={"tail"}
            numberOfLines={1}
            onPress={goToEventDetail}
          >
            {eventName}
          </Text>
          <Text
            style={styles.venueNameAndCity}
            ellipsizeMode={"tail"}
            numberOfLines={1}
            onPress={goToEventDetail}
          >
            {`${venueName || ""}, ${city || ""}`}
          </Text>
          <Text
            style={styles.eventDate}
            ellipsizeMode={"tail"}
            numberOfLines={1}
            onPress={goToEventDetail}
          >
            {formatStartTime(eventStartTime!)}
          </Text>
        </View>
        <View style={styles.actionButtonContainer} collapsable={true}>
          <BetterButton
            style={styles.shareButton}
            iconSetName={"Plugg"}
            iconName={"share"}
            iconStyle={styles.shareIcon}
            iconSize={Metrics.icons.small}
            iconColor={Colors.charcoalGreyTwo}
            onPress={share}
          />
          <BetterButton
            style={styles.favoriteButton}
            iconSetName={"ionicon"}
            iconName={favorite ? "md-heart" : "md-heart-empty"}
            iconStyle={styles.favoriteIcon}
            iconSize={Metrics.icons.small}
            iconColor={favorite ? Colors.burgundy : Colors.charcoalGreyTwo}
            onPress={toggleFavorite}
          />
        </View>
      </View>
    </Surface>
  );
};

export default LargeEventCard;

const styles = StyleSheet.create({
  actionButtonContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: 90.3,
    justifyContent: "flex-end"
  },
  avatar: {
    height: 47.2,
    width: 47.2
  },
  container: {
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    height: 295.3,
    width: 344.2
  },
  contentContainer: {
    flexDirection: "row"
  },
  eventContentContainer: {
    height: 90.3,
    width: 262, //86.3
    ...Layout.alignLeft
  },
  eventDate: {
    color: Colors.darkBurgundy,
    fontFamily: Fonts.type.base,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "500",
    height: 20,
    textAlign: "left",
    width: 250
  },
  eventName: {
    color: Colors.black,
    fontFamily: Fonts.type.base,
    fontSize: 17,
    fontStyle: "normal",
    fontWeight: "bold",
    height: 22,
    textAlign: "left"
  },
  favoriteButton: {
    backgroundColor: Colors.snow,
    borderColor: Colors.warmGreyA400,
    borderRadius: 16,
    borderStyle: "solid",
    borderWidth: 1,
    height: 32,
    marginRight: 4.7,
    marginTop: 25,
    width: 32
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
    height: 145,
    marginBottom: 14.3,
    overflow: "hidden",
    width: 344.2
  },
  lastObserved: {
    height: 12,
    fontFamily: Fonts.type.base, //"Europa",
    fontSize: 12,
    fontWeight: "300",
    fontStyle: "normal",
    textAlign: "left",
    color: Colors.steelGreyTwo
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
    backgroundColor: Colors.snow,
    borderColor: Colors.warmGreyA400,

    borderRadius: 16,
    borderStyle: "solid",
    borderWidth: 1,
    height: 32,
    marginRight: 17,
    marginTop: 25,
    width: 32
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
    fontSize: 15,
    fontWeight: "normal",
    fontStyle: "normal",
    textAlign: "left",
    color: Colors.charcoalGreyTwo,
    marginBottom: 9
  }
});
