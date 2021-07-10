import _ from "lodash";
import { Animated, Geolocation, GeolocationReturnType, NativeModules, Platform } from "react-native";
import { Dimensions, PixelRatio } from "react-native";
import Amplify from "aws-amplify";
import MapboxGL from "@react-native-mapbox-gl/maps";

import aws_exports from "config/aws-exports";

import MapboxApiKey from "config/mapbox";

export const configureApp = () => {
  console.disableYellowBox = true;
  if (Platform.OS === "android") {
    NativeModules.DevSettings.setIsDebuggingRemotely(true);
    NativeModules.DevSettings.setLiveReloadEnabled(true);
    NativeModules.DevSettings.setHotLoadingEnabled(true);
  }
  Amplify.configure(aws_exports);
  MapboxGL.setAccessToken(MapboxApiKey);
}

type Value = Animated.Value;
type ValueXY = Animated.ValueXY;
const pixelRatio = PixelRatio.get();
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export const ValueOrDefault = (value: any, defaultValue: any) => {
  if (_.isNil(value)) {
    return defaultValue;
  } else {
    return value;
  }
};

export function timer<T>(
  promise: Promise<T>,
  ms?: number,
  message?: any
): Promise<T> {
  return new Promise((resolve, reject) => {
    let isExecute = false;
    setTimeout(() => {
      if (isExecute === false) {
        reject(message);
      }
      isExecute = true;
    }, ms);
    Promise.resolve(promise).then((x: any) => {
      if (isExecute === false) {
        resolve(x);
      }
      isExecute = true;
    }, reject);
  });
}

export function delay<T>(ms?: number): Promise<T> {
  return new Promise<T>(resolve => {
    setTimeout(() => resolve(), ms);
  });
}

// tslint:disable-next-line:variable-name
// tslint:disable-next-line:no-shadowed-variable
export async function timing(
  value: Value | ValueXY,
  {
    toValue,
    duration,
    delay,
    easing,
    useNativeDriver
  }: Animated.TimingAnimationConfig
) {
  await new Promise(resolve => {
    Animated.timing(value, {
      toValue,
      duration,
      easing,
      delay,
      useNativeDriver
    }).start(() => resolve());
  });
}

// tslint:disable-next-line:variable-name
// tslint:disable-next-line:no-shadowed-variable
export async function decay(
  value: Value | ValueXY,
  { deceleration, useNativeDriver, velocity }: Animated.DecayAnimationConfig
) {
  await new Promise(resolve => {
    Animated.decay(value, {
      deceleration,
      useNativeDriver,
      velocity
    }).start(() => resolve());
  });
}

// tslint:disable-next-line:variable-name
// tslint:disable-next-line:no-shadowed-variable
export async function spring(
  value: Value | ValueXY,
  config: Animated.SpringAnimationConfig
) {
  await new Promise(resolve => {
    Animated.spring(value, { ...config }).start(() => resolve());
  });
}

export const normalize = (size: number) => {
  if (pixelRatio >= 2 && pixelRatio < 3) {
    // iphone 5s and older Androids
    if (deviceWidth < 360) {
      return size * 0.95;
    }

    // iphone 5
    if (deviceHeight < 667) {
      return size;
      // iphone 6-6s
    }

    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.15;
    }
    // older phablets
    return size * 1.25;
  }

  if (pixelRatio >= 3 && pixelRatio < 3.5) {
    // catch Android font scaling on small machines
    // where pixel ratio / font scale ratio => 3:3
    if (deviceWidth <= 360) {
      return size;
    }

    // Catch other weird android width sizings
    if (deviceHeight < 667) {
      return size * 1.15;
      // catch in-between size Androids and scale font up
      // a tad but not too much
    }

    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.2;
    }

    // catch larger devices
    // ie iphone 6s plus / 7 plus / mi note 等等
    return size * 1.27;
  }

  if (pixelRatio >= 3.5) {
    // catch Android font scaling on small machines
    // where pixel ratio / font scale ratio => 3:3
    if (deviceWidth <= 360) {
      return size;
      // Catch other smaller android height sizings
    }

    if (deviceHeight < 667) {
      return size * 1.2;
      // catch in-between size Androids and scale font up
      // a tad but not too much
    }

    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.25;
    }

    // catch larger phablet devices
    return size * 1.4;
  }

  return size;
};

const getCropperLimitsIfHorizontally = (
  imageWidth: number,
  imageHeight: number,
  W_INT: number,
  H_INT: number,
  W: number,
  H: number,
  BW: number,
  Q: number
) => {
  let TOP_LIMIT = 0;
  let LEFT_LIMIT = 0;
  let BOTTOM_LIMIT = 0;
  let RIGHT_LIMIT = 0;
  const DIFF = 0;

  let w = 0;
  let h = 0;
  let DIST = 0;
  let TOTAL_DIST = 0;

  const w1 = W_INT;
  const h1 = (W_INT * imageHeight) / imageWidth;
  const w2 = (H_INT * imageWidth) / imageHeight;
  const h2 = H_INT;
  if (h1 <= H_INT) {
    h = h1;
    w = w1;
    DIST = (H_INT - h) / 2;
    TOTAL_DIST = DIST + BW;
    TOP_LIMIT = TOTAL_DIST;
    BOTTOM_LIMIT = TOTAL_DIST + Q;
    LEFT_LIMIT = BW;
    RIGHT_LIMIT = BW;
  } else {
    h = h2;
    w = w2;
    DIST = (W_INT - w) / 2;
    TOTAL_DIST = DIST + BW;
    TOP_LIMIT = BW;
    BOTTOM_LIMIT = BW + Q;
    LEFT_LIMIT = TOTAL_DIST;
    RIGHT_LIMIT = TOTAL_DIST;
  }

  return { TOP_LIMIT, LEFT_LIMIT, BOTTOM_LIMIT, RIGHT_LIMIT, DIFF };
};

const getCropperLimitsIfVertically = (
  imageWidth: number,
  imageHeight: number,
  W_INT: number,
  H_INT: number,
  W: number,
  H: number,
  BW: number,
  Q: number
) => {
  let TOP_LIMIT = 0;
  let LEFT_LIMIT = 0;
  let BOTTOM_LIMIT = 0;
  let RIGHT_LIMIT = 0;
  let DIFF = 0;

  let IMAGE_W = 0;
  let IMAGE_H = 0;
  const IMAGE_W_1 = W_INT;
  const IMAGE_H_1 = (W_INT * imageHeight) / imageWidth;
  const IMAGE_W_2 = (H_INT * imageWidth) / imageHeight;
  const IMAGE_H_2 = H_INT;
  if (IMAGE_H_1 <= H_INT) {
    IMAGE_H = IMAGE_H_1;
    IMAGE_W = IMAGE_W_1;
  } else {
    IMAGE_H = IMAGE_H_2;
    IMAGE_W = IMAGE_W_2;
  }

  let w = 0;
  let h = 0;
  const h1 = W_INT;
  const w1 = (IMAGE_W * h1) / IMAGE_H;
  const w2 = H_INT;
  const h2 = (IMAGE_H * w2) / IMAGE_W;
  if (w1 <= H_INT) {
    w = w1;
    h = h1;
  } else {
    w = w2;
    h = h2;
  }
  const Tnew = (H - h) / 2;
  const Bnew = Tnew + Q;
  const Lnew = (W - w) / 2;
  const Rnew = Lnew;
  DIFF = h - w;
  TOP_LIMIT = Tnew + DIFF / 2;
  LEFT_LIMIT = Lnew - DIFF / 2;
  BOTTOM_LIMIT = Bnew + DIFF / 2;
  RIGHT_LIMIT = Rnew - DIFF / 2;

  return { TOP_LIMIT, LEFT_LIMIT, BOTTOM_LIMIT, RIGHT_LIMIT, DIFF };
};

const getCropperLimits = (
  imageWidth: number,
  imageHeight: number,
  rotation: number,
  W_INT: number,
  H_INT: number,
  W: number,
  H: number,
  BW: number,
  Q: number
) => {
  return rotation % 180 === 0
    ? getCropperLimitsIfHorizontally(
        imageWidth,
        imageHeight,
        W_INT,
        H_INT,
        W,
        H,
        BW,
        Q
      )
    : getCropperLimitsIfVertically(
        imageWidth,
        imageHeight,
        W_INT,
        H_INT,
        W,
        H,
        BW,
        Q
      );
};

export { getCropperLimits };
/**
 * @function
 * @param value The current value.
 * @param newValue The future value.
 * @example
 *
 *  let promise: Promise<string> = Promise.reject<string>('foo');
 *
 *  error(promise, 'bar').catch((error: string) => {
 *    console.log(error); // => 'bar'
 *  });
 *
 * @example
 *
 *  let promise: Promise<string> = Promise.resolve<string>('foo');
 *
 *  error(promise, 'bar').catch((error: string) => {
 *    console.log(error); // => 'bar'
 *  });
 */
export async function error(
  value: OptionalPromise<any>,
  newValue: any
): Promise<never> {
  await Promise.resolve(value);
  throw newValue;
}

/**
 * @example
 *
 *  let promise: Promise<string> = timeout<string>((resolve, reject)=>{
 *      resolve('foo')
 *  }, 3000);
 *
 *  promise.then((result: string)=>{
 *      console.log(result); // result => 'foo'
 *  });
 */
export function timeout<T>(executor: Executor<T>, ms?: number): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      executor(resolve, reject);
    }, ms);
  });
}

import { UIManager } from "react-native";
import { Coords, GeolocationData } from "../hooks/useGeolocation";
import R from "ramda";
import { MapboxLocation, MapboxQueryType } from "./MapboxService";

export interface LayoutMeasurement {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function measureInWindow(node: number): Promise<LayoutMeasurement> {
  return new Promise((resolve: (e: LayoutMeasurement) => void) =>
    UIManager.measureInWindow(node, (left, top, width, height) =>
      resolve({ left, top, width, height })
    )
  );
}

export function measureLayout(
  node: number,
  relativeToNativeNode: number
): Promise<LayoutMeasurement> {
  return new Promise((resolve: (e: LayoutMeasurement) => void, reject: any) =>
    UIManager.measureLayout(
      node,
      relativeToNativeNode,
      reject,
      (left, top, width, height) => resolve({ left, top, width, height })
    )
  );
}

// export function viewIsDescendantOf(node: number, innerViewNode: number) {
//   return new Promise(resolve =>
//     UIManager.measure(node, innerViewNode, isAncestor => resolve(isAncestor)),
//   );
// }

// tslint:disable-next-line:interface-over-type-literal
export interface IDictionary<T> {
  [key: string]: T;
}
export type OptionalPromise<T> = T | PromiseLike<T>;
export type OptionalPromiseArray<T extends ArrayLike<any>> = OptionalPromise<
  ArrayLike<OptionalPromise<T[keyof T & number]>>
>;
export type OptionalPromiseDictionary<T extends object> = OptionalPromise<
  IDictionary<OptionalPromise<T[keyof T]>>
>;
export type Executor<T> = (
  resolve?: (value?: T) => void,
  reject?: (reason?: any) => void
) => void;

export function hours12to24(h: number, pm: boolean) {
  return h === 12 ? (pm ? 12 : 0) : pm ? h + 12 : h;
}

export function hours24to12(h: number) {
  return {
    hour: ((h + 11) % 12) + 1,
    pm: h >= 12
  };
}

/**
 * Validate email
 *
 * @param {string} email
 * @return {boolean}
 */
export function validateEmail(email: string): boolean {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Validate phone number
 *
 * @param {string} phoneNumber
 * @return {boolean}
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  const phoneno = /^\d{10}$/ || /^\d{11}$/;
  return phoneno.test(String(phoneNumber).toLowerCase());
}

export function scaleText(
  fontSize: number = 14,
  deviceBaseWidth: number = 375
) {
  const resized = Math.round((fontSize * deviceWidth) / deviceBaseWidth);
  return resized;
}

export const removeNonNumber = (text: string = "") =>
  text.replace(/[^\d]/g, "");

export const removeLeadingSpaces = (text: string = "") =>
  text.replace(/^\s+/g, "");

export const StringUnion = <UnionType extends string>(
  ...values: UnionType[]
) => {
  Object.freeze(values);
  const valueSet: Set<string> = new Set(values);

  const guard = (value: string): value is UnionType => {
    return valueSet.has(value);
  };

  const check = (value: string): UnionType => {
    if (!guard(value)) {
      const actual = JSON.stringify(value);
      const expected = values.map(s => JSON.stringify(s)).join(" | ");
      throw new TypeError(
        `Value '${actual}' is not assignable to type '${expected}'.`
      );
    }
    return value;
  };

  const unionNamespace = { guard, check, values };
  return Object.freeze(unionNamespace as typeof unionNamespace & {
    type: UnionType;
  });
};

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export const toRad = (value: number) => (value * Math.PI) / 180;

export const normalizeACosArg = (val: number): number => {
  if (val > 1) {
    return 1;
  }
  if (val < -1) {
    return -1;
  }
  return val;
};

export const getDistance = (
  from: GeolocationData,
  to: GeolocationData,
  accuracy: number
) => {
  const { latitude: toLat, longitude: toLon } = to;
  const { latitude: fromLat, longitude: fromLon } = from;
  const distance =
    Math.acos(
      normalizeACosArg(
        Math.sin(toRad(toLat)) * Math.sin(toRad(fromLat)) +
          Math.cos(toRad(toLat)) *
            Math.cos(toRad(fromLat)) *
            Math.cos(toRad(fromLon) - toRad(toLon))
      )
    ) * earthRadius;

  return Math.round(distance / accuracy) * accuracy;
};

export const earthRadius = 6378137;

export const getDistanceInMiles = (
  from: GeolocationData,
  to: GeolocationData,
  accuracy: number
) => toMiles(getDistance(from, to, accuracy));

export const toMiles = (meters: number) => {
  return meters * 0.000621371192;
};
export const toMeters = (miles: number) => {
  return miles * 1609.344;
};

export const randomIndex = (size: number, offset: number = 0) =>
  (Math.ceil(Math.random() * 100) + offset) % (size - 1);

const group = <T>(n: number, list: T[]): T[][] => {
  return R.isEmpty(list)
    ? []
    : R.prepend(R.take(n, list), group(n, R.drop(n, list)));
};
export const groupsOf = R.curry<typeof group>(group);

export const filterMapboxFeature = (
  features: MapboxLocation[],
  type: MapboxQueryType
) => {
  return features.filter(feature => feature.place_type[0] === type);
};

export const dlv = <
  T extends { [state: string]: any },
  K extends Extract<keyof T, string> | string
>(
  obj: T,
  key: K | K[],
  def?: any,
  p: number = 0
): any => {
  const accessor = (key as string).split
    ? (key as string).split(".")
    : (key as string[]);
  while (obj && p < accessor.length) {
    obj = obj[accessor[p++]];
  }
  return obj === undefined || p < accessor.length ? def : obj;
};
