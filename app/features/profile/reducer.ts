import { AxiosResponse } from "axios";
import _ from "lodash";
import {
  BaseResponseModelobject,
  EventModel,
  FullUserProfileModel,
  UpdateProfileImageModel,
  UserProfileModel
} from "../../api/profile";
import { APIActionStatus } from "../../models/ApiActionStatus";
import { AppActionObjectTypes } from "../../store/AppActions";
import { IEnumerable, List } from "../../types/collections";
import { StringUnion, notEmpty } from "../../utils/helpers";

export type MinusKeys<T, U> = Pick<T, Exclude<keyof T, keyof U>>;
export type Defined<T> = T extends undefined ? never : T;
export type MergedProperties<U, T> = {
  [K in keyof T & keyof U]: undefined extends T[K]
    ? Defined<T[K] | U[K]>
    : T[K];
};
export const merge = <T extends object, U extends object>(t: T, u: U) =>
  ({
    ...(t as object),
    ...(u as object)
  } as MinusKeys<T, U> & MinusKeys<U, T> & MergedProperties<U, T>);

type EntityId = typeof StringUnion | string;
interface Entity {
  id: EntityId;
}

interface IRepository<T extends Entity> {
  storage: IEnumerable<T>;
  get: (id: EntityId) => T | null;
  getPartition: (limit: number, offset: number) => T[];
  add: (entity: T) => boolean;
  update: (entity: T) => boolean;
  merge: (entity: T) => T | undefined;
  deleteById: (id: EntityId) => void;
  delete: (entity: T) => void;
  refresh: (entities: T[]) => void;
}

// type EventModelCollection = EventModel[];
// type ProfileModelCollection = UserProfileModel[];

interface Profile extends Entity {
  profile: UserProfileModel | FullUserProfileModel;
  suggestions: UserProfileModel[];
  favorites: EventModel[];
  history: EventModel[];
  hosted: EventModel[];
  blocked?: UserProfileModel;
}

// const extend = <T extends EventModel>() =>
class Repository<T extends Entity> implements IRepository<T> {
  constructor() {}
  public storage = new List<T>();

  get(id: EntityId) {
    return this.storage.firstOrDefault(entity => entity.id === id);
  }

  getPartition(limit: number, offset: number) {
    return this.storage.toArray().slice(offset, limit);
  }

  add(entity: T) {
    if (this.storage.count(item => item.id === entity.id) === 0) {
      false;
    }
    this.storage.add(entity);
    return true;
  }

  update(entity: T) {
    if (this.storage.any(item => item.id === entity.id)) {
      this.storage.remove(item => item.id === entity.id);
    }
    this.storage.add(entity);
    return true;
  }
  //Should be called mergeOrAdd
  merge(entity: T) {
    const old = this.get(entity.id);
    if (old !== null) {
      const merged: T = merge(old, entity);
      this.storage.remove(item => item.id === entity.id);
      this.storage.add(merged);
      return merged;
    } else {
      this.storage.add(entity);
      return entity;
    }
  }

  deleteById(id: EntityId) {
    this.storage.remove(item => item.id === id);
    // if(!this.storage.any(item => item.id === id)) {
    //   return false;
    // }
    // this.storage.remove(item => item.id === id);
    // return true;
  }

  delete(entity: T) {
    this.storage.remove(item => item.id === entity.id);
  }

  refresh(entities: T[]) {
    entities.forEach(entity => {
      this.merge(entity);
    });
  }

  asEnumerable() {
    return this.storage.asEnumerable();
  }

  toArray() {
    return this.storage.toArray();
  }

  reset() {
    this.storage.clear();
  }

  setStorage(array: T[]) {
    this.storage = new List(array);
  }
}

// class EventRepository implements Repository<string, Event> {

// cache: Dictionary<string, Event> = new Dictionary<string, Event>();

interface Profile {
  profile: UserProfileModel | FullUserProfileModel;
  suggestions: UserProfileModel[];
  favorites: EventModel[];
  history: EventModel[];
  hosted: EventModel[];
}

type ProfileEntity = Profile & Entity;
type EventEntity = EventModel & Entity;

export interface RawImage {
  base64EncodedImage: string;
  contentType: string;
}
interface ProfileState {
  profileRepo: Repository<ProfileEntity>;
  eventRepo: Repository<EventEntity>;
  ownProfile: ProfileEntity;
  status: APIActionStatus;
  profile: FullUserProfileModel;
  suggestions: UserProfileModel[];
  favorites: EventModel[];
  history: EventModel[];
  hosted: EventModel[];
  blocked: string[];
  lastFetchedProfile: UserProfileModel;
  error?: string;
  profileImage?: RawImage;
  otherProfileInFocus: string;
}
const emptyProfile = {
  id: "",
  suggestions: [],
  profile: {},
  history: [],
  hosted: [],
  favorites: []
};
const initialState: ProfileState = {
  status: APIActionStatus.STARTED,
  profile: {},
  suggestions: [],
  favorites: [],
  history: [],
  hosted: [],
  lastFetchedProfile: {},
  error: "",
  ownProfile: emptyProfile,
  blocked: [],
  profileRepo: new Repository<ProfileEntity>(),
  eventRepo: new Repository<EventEntity>(),
  otherProfileInFocus: ""
};

export function profileReducer(
  state: ProfileState = initialState,
  action: AppActionObjectTypes
): ProfileState {
  switch (action.type) {
    case "CREATE_PROFILE":
      return {
        ...state,
        status: APIActionStatus.STARTED
      };

    case "CREATE_USER_PROFILE_SUCCESS":
      console.log(action);
      return {
        ...state,
        status: APIActionStatus.SUCCEEDED
      };

    case "CREATE_USER_PROFILE_FAIL":
      return {
        ...state,
        error: action.payload.res,
        status: APIActionStatus.FAILED
      };

    case "GET_OWN_PROFILE":
      return {
        ...state,
        status: APIActionStatus.STARTED
      };

    case "GET_OWN_PROFILE_SUCCESS":
      const profile = readResponseFirstOrDefault<FullUserProfileModel>(action);
      if (profile.userProfileId) {
        return {
          ...state,
          profile,
          ownProfile: {
            ...state.ownProfile,
            profile
          },
          status: APIActionStatus.SUCCEEDED
        };
      }

    case "GET_OWN_PROFILE_FAIL":
      return {
        ...state,
        error: action.payload.res,
        status: APIActionStatus.FAILED
      };

    case "GET_USER_PROFILE":
      return {
        ...state,
        status: APIActionStatus.STARTED
      };

    case "GET_USER_PROFILE_SUCCESS":
      const otherProfile = readResponseFirstOrDefault<UserProfileModel>(action);
      if (otherProfile.userProfileId) {
        const old = state.profileRepo.get(otherProfile.userProfileId);
        if (old !== null) {
          state.profileRepo.update({
            ...old,
            profile: otherProfile,
            id: otherProfile.userProfileId
          });
        } else {
          state.profileRepo.add({
            profile: otherProfile,
            id: otherProfile.userProfileId,
            hosted: [],
            favorites: [],
            history: [],
            suggestions: []
          });
        }
      }

      // state.profileCache.filter(profile=> otherProfile.bio === otherProfile) //merge and update if necessary here.
      return {
        ...state,
        lastFetchedProfile: otherProfile,
        status: APIActionStatus.SUCCEEDED
      };

    case "GET_USER_PROFILE_FAILURE":
      return {
        ...state,
        error: action.payload.res,
        status: APIActionStatus.FAILED
      };

    case "UPDATE_PROFILE":
      return {
        ...state,
        status: APIActionStatus.STARTED
      };

    case "UPDATE_PROFILE_SUCCESS":
      console.log(action);
      return {
        ...state,
        status: APIActionStatus.SUCCEEDED
      };

    case "UPDATE_PROFILE_FAIL":
      return {
        ...state,
        error: action.payload.res,
        status: APIActionStatus.FAILED
      };

    case "UPDATE_PROFILE_IMAGE":
      return {
        ...state,
        status: APIActionStatus.STARTED
      };

    case "UPDATE_PROFILE_IMAGE_SUCCESS":
      return {
        ...state,
        status: APIActionStatus.STARTED,
        profileImage: action.payload.req as RawImage
      };

    case "UPDATE_PROFILE_IMAGE_FAIL":
      return {
        ...state,
        error: action.payload.res,
        status: APIActionStatus.FAILED
      };

    case "GET_FAVORITE_EVENTS":
      return {
        ...state,
        status: APIActionStatus.STARTED
      };

    case "GET_FAVORITE_EVENTS_SUCCESS":
      console.log(action); // determine offset, limit
      console.log(action);
      const favorites = readResponse<EventModel[]>(action);
      favorites.forEach(fav => {
        if (fav.eventId) {
          state.eventRepo.merge({
            ...fav,
            id: fav.eventId
          });
        }
      });

      return {
        ...state,
        favorites,
        status: APIActionStatus.SUCCEEDED
      };

    case "GET_FAVORITE_EVENTS_FAILURE":
      return {
        ...state,
        error: action.payload.res,
        status: APIActionStatus.FAILED
      };

    case "GET_PAST_EVENTS":
      return {
        ...state,
        status: APIActionStatus.STARTED
      };

    case "GET_PAST_EVENTS_SUCCESS":
      const history = readResponse<EventModel[]>(action);
      return {
        ...state,
        history,
        status: APIActionStatus.SUCCEEDED
      };

    case "GET_PAST_EVENTS_FAILURE":
      return {
        ...state,
        error: action.payload.res,
        status: APIActionStatus.FAILED
      };

    case "GET_HOSTED_EVENTS":
      return {
        ...state,
        status: APIActionStatus.STARTED
      };

    case "GET_HOSTED_EVENTS_SUCCESS":
      const hosted = readResponse<EventModel[]>(action);
      hosted.forEach(event => {
        if (event.eventId) {
          state.eventRepo.merge({
            ...event,
            id: event.eventId
          });
        }
      });
      return {
        ...state,
        hosted,
        status: APIActionStatus.SUCCEEDED
      };

    case "GET_HOSTED_EVENTS_FAILURE":
      return {
        ...state,
        error: action.payload.res,
        status: APIActionStatus.FAILED
      };

    case "GET_SUGGESTED_USERS":
      return {
        ...state,
        status: APIActionStatus.STARTED
      };

    case "GET_SUGGESTED_USERS_SUCCESS":
      const suggestions = readResponse<UserProfileModel[]>(action);
      suggestions.forEach(suggestion => {
        if (suggestion.userProfileId) {
          const { userProfileId } = suggestion;
          const old = state.profileRepo.get(userProfileId);
          if (old !== null) {
            state.profileRepo.update({
              ...old,
              profile: otherProfile,
              id: userProfileId
            });
          } else {
            state.profileRepo.add({
              profile: otherProfile,
              id: userProfileId,
              hosted: [],
              favorites: [],
              history: [],
              suggestions: []
            });
          }
        }
      });

      return {
        ...state,
        suggestions,
        status: APIActionStatus.SUCCEEDED
      };

    case "GET_SUGGESTED_USERS_FAILURE":
      return {
        ...state,
        error: action.payload.res,
        status: APIActionStatus.FAILED
      };

    case "CREATE_FOLLOWER":
      return {
        ...state,
        status: APIActionStatus.STARTED
      };
    case "CREATE_FOLLOWER_SUCCESS":
      console.log(action);
      return {
        ...state,
        status: APIActionStatus.SUCCEEDED
      };

    case "GET_BLOCKED_USERS":
      return {
        ...state,
        status: APIActionStatus.STARTED
      };

    case "GET_BLOCKED_USERS_SUCCESS":
      const blocked = readResponse<string[]>(action);
      // tslint:disable-next-line:no-console
      console.log(blocked);
      return {
        ...state,
        blocked,
        status: APIActionStatus.SUCCEEDED
      };

    case "REMOVE_FAVORITE_EVENT":
      return {
        ...state,
        status: APIActionStatus.STARTED
      };
    case "REMOVE_FAVORITE_EVENT_SUCCESS":
      const removedId = action.payload.req as string;
      console.log(removedId);
      console.log(action);
      state.eventRepo.merge({
        id: removedId,
        favorite: false
      });
      return {
        ...state,
        favorites: state.favorites.filter(
          favorite => favorite.eventId !== removedId
        ),
        status: APIActionStatus.SUCCEEDED
      };
    case "REMOVE_FAVORITE_EVENT_FAILURE":
      return {
        ...state,
        status: APIActionStatus.FAILED
      };

    case "CREATE_FAVORITE_EVENT":
      return {
        ...state,
        status: APIActionStatus.STARTED
      };
    case "CREATE_FAVORITE_EVENT_SUCCESS":
      const addedId = action.payload.req as string;
      console.log(action);
      state.eventRepo.merge({
        id: addedId,
        favorite: true
      });
      const favoriteIndex = state.favorites.findIndex(
        favorite => favorite.eventId === addedId
      );
      if (favoriteIndex !== -1) {
        state.favorites[favoriteIndex].favorite = true;
        return {
          ...state,
          favorites: [...state.favorites],
          status: APIActionStatus.SUCCEEDED
        };
      }
      return {
        ...state,
        status: APIActionStatus.SUCCEEDED
      };
    case "CREATE_FAVORITE_EVENT_FAILURE":
      console.warn(action);
      return {
        ...state,
        status: APIActionStatus.FAILED
      };
    case "GET_FAVORITE_EVENTS_FOR_USER":
      return {
        ...state,
        status: APIActionStatus.STARTED
      };
    case "GET_FAVORITE_EVENTS_FOR_USER_SUCCESS":
      console.log(action);
      const userProfileId = action.payload.req!.userProfileId as string;
      const faves = readResponse<EventModel[]>(action);
      if (faves.length > 0) {
        faves.forEach(event => {
          if (event.eventId)
            state.eventRepo.merge({
              ...event,
              id: event.eventId
            });
        });
        const target = state.profileRepo.get(userProfileId);
        if (target !== null) {
          state.profileRepo.update({
            ...target,
            id: userProfileId
          });
        } else {
          state.profileRepo.add({
            profile: {
              userProfileId
            },
            id: userProfileId,
            favorites: faves,
            hosted: [],
            history: [],
            suggestions: []
          });
        }
      }
      return {
        ...state,
        status: APIActionStatus.SUCCEEDED
      };

    case "GET_FAVORITE_EVENTS_FOR_USER_FAILURE":
      return {
        ...state,
        status: APIActionStatus.FAILED
      };
    case "GET_PAST_EVENTS_FOR_USER":
      return {
        ...state,
        status: APIActionStatus.STARTED
      };
    case "GET_PAST_EVENTS_FOR_USER_SUCCESS":
      console.log(action);
      const id = action.payload.req!.userProfileId as string;
      const prior = readResponse<EventModel[]>(action);
      if (prior.length > 0) {
        prior.forEach(event => {
          if (event.eventId)
            state.eventRepo.merge({
              ...event,
              id: event.eventId
            });
        });
        const target = state.profileRepo.get(id);
        if (target !== null) {
          state.profileRepo.update({
            ...target,
            id
          });
        } else {
          state.profileRepo.add({
            profile: {
              userProfileId: id
            },
            id,
            favorites: [],
            hosted: [],
            history: prior,
            suggestions: []
          });
        }
      }
      return {
        ...state,
        status: APIActionStatus.SUCCEEDED
      };

    case "GET_PAST_EVENTS_FOR_USER_FAILURE":
      return {
        ...state,
        status: APIActionStatus.FAILED
      };

    default:
      return state;
  }
}

export function readResponse<T>(action: AppActionObjectTypes) {
  return unwrapResponse(action.payload.res as AxiosResponse<T>);
}

export function readResponseFirstOrDefault<T>(action: AppActionObjectTypes) {
  return firstOrDefault(action.payload.res as AxiosResponse<T>);
}

export function firstOrDefault<T extends BaseResponseModelobject>(
  response: AxiosResponse<T>
) {
  return response.data.data!.pop() as T;
}

export function unwrapResponse<T extends any>(response: AxiosResponse<T>) {
  return response.data.data as T;
}
