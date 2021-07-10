import * as queryString from "query-string";
import { GenericGeoJSONFeature } from "../types/GenericGeoJson";
import MapboxApiKey from "../config/mapbox";
import { GeolocationData } from "../hooks/useGeolocation";

type GeometryObject = GeoJSON.GeometryObject;
const BASE_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";
export type MapboxQueryType =
  | "country"
  | "region"
  | "postcode"
  | "district"
  | "place"
  | "locality"
  | "neighborhood"
  | "address"
  | "poi";
export interface RequestMetadata {
  bbox?: number[];
  promiximity?: number[];
  language?: ["en-US"];
  limit?: number;
  access_token: string;
  autocomplete?: boolean;
  types?: MapboxQueryType[];
  event?: "search.start" | "search.keystroke";
  endpoint?: "mapbox.places";
  country?: string;
}
export interface MapboxLocation
  extends GenericGeoJSONFeature<GeometryObject, Record<string, any>> {
  center: number[];
  context: {
    id: string;
    short_code?: string;
    text?: string;
    wikidata?: string;
  }[];
  id: string;
  matching_place_name?: string;
  matching_text?: string;
  place_name: string;
  place_type: MapboxQueryType[];
  relevance: number;
  text: string;
  type: "Feature";
}

export interface MapboxLocationResponse {
  features: MapboxLocation[];
  query: string[];
  type: "FeatureCollection";
}

export interface ReverseGeocodeRequest {
  geolocation: GeolocationData;
  types: MapboxQueryType[];
  endpoint?: "mapbox.places";
  bbox?: number[];
  limit?: number;
}

export class MapboxService {
  public static async _search(
    term: string,
    query: RequestMetadata
  ): Promise<{
    predictions: MapboxLocationResponse;
    status: string;
  }> {
    const url = `${BASE_URL}/${term}.json?${queryString.stringify(
      query as any
    )}`;
    console.log(url);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const data = (await res.json()) as MapboxLocationResponse;
    return {
      predictions: {
        features: data.features,
        query: data.query,
        type: "FeatureCollection"
      },
      status: res.statusText
    };
  }

  public static async __search(
    term: string,
    apiKey: string = MapboxApiKey,
    types: MapboxQueryType[] = ["place"],
    endpoint?: "mapbox.places",
    bbox?: number[],
    limit?: number
  ): Promise<{
    predictions: MapboxLocationResponse;
    status: string;
  }> {
    return this._search(term, {
      access_token: apiKey,
      types,
      endpoint,
      bbox,
      limit,
      language: ["en-US"],
      country: "us"
    });
  }

  public static async search(
    term: string,
    types: MapboxQueryType[] = ["place"],
    endpoint?: "mapbox.places",
    bbox?: number[],
    limit?: number
  ): Promise<{
    predictions: MapboxLocationResponse;
    status: string;
  }> {
    return this.__search(term, MapboxApiKey, types, endpoint, bbox, limit);
  }

  public static async reverseGeocode({
    geolocation,
    types = ["place"],
    endpoint,
    bbox,
    limit
  }: ReverseGeocodeRequest): Promise<{
    predictions: MapboxLocationResponse;
    status: string;
  }> {
    const { latitude, longitude } = geolocation;
    return this.search(
      `${longitude},${latitude}`,
      types,
      endpoint,
      bbox,
      limit
    );
  }
}
