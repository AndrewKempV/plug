import { useState, useEffect } from "react";
import { Geolocation, GeolocationReturnType } from "react-native";

export interface PositionOption {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
}

export interface Option {
  positionOptions?: PositionOption;
  watch?: boolean;
  geolocationProvider?: typeof Geolocation;
}

export interface Coords {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  accuracy: number;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface GeolocationState {
  coords?: Coords;
  isGeolocationAvailable: boolean;
  isGeolocationEnabled: boolean;
  positionError?: any;
}

export interface GeoPosition extends GeolocationReturnType {}

export interface GeolocationData {
  latitude: number;
  longitude: number;
}

export const useGeolocation = (): [string, GeolocationData] => {
  const [error, setError] = useState("");
  const [position, setPosition] = useState<GeolocationData>({
    latitude: 0,
    longitude: 0
  });

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      pos => {
        setError("");
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      },
      e => setError(e.message)
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return [error, position];
};

export default useGeolocation;
