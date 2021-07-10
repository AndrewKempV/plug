import { combineReducers } from "redux";
import authReducer from "../features/authentication/reducer";
import { profileReducer } from "../features/profile/reducer";
import { settingReducer } from "../features/settings/reducers";
import { eventReducer } from "../features/event/reducer";
import { locationReducer } from "../features/location/reducer";
import { GetReducerState } from "./ActionCreators";

const reducers = {
  authReducer,
  profileReducer,
  settingReducer,
  eventReducer,
  locationReducer
};

export type StateStore = GetReducerState<typeof reducers>;
export default combineReducers<StateStore>(reducers);
