import { LocationActions } from "./actions";
import { MapboxLocation } from "../../utils/MapboxService";
import { GeolocationData } from "../../hooks/useGeolocation";

export interface Location {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  region?: string;
  geolocation?: GeolocationData;
}

interface LocationState {
  homeLocation?: MapboxLocation;
  location?: Location;
  homeBannerUrl: string;
}

export const initialState: LocationState = {
  homeBannerUrl: ""
};

export function locationReducer(
  state: LocationState = initialState,
  action: LocationActions
): LocationState {
  switch (action.type) {
    case "location/GET_LOCATION_IMAGE":
      return {
        ...state
      };
    case "location/GET_LOCATION_IMAGE_SUCCESS":
      console.log(action.payload);
      const image = action.payload.res;
      return {
        homeBannerUrl: image.imageUrl
      };
    case "location/GET_LOCATION_IMAGE_FAILURE":
      return {
        ...state
      };
    case "location/GET_HOME_LOCATION":
      return {
        ...state
      };
    case "location/GET_HOME_LOCATION_SUCCESS":
      if (action.payload.res) {
        const home = action.payload.res;
        return {
          ...state,
          location: home
        };
      }
      return {
        ...state
      };
    case "location/GET_HOME_LOCATION_FAILURE":
      return {
        ...state
      };
    case "location/SET_HOME_LOCATION":
      return {
        ...state
      };
    case "location/SET_HOME_LOCATION_SUCCESS":
      const home = action.payload.req;
      return {
        ...state,
        location: home
      };
    case "location/SET_HOME_LOCATION_FAILURE":
      return {
        ...state
      };
    case "location/SET_HOME_LOCATION_FROM_GPS":
      return {
        ...state
      };
    case "location/SET_HOME_BANNER":
      return {
        ...state
      };
    case "location/SET_HOME_BANNER_SUCCESS":
      const homeBannerUrl = action.payload.res;
      console.log(homeBannerUrl);
      if (homeBannerUrl) {
        return {
          ...state,
          homeBannerUrl
        };
      }
      return {
        ...state
      };
    case "location/SET_HOME_BANNER_FAILURE":
      return {
        ...state
      };
    case "location/SET_HOME_LOCATION_FROM_GPS":
      return {
        ...state
      };
    case "location/SET_HOME_LOCATION_FROM_GPS_SUCCESS":
      if (action.payload.res) {
        const location = action.payload.res;
        return {
          ...state,
          location
        };
      }
      return {
        ...state
      };
    case "location/SET_HOME_LOCATION_FROM_GPS_FAILURE":
      return {
        ...state
      };
    case "location/SET_HOME_LOCATION_AND_BANNER_FROM_GPS":
      return {
        ...state
      };
    case "location/SET_HOME_LOCATION_AND_BANNER_FROM_GPS_SUCCESS":
      if (action.payload.res) {
        const response = action.payload.res;
        const { location, homeBannerUrl } = response;
        return {
          ...state,
          location,
          homeBannerUrl
        };
      }
      return {
        ...state
      };
    case "location/SET_HOME_LOCATION_AND_BANNER_FROM_GPS_FAILURE":
      return {
        ...state
      };
    default:
      return {
        ...state
      };
  }
}
