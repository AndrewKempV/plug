import { ActivityStatus } from "./ActivityStatus";
import { IUser } from "./IUser";

interface IAppState {
  activityStatus: ActivityStatus;
  CurrentUser: IUser;
}
export { IAppState };
