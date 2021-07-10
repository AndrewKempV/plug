import AsyncStorage from "@react-native-community/async-storage";
import { Auth } from "aws-amplify";
import _ from "lodash";
import { IUser } from "../models/IUser";
import { MapboxLocation } from "./MapboxService";
import { PaymentItem } from "../components/SavedPaymentList/SavedPaymentList";
import { RawImage } from "../features/profile/reducer";
import { Location } from "../features/location/reducer";
import { ImageSourcePropType } from "react-native";
import { BoundingBox } from "geolocation-utils";
import { BoundedLocation } from "app/models/Location";

const cognitoUserStorageKey = "@cognito-user";
const tempKey = "@temp";
const HOME_LOCATION_KEY_OLD = "@home";
const PAYMENT_COLLECTION_KEY = "@cards";
const PROFILE_KEY = "@profile";
const LOCATION_KEY = "@location";
const HOME_LOCATION_KEY = `${LOCATION_KEY}/home`;
const HOME_LOCATION_IMAGE = `${LOCATION_KEY}/home-image`;
const PROFILE_IMAGE_KEY = `${PROFILE_KEY}/profile-image`;

export class Storage {
  public static CurrentUsername: string = "";

  public static RefreshCurrentUser() {
    Auth.currentAuthenticatedUser()
      .then(result => Storage.setUserData(JSON.stringify(result)))
      .catch(error => error);
  }

  public static OnUpdateUsername() {
    getPreferredUsername()
      .then(result => (Storage.CurrentUsername = result as string))
      .catch(error => error);
  }

  public static async getUserData(path?: string) {
    try {
      const value = await AsyncStorage.getItem(cognitoUserStorageKey);
      const user = JSON.parse(value!) as IUser;
      if (_.isNil(path) && _.get(user, path!)) {
        return _.get(user, path!);
      } else {
        return user;
      }
    } catch (e) {
      // Alert.alert(`Error: ${e}`);
      return null;
    }
  }

  public static async setUserData(value: string) {
    try {
      await AsyncStorage.setItem(cognitoUserStorageKey, value);
    } catch (e) {
      // Alert.alert(`Error: ${e}`);
    }
  }

  public static async getUsername() {
    const user = (await getUserData()) as IUser;
    if (!_.isNil(user)) {
      return user.auth.username as string;
    }
  }

  public static async getPreferredUsername() {
    const user = await getUserData();
    if (!_.isNil(user)) {
      return user.cognitoAttributes.preferred_username;
    }
  }
}

const getUserData = async (path?: string) => {
  try {
    const value = await AsyncStorage.getItem(cognitoUserStorageKey);
    const user = JSON.parse(value!);
    if (_.isNil(path) && _.get(user, path!)) {
      return _.get(user, path!);
    } else {
      return user as IUser;
    }
  } catch (e) {
    // Alert.alert(`Error: ${e}`);
    return null;
  }
};

const setUserData = async (value: string) => {
  try {
    await AsyncStorage.setItem(cognitoUserStorageKey, value);
  } catch (e) {
    // Alert.alert(`Error: ${e}`);
  }
};

const getUsername = async () => {
  const user = (await getUserData()) as IUser;
  if (!_.isNil(user)) {
    return user.auth.username;
  }
};

const getPreferredUsername = async () => {
  const user = (await getUserData()) as IUser;
  if (!_.isNil(user)) {
    return user.attributes.preferred_username;
  }
};

const setSavedPayments = async (items: PaymentItem[]) => {
  try {
    await AsyncStorage.setItem(PAYMENT_COLLECTION_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn(error);
  }
};

const deletePaymentItem = async (item: PaymentItem) => {
  try {
    const stored = await getSavedPayments();
    if (!_.isNil(stored)) {
      const items = [...stored.filter(card => card.id !== item.id)];
      await AsyncStorage.setItem(PAYMENT_COLLECTION_KEY, JSON.stringify(items));
    }
  } catch (error) {
    console.warn(error);
  }
};

const getSavedPayments = async () => {
  try {
    const value = await AsyncStorage.getItem(PAYMENT_COLLECTION_KEY);
    if (!_.isNil(value)) {
      return JSON.parse(value) as PaymentItem[];
    }
  } catch (error) {
    console.log(error);
  }
};

const getHomeLocation = async (): Promise<MapboxLocation | null> => {
  try {
    const value = await AsyncStorage.getItem(HOME_LOCATION_KEY_OLD);
    if (!_.isNil(value)) {
      return JSON.parse(value) as MapboxLocation;
    }
    return null;
  } catch (e) {
    return null;
    // Alert.alert(`Error: ${e}`);
  }
};

export const setHome = async (value: BoundedLocation) => {
  console.log(value);
  await AsyncStorage.setItem(HOME_LOCATION_KEY, JSON.stringify(value));
};

export const getHome = async (): Promise<BoundedLocation | null> => {
  const home = await AsyncStorage.getItem(HOME_LOCATION_KEY);
  if (home) {
    return JSON.parse(home) as (BoundedLocation);
  }
  return null;
};

export const setHomeImage = async (imageUri: string) => {
  await AsyncStorage.setItem(HOME_LOCATION_IMAGE, imageUri);
};

export const getHomeImage = async () => {
  const image = await AsyncStorage.getItem(HOME_LOCATION_IMAGE);
  return image;
};

const setHomeLocation = async (value: MapboxLocation) => {
  try {
    await AsyncStorage.setItem(HOME_LOCATION_KEY_OLD, JSON.stringify(value));
  } catch (e) {
    // Alert.alert(`Error: ${e}`);
  }
};

const getTempValue = async () => {
  try {
    const value = await AsyncStorage.getItem(tempKey);
    return value;
  } catch (e) {
    // Alert.alert(`Error: ${e}`);
  }
};

const setTempValue = async (value: string) => {
  try {
    await AsyncStorage.setItem(tempKey, value);
  } catch (e) {
    // Alert.alert(`Error: ${e}`);
  }
};

const setRawProfileImage = async (image: RawImage) => {
  await AsyncStorage.setItem(PROFILE_IMAGE_KEY, JSON.stringify(image));
};
const getRawProfileImage = async () => {
  try {
    const image = await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
    if (image) {
      return JSON.parse(image) as RawImage;
    }
  } catch (e) {}
};

export default {
  getUserData,
  setUserData,
  getUsername,
  getPreferredUsername,
  getTempValue,
  setTempValue,
  getHomeLocation,
  setHomeLocation,
  setSavedPayments,
  getSavedPayments,
  deletePaymentItem,
  UserStorage: Storage,
  setRawProfileImage,
  getRawProfileImage
};
