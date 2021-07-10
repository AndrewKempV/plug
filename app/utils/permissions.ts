import RNLocation from "react-native-location";
import {
  ConfigureOptions,
  RequestPermissionOptions
} from "react-native-location/dist/types";

const locationConfigOpts: ConfigureOptions = {
  distanceFilter: 5.0,
  desiredAccuracy: {
    ios: "best",
    android: "balancedPowerAccuracy"
  },
  // Android only
  androidProvider: "auto",
  interval: 5000, // Milliseconds
  fastestInterval: 10000, // Milliseconds
  maxWaitTime: 5000, // Milliseconds
  // iOS Only
  activityType: "other",
  allowsBackgroundLocationUpdates: false,
  headingFilter: 1, // Degrees
  headingOrientation: "portrait",
  pausesLocationUpdatesAutomatically: false,
  showsBackgroundLocationIndicator: false
};

const locationRequestOpts: RequestPermissionOptions = {
  ios: "whenInUse",
  android: {
    detail: "fine",
    rationale: {
      title: "Allow PLUGG to access your location while you are using the app?",
      message:
        "This makes it easier to find you places, addresses and routes from where you are.",
      buttonPositive: "Allow",
      buttonNegative: `Don't Allow`
    }
  }
};
const requestLocationPermission = (): Promise<boolean> => {
  RNLocation.configure(locationConfigOpts);
  return RNLocation.requestPermission(locationRequestOpts);
};

const checkLocationPermission = (): Promise<boolean> => {
  return RNLocation.checkPermission(locationRequestOpts);
};

//   .then(granted => {
//       if (granted) {
//         return RNLocation.subscribeToLocationUpdates(locations => locations);
//         }
// });
// NOTE: use Subscription from 'react-native-location/dist/types' to subscribe to location updates.

export { requestLocationPermission, checkLocationPermission };
