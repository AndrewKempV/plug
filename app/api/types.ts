export interface EventFeedRequest {
  query: string;
  ambience: string[];
  music: string[];
  tags: string[];
}

export interface LocationRequest {
  lat: number;
  lon: number;
  distanceInMiles: number;
}

export interface LocationImageRequest {
  city: string;
  state: string;
  zipCode: string;
}

export interface LocationImageResponse {
  imageUrl: string;
}
