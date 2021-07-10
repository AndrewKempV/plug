import _ from "lodash";
import moment, { ISO_8601 } from "moment";
import React, { PureComponent } from "react";
import {
  Alert,
  Animated,
  Image,
  Text,
  View,
  StyleProp,
  ViewStyle
} from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import { ApiClient } from "api/client";
import { EventModel } from "api/profile";
import Metrics from "config/metrics";
import { Colors } from "config/styles";
import Icon from "../Icon";
import { Surface } from "../Typings/Surface";
import styles from "./styles";
import { formatStartTime } from "utils/formatters";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import NavigationService from "app/utils/NavigationService";

const AnimatedSurface = Animated.createAnimatedComponent(Surface);

interface FavoriteEventCardProps {
  event: EventModel;
  afterPressFavorite?: (favorite: boolean | undefined) => void;
  onRemove?: () => void;
  accentColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

interface FavoriteEventCardState {
  favorited: boolean;
}

const initialState: FavoriteEventCardState = {
  favorited: true
};

class FavoriteEventCard extends PureComponent<
  FavoriteEventCardProps,
  FavoriteEventCardState
> {
  static defaultProps: FavoriteEventCardProps = {
    event: {},
    accentColor: Colors.burgundy
  };

  readonly state: FavoriteEventCardState = initialState;

  control: Animated.Value = new Animated.Value(1);

  componentDidMount() {
    this.setState({ favorited: this.props.event.favorite! });
  }

  render() {
    const animation = {
      opacity: this.control,
      transform: [{ scale: this.control }]
    };
    const {
      primaryImageUrl,
      eventName,
      venueName,
      eventStartTime,
      eventEndTime
    } = this.props.event;
    const source = { uri: primaryImageUrl };
    const goToEventDetail = () =>
      NavigationService.navigate("EventDetail", {
        eventId: this.props.event.eventId,
        fromRoute: NavigationService.getCurrentRoute()
      });
    return (
      <AnimatedSurface
        style={[styles.container, animation, this.props.containerStyle]}
      >
        <TouchableWithoutFeedback onPress={goToEventDetail}>
          <Image style={styles.image} source={source} />
        </TouchableWithoutFeedback>

        <View style={styles.eventInfoContainer}>
          <Text
            style={styles.eventName}
            numberOfLines={1}
            ellipsizeMode={"tail"}
            onPress={goToEventDetail}
          >
            {eventName}
          </Text>
          <Text
            style={styles.eventVenue}
            numberOfLines={1}
            ellipsizeMode={"tail"}
            onPress={goToEventDetail}
          >
            {venueName}
          </Text>
          <Text
            style={styles.dateLabel}
            numberOfLines={1}
            ellipsizeMode={"tail"}
            onPress={goToEventDetail}
          >
            {formatStartTime(eventStartTime!)}
          </Text>
        </View>
        <View style={styles.actionButtonContainer}>
          <Icon
            style={styles.shareIcon}
            name={"share"}
            size={Metrics.icons.small}
            color={Colors.charcoalGrey}
            onPress={this.handlePressShare}
          />
          <Ionicon
            style={styles.favoriteIcon}
            name={this.state.favorited ? "md-heart" : "md-heart-empty"}
            size={Metrics.icons.small}
            color={
              this.state.favorited
                ? this.props.accentColor
                : Colors.charcoalGreyTwo
            }
            onPress={this.handlePressFavorite}
          />
        </View>
      </AnimatedSurface>
    );
  }

  handlePressFavorite = () => {
    const { eventId } = this.props.event;
    if (!_.isNil(eventId)) {
      if (!this.props.event.favorite) {
        ApiClient.instance
          .createFavoriteEvent(eventId)
          .then(response => {
            this.setState(prevState => ({ favorited: !prevState.favorited }));
          })
          .then(() => {
            if (this.props.afterPressFavorite) {
              this.props.afterPressFavorite(this.state.favorited);
            }
          })
          .catch(error => console.warn(error));
      } else {
        ApiClient.instance
          .removeFavoriteEvent(eventId)
          .then(response => {
            this.onRemove();
            this.setState(prevState => ({ favorited: !prevState.favorited }));
          })
          .then(() => {
            if (this.props.afterPressFavorite) {
              this.props.afterPressFavorite(this.state.favorited);
            }
          })
          .catch(error => console.warn(error));
      }
    }
  };

  private onRemove = () => {
    const { onRemove } = this.props;
    if (!_.isNil(onRemove)) {
      Animated.timing(this.control, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true
      }).start(() => onRemove());
    }
  };

  private handlePressShare = () => {
    Alert.alert(`Event sharing is not currently available`);
  };
}

export default FavoriteEventCard;
