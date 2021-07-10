import { EventModel } from "../../api/profile";
import { EventActions } from "./actions";
import { groupsOf } from "../../utils/helpers";
import splitEvery from "ramda/es/splitEvery";

interface EventState {
  feed: EventModel[];
}

export const initialState: EventState = {
  feed: []
};

export function eventReducer(
  state: EventState = initialState,
  action: EventActions
): EventState {
  switch (action.type) {
    case "event/toggle-favorite":
      return {
        ...state
      };

    case "event/toggle-favorite-success":
      const req = action.payload.req!;
      let idx = state.feed.findIndex(e => e.eventId === req.eventId);
      if (idx !== -1) {
        state.feed[idx].favorite = !!req.favorite;
        return {
          feed: [...state.feed]
        };
      }

      return {
        ...state
      };

    case "event/toggle-favorite-failure":
      console.log(action);
      return {
        ...state
      };
    case "event/get-feed":
      return {
        ...state
      };
    case "event/get-feed-success":
      const events = action.payload.res;
      return {
        feed: events
      };

    case "event/get-feed-failure":
      return {
        ...state
      };

    default:
      return {
        ...state
      };
  }
}
