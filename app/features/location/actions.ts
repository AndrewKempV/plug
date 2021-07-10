import { ApiClient } from "../../api/client";
import {
  createAsyncAction,
  InferActionTypes,
  createAction
} from "../../store/ActionCreators";
import Storage, {
  setHome,
  setHomeImage,
  getHomeImage,
  getHome
} from "../../utils/storage";
import { Location } from "./reducer";
import {
  MapboxService,
  MapboxLocationResponse,
  MapboxLocation
} from "../../utils/MapboxService";
import { GeolocationReturnType } from "react-native";
import { LocationImageRequest, LocationImageResponse } from "../../api/types";
import QueryUtils from "../../utils/QueryUtils";
import { BoundedLocation } from "app/models/Location";

const GET_LOCATION_IMAGE = "location/GET_LOCATION_IMAGE";
const GET_LOCATION_IMAGE_SUCCESS = "location/GET_LOCATION_IMAGE_SUCCESS";
const GET_LOCATION_IMAGE_FAILURE = "location/GET_LOCATION_IMAGE_FAILURE";

const SET_HOME_BANNER = "location/SET_HOME_BANNER";
const SET_HOME_BANNER_SUCCESS = "location/SET_HOME_BANNER_SUCCESS";
const SET_HOME_BANNER_FAILURE = "location/SET_HOME_BANNER_FAILURE";

const GET_HOME_BANNER = "location/GET_HOME_BANNER";
const GET_HOME_BANNER_SUCCESS = "location/GET_HOME_BANNER_SUCCESS";
const GET_HOME_BANNER_FAILURE = "location/GET_HOME_BANNER_FAILURE";

const GET_HOME_LOCATION = "location/GET_HOME_LOCATION";
const GET_HOME_LOCATION_SUCCESS = "location/GET_HOME_LOCATION_SUCCESS";
const GET_HOME_LOCATION_FAILURE = "location/GET_HOME_LOCATION_FAILURE";

const SET_HOME_LOCATION = "location/SET_HOME_LOCATION";
const SET_HOME_LOCATION_SUCCESS = "location/SET_HOME_LOCATION_SUCCESS";
const SET_HOME_LOCATION_FAILURE = "location/SET_HOME_LOCATION_FAILURE";

const SET_HOME_LOCATION_FROM_GPS = "location/SET_HOME_LOCATION_FROM_GPS";
const SET_HOME_LOCATION_FROM_GPS_SUCCESS =
  "location/SET_HOME_LOCATION_FROM_GPS_SUCCESS";
const SET_HOME_LOCATION_FROM_GPS_FAILURE =
  "location/SET_HOME_LOCATION_FROM_GPS_FAILURE";

const SET_HOME_LOCATION_AND_BANNER_FROM_GPS =
  "location/SET_HOME_LOCATION_AND_BANNER_FROM_GPS";
const SET_HOME_LOCATION_AND_BANNER_FROM_GPS_SUCCESS =
  "location/SET_HOME_LOCATION_AND_BANNER_FROM_GPS_SUCCESS";
const SET_HOME_LOCATION_AND_BANNER_FROM_GPS_FAILURE =
  "location/SET_HOME_LOCATION_AND_BANNER_FROM_GPS_FAILURE";

interface LocationWithBanner {
  location: Location;
  homeBannerUrl: string;
}
export const mapboxToLocation = (
  response: MapboxLocationResponse
): BoundedLocation => {
  const places = response.features.filter(feature =>
    feature.place_type.includes("place")
  );
  const zips = response.features.filter(feature =>
    feature.place_type.includes("postcode")
  );
  const city = places.pop();
  const zip = zips.pop();
  if (city && zip) {
    const national = city!.place_name.split(",");
    if (national.length >= 2) {
      const state = national[1];
      const address = {
        city: city.text,
        zip: zip.text,
        state,
        geolocation: {
          latitude: city.center[1],
          longitude: city.center[0]
        },
        bbox: city.bbox
      };
      return address;
    }
  }
  return {};
};

export const mapboxItemToLocation = (
  response: MapboxLocation
): BoundedLocation => {
  const city = response.context.find(x => x.id.includes("place"));
  const region = response.context.find(x => x.id.includes("region"));
  const zip = response.context.find(x => x.id.includes("postcode"));
  const [longitude, latitude] = response.center;
  if (city && zip) {
    const address = {
      street: response.properties['address'] as string,
      city: city.text,
      zip: zip.text,
      state: region?.text,
      region: region?.short_code,
      geolocation: {
        latitude,
        longitude
      },
      bbox: response.bbox
    };
    console.log(address);
    return address;
  }
  return {};
};

export const getHomeLocationFromGPS = async (
  position: GeolocationReturnType
): Promise<BoundedLocation | null> => {
  const {
    coords: { latitude, longitude }
  } = position;

  const response = await MapboxService.reverseGeocode({
    geolocation: {
      latitude,
      longitude
    },
    types: ["place", "postcode"]
  });

  const address = mapboxToLocation(response.predictions);
  if (address) {
    return address;
  }
  return null;
};

export const updateHomeLocationFromGPS = async (
  position: GeolocationReturnType
): Promise<BoundedLocation | null> => {
  const {
    coords: { latitude, longitude }
  } = position;

  const response = await MapboxService.reverseGeocode({
    geolocation: {
      latitude,
      longitude
    },
    types: ["place", "postcode", "address"]
  });

  const address = mapboxToLocation(response.predictions);
  if (address) {
    await setHome(address);
  }
  return null;
};

const updateHomeLocationAndBannerFromGPS = async (
  position: GeolocationReturnType
  //@ts-ignore
): Promise<LocationWithBanner> => {
  const location = await getHomeLocationFromGPS(position);
  if (location) {
    const { zip, city, state } = location;
    const homeBannerUrl = await updateHomeBanner({
      city: city!,
      state: state!,
      zipCode: zip!
    });
    await setHome(location);
    return {
      location,
      homeBannerUrl
    };
  }
};

export const updateHomeBanner = async ({
  city,
  state,
  zipCode
}: LocationImageRequest) => {
  const image = await ApiClient.instance.getLocationImage({
    city,
    state,
    zipCode
  });
  await setHomeImage(image.imageUrl);
  return image.imageUrl;
};

export const syncHomeBannerWithStorage = async () => {
  const home = await getHome();
  console.log(home);
  if (home) {
    const newUrl = await updateHomeBanner({
      city: home.city!,
      state: home.state!,
      zipCode: home.zip!
    });
    return newUrl;
  }
};

const locationActions = {
  getLocationImage: createAsyncAction(
    [
      GET_LOCATION_IMAGE,
      GET_LOCATION_IMAGE_SUCCESS,
      GET_LOCATION_IMAGE_FAILURE
    ],
    ApiClient.instance.getLocationImage
  ),
  setHomeLocation: createAsyncAction(
    [SET_HOME_LOCATION, SET_HOME_LOCATION_SUCCESS, SET_HOME_LOCATION_FAILURE],
    setHome
  ),
  getHomeLocation: createAsyncAction(
    [GET_HOME_LOCATION, GET_HOME_LOCATION_SUCCESS, GET_HOME_LOCATION_FAILURE],
    getHome
  ),
  updateHomeLocationFromGPS: createAsyncAction(
    [
      SET_HOME_LOCATION_FROM_GPS,
      SET_HOME_LOCATION_FROM_GPS_SUCCESS,
      SET_HOME_LOCATION_FROM_GPS_FAILURE
    ],
    updateHomeLocationFromGPS
  ),
  updateHomeLocationAndBannerFromGPS: createAsyncAction(
    [
      SET_HOME_LOCATION_AND_BANNER_FROM_GPS,
      SET_HOME_LOCATION_AND_BANNER_FROM_GPS_SUCCESS,
      SET_HOME_LOCATION_AND_BANNER_FROM_GPS_FAILURE
    ],
    updateHomeLocationAndBannerFromGPS
  ),
  updateHomeBannerFromStorage: createAsyncAction(
    [SET_HOME_BANNER, SET_HOME_BANNER_SUCCESS, SET_HOME_BANNER_FAILURE],
    syncHomeBannerWithStorage
  ),
  getHomeBanner: createAsyncAction(
    [GET_HOME_BANNER, GET_HOME_BANNER_SUCCESS, GET_HOME_BANNER_FAILURE],
    getHomeImage
  )
};

export default locationActions;
export type LocationActions = InferActionTypes<typeof locationActions>;
