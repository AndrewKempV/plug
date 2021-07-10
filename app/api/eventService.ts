import RNFetchBlob from "rn-fetch-blob";
import { refreshAuthorization, getBearerToken } from "config/axios";
import { CroppedImage } from "../components/AvatarEditor/AvatarEditor";
import FormData from "form-data";
import { Platform } from "react-native";
import { EventModel, EventDetailModel } from "./profile/api";
import axios from "axios";
import { PaginationParams } from "./client";
import base64 from "base-64";
const BASE64_MARKER = ";base64,";
const BASE_URL = "http://api-dev.pluggnation.com";
export class EventService {
  public createEvent = async (
    photos: CroppedImage[],
    body?: EventDetailModel
  ) => {
    const authToken = await getBearerToken();
    const files: any[] = [];
    photos.forEach((photo, index) => {
      const uri = Platform.select({
        ios: photo.uri.replace("file://", ""),
        android: photo.uri
      });
      const base64Index = uri.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
      const base64Data = uri.substring(base64Index);
      // //@ts-ignore
      // const raw = base64.encode(base64Data) as string;
      // const rawLength = raw.length;
      // const array = new Uint8Array(new ArrayBuffer(rawLength));

      // for (let i = 0; i < rawLength; i++) {
      //   array[i] = raw.charCodeAt(i);
      // }
      // console.log(base64Data);
      // //@ts-ignore
      // console.log(raw);
      // console.log(array);
      files.push({
        name: "file",
        filename: photo.fileName ? photo.fileName : `photo_${index}`,
        //@ts-ignore
        data: base64Data,
        type: photo.type ? photo.type : "image/jpeg"
      });
    });
    files.push({
      name: "data",
      data: JSON.stringify(body)
    });
    const response = await RNFetchBlob.fetch(
      "POST",
      `${BASE_URL}/events-form/`,
      {
        ...authToken,
        "Content-Type": "multipart/form-data;BASE64"
      },
      files
    );
    const result = response.json();
    console.log(result);
    return result as EventDetailModel;
  };

  public getCategories = async ({ limit, offset }: PaginationParams) => {
    const authToken = await getBearerToken();
    const result = await fetch(
      `${BASE_URL}/categories/?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          ...authToken,
          "Content-Type": "application/json"
        }
      }
    );
    const categories: { data: string[] } = await result.json();
    return categories.data;
  };
  public getMusic = async ({ limit, offset }: PaginationParams) => {
    const authToken = await getBearerToken();
    const result = await fetch(
      `${BASE_URL}/music/?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          ...authToken,
          "Content-Type": "application/json"
        }
      }
    );
    const music: { data: string[] } = await result.json();
    return music.data;
  };
  public getAmbiances = async ({
    category,
    limit,
    offset
  }: PaginationParams & { category: string }) => {
    const authToken = await getBearerToken();
    const result = await fetch(
      `${BASE_URL}/categories/${category}/ambiances?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          ...authToken,
          "Content-Type": "application/json"
        }
      }
    );
    const ambiances: { data: string[] } = await result.json();
    return ambiances.data;
  };
}
