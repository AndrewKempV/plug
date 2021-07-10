import { ApiClient } from "../../api/client";
import {
  createAsyncAction,
  InferActionTypes
} from "../../store/ActionCreators";

const TOGGLE_FAVORITE = "event/toggle-favorite";
const TOGGLE_FAVORITE_SUCCESS = "event/toggle-favorite-success";
const TOGGLE_FAVORITE_FAILURE = "event/toggle-favorite-failure";
const GET_EVENT_FEED = "event/get-feed";
const GET_EVENT_FEED_SUCCESS = "event/get-feed-success";
const GET_EVENT_FEED_FAILURE = "event/get-feed-failure";

export interface ToggleFavoriteRequest {
  eventId: string;
  favorite: boolean;
}

export const toggleFavoriteEvent = async ({
  eventId,
  favorite
}: ToggleFavoriteRequest) => {
  if (favorite) {
    console.log("Removing favorite: " + eventId);
    const response = await ApiClient.instance.removeFavoriteEvent(eventId);
    return response;
  }
  console.log("Adding favorite: " + eventId);
  const response = await ApiClient.instance.createFavoriteEvent(eventId);
  return response;
};

const eventActions = {
  toggleFavoriteEvent: createAsyncAction(
    [TOGGLE_FAVORITE, TOGGLE_FAVORITE_SUCCESS, TOGGLE_FAVORITE_FAILURE],
    toggleFavoriteEvent
  ),
  getEventFeed: createAsyncAction(
    [GET_EVENT_FEED, GET_EVENT_FEED_SUCCESS, GET_EVENT_FEED_FAILURE],
    ApiClient.instance.getEventFeed2
  )
};

export default eventActions;
export type EventActions = InferActionTypes<typeof eventActions>;
