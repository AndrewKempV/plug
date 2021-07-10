import authActions from "features/authentication/actions";
import profileActions from "features/profile/actions";
import settingsActions from "features/settings/actions";
import eventActions from "features/event/actions";
import locationActions from "features/location/actions";
import { InferActionTypes } from "./ActionCreators";

const AppActions = {
  ...authActions,
  ...profileActions,
  ...settingsActions,
  ...eventActions,
  ...locationActions
};

export default AppActions;
export type AppActionObjectTypes = InferActionTypes<typeof AppActions>;
