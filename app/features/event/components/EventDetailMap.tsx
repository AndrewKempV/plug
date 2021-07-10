import React from "react";
import { Box } from "app/components";
import MapboxGL from "@react-native-mapbox-gl/maps";

interface Props {
  coordinates: number[];
}

export const EventDetailMap = ({ coordinates }: Props) => {
  const bounds = React.useMemo(
    () => getMapBounds(coordinates[0], coordinates[1]),
    coordinates
  );
  return (
    <Box>
      <MapboxGL.MapView
        styleURL={MapboxGL.StyleURL.Street}
        style={{ height: 176, width: "100%" }}
        userTrackingMode={MapboxGL.UserTrackingModes.None}
      >
        <MapboxGL.PointAnnotation
          key="SourceAnnotation"
          id="SourceAnnotation"
          coordinate={coordinates}
        />
        <MapboxGL.Camera
          bounds={bounds}
          maxBounds={bounds}
          zoomLevel={15}
          centerCoordinate={coordinates}
          pointerEvents={"none"}
        />
      </MapboxGL.MapView>
    </Box>
  );
};

const getMapBounds = (lon: number, lat: number) => {
  const N: number = 1;
  const minLat = lat - 0.009 * N;
  const maxLat = lat + 0.009 * N;
  const minLon = lon - 0.009 * N;
  const maxLon = lon + 0.009 * N;
  const ne: [number, number] = [maxLon, maxLat];
  const sw: [number, number] = [minLon, minLat];
  return {
    ne,
    sw
  };
};
