import axios, { AxiosResponse } from "axios";

import { refreshAuthorization, getBearerToken } from "config/axios";
import {
  EventControllerApi,
  FullUserProfileModel,
  MeControllerApi,
  PaymentControllerApi,
  UpdateProfileImageModel,
  UserProfileControllerApi,
  UserRelationshipControllerApi,
  BaseResponseModelCustomer,
  Card,
  EventModel,
  EventDetailModel
} from "./profile";
import Stripe, { StripeTokenRequest } from "./stripe";
import { StripeConfig } from "config/stripeConfig";
import {
  EventFeedRequest,
  LocationRequest,
  LocationImageRequest,
  LocationImageResponse
} from "./types";
import QueryUtils from "utils/QueryUtils";
import _, { pick } from "lodash";
import { CroppedImage } from "../components/AvatarEditor/AvatarEditor";
import FormData from "form-data";
import { Platform } from "react-native";
// const createFormData = (photos: CroppedImage[], body: object) => {
//   const data = new FormData();
//   photos.forEach((photo, idx) => {
//     data.append("file", {
//       name: `photo_${idx}`,
//       uri: Platform.select({
//         ios: photo.uri.replace("file://", ""),
//         android: photo.uri
//       })
//     });
//   });

//   data.append(
//     "data",
//     new Blob([JSON.stringify(body)], {
//       type: "application/json"
//     })
//   );

//   Object.keys(body).forEach(key => {
//     //@ts-ignore
//     data.append(key, body[key]);
//   });

//   return data;
// };
export interface PaginationParams {
  offset: number;
  limit: number;
}

type PaginationWithoutOffset = Omit<PaginationParams, "offset">;

interface UserPaginationParams extends PaginationParams {
  userProfileId: string;
}
type FeedRequest = Partial<EventFeedRequest> &
  LocationRequest &
  PaginationParams;

export class ApiClient {
  public static instance: ApiClient = new ApiClient();

  public ownProfileController!: MeControllerApi;
  public userProfileController!: UserProfileControllerApi;
  public userRelationshipController!: UserRelationshipControllerApi;
  public eventController: EventControllerApi;
  public paymentController: PaymentControllerApi;
  public stripeController: Stripe;

  private constructor() {
    this.ownProfileController = new MeControllerApi(
      undefined,
      undefined,
      axios
    );
    this.userProfileController = new UserProfileControllerApi(
      undefined,
      undefined,
      axios
    );
    this.userRelationshipController = new UserRelationshipControllerApi(
      undefined,
      undefined,
      axios
    );
    this.eventController = new EventControllerApi(undefined, undefined, axios);
    this.paymentController = new PaymentControllerApi(
      undefined,
      undefined,
      axios
    );
    this.stripeController = new Stripe(StripeConfig.apiKey);
  }

  public createBlock = async (otherUserProfileId: string) => {
    await refreshAuthorization();
    const response = await this.ownProfileController.createBlockUsingPUT(
      otherUserProfileId
    );
    return response;
  };

  public removeBlock = async (otherUserProfileId: string) => {
    await refreshAuthorization();
    const response = await this.ownProfileController.removeBlockUsingDELETE(
      otherUserProfileId
    );
    return response;
  };

  public getBlockedUsers = async ({ limit, offset }: PaginationParams) => {
    await refreshAuthorization();
    const response = await this.ownProfileController.getBlockedUsersUsingGET(
      limit,
      offset
    );
    return response;
  };

  public getFavoriteEvents = async ({ limit, offset }: PaginationParams) => {
    await refreshAuthorization();
    const response = await this.ownProfileController.getFavoriteEventsUsingGET1(
      limit,
      offset
    );
    return response;
  };

  public getPastEvents = async ({ limit, offset }: PaginationParams) => {
    await refreshAuthorization();
    const response = await this.ownProfileController.getPastEventsUsingGET1(
      limit,
      offset
    );
    return response;
  };

  public getHostedEvents = async ({ limit, offset }: PaginationParams) => {
    await refreshAuthorization();
    const response = await this.ownProfileController.getHostedEventsUsingGET1(
      limit,
      offset
    );
    return response;
  };

  public createFollower = async (otherUserProfileId: string) => {
    await refreshAuthorization();
    const response = await this.ownProfileController.createFollowerUsingPUT(
      otherUserProfileId
    );
    return response;
  };

  public removeFollower = async (otherUserProfileId: string) => {
    await refreshAuthorization();
    const response = await this.ownProfileController.removeFollowerUsingDELETE(
      otherUserProfileId
    );
    return response;
  };

  public getOwnFollowers = async ({ limit, offset }: PaginationParams) => {
    await refreshAuthorization();
    const response = await this.ownProfileController.getFollowersUsingGET(
      limit,
      offset
    );
    return response;
  };

  public getOwnFollowing = async ({ limit, offset }: PaginationParams) => {
    await refreshAuthorization();
    const response = await this.ownProfileController.getFollowingUsingGET(
      limit,
      offset
    );
    return response;
  };

  public getFollowers = async ({
    limit,
    offset,
    userProfileId
  }: UserPaginationParams) => {
    await refreshAuthorization();
    const response = await this.userRelationshipController.getFollowersUsingGET1(
      limit,
      offset,
      userProfileId
    );
    return response;
  };

  public getFollowing = async ({
    limit,
    offset,
    userProfileId
  }: UserPaginationParams) => {
    await refreshAuthorization();
    const response = await this.userRelationshipController.getFollowingUsingGET1(
      limit,
      offset,
      userProfileId
    );
    return response;
  };

  public toggleNotification = async (
    enabled: boolean,
    userProfileId: string
  ) => {
    await refreshAuthorization();
    const response = await this.ownProfileController.toggleNotificationUsingPUT(
      enabled,
      userProfileId
    );
    return response;
  };

  public getOwnUserProfile = async () => {
    await refreshAuthorization();
    const response = await this.ownProfileController.getUserProfileUsingGET();
    return response;
  };

  public createUserProfile = async (profileModel: FullUserProfileModel) => {
    await refreshAuthorization();
    const response = await this.ownProfileController.createUserProfileUsingPOST(
      profileModel
    );
    return response;
  };

  public updateUserProfile = async (profileModel: FullUserProfileModel) => {
    await refreshAuthorization();
    const response = await this.ownProfileController.updateUserProfileUsingPUT(
      profileModel
    );
    return response;
  };

  public updateProfileImage = async (
    profileImageModel: UpdateProfileImageModel
  ) => {
    await refreshAuthorization();
    const response = await this.ownProfileController.updateProfileImageUsingPOST(
      profileImageModel
    );
    return response;
  };

  public getRelationship = async (otherUserProfileId: string) => {
    await refreshAuthorization();
    const response = await this.ownProfileController.getRelationshipUsingGET(
      otherUserProfileId
    );
    return response;
  };

  public getSuggestedUsers = async ({ limit }: PaginationWithoutOffset) => {
    await refreshAuthorization();
    const response = await this.ownProfileController.getSuggestedUsersUsingGET(
      limit
    );
    return response;
  };

  public getUserProfile = async (otherUserProfileId: string) => {
    await refreshAuthorization();
    const response = await this.userProfileController.getUserProfileUsingGET1(
      otherUserProfileId
    );
    return response;
  };

  public createFavoriteEvent = async (eventId: string) => {
    await refreshAuthorization();
    const response = await this.ownProfileController.createFavoriteUsingPUT(
      eventId
    );
    return response;
  };

  public removeFavoriteEvent = async (eventId: string) => {
    await refreshAuthorization();
    const response = await this.ownProfileController.removeFavoriteUsingDELETE(
      eventId
    );
    return response;
  };

  public getFavoriteEventsForUser = async ({
    limit,
    offset,
    userProfileId
  }: UserPaginationParams) => {
    await refreshAuthorization();
    const response = await this.eventController.getFavoriteEventsUsingGET(
      limit,
      offset,
      userProfileId
    );
    return response.data.data;
  };

  public getPastEventsForUser = async ({
    limit,
    offset,
    userProfileId
  }: UserPaginationParams) => {
    await refreshAuthorization();
    const response = await this.eventController.getPastEventsUsingGET(
      limit,
      offset,
      userProfileId
    );
    return response;
  };

  public getHostedEventsForUser = async ({
    limit,
    offset,
    userProfileId
  }: UserPaginationParams) => {
    await refreshAuthorization();
    const response = await this.eventController.getHostedEventsUsingGET(
      limit,
      offset,
      userProfileId
    );
    return response;
  };

  public getEventDetail = async (eventId: string) => {
    const header = await getBearerToken();
    const query = `http://api-dev.pluggnation.com/events/${eventId}/details`;
    const result = await fetch(query, {
      method: "GET",
      headers: {
        ...header,
        "Content-Type": "application/json"
      }
    });
    const response = await result.json();
    // console.log(response);
    return (response.data as EventDetailModel[])?.pop();
  };

  public getEvent = async (eventId: string) => {
    await refreshAuthorization();
    const response = await this.eventController.getEventUsingGET(eventId);
    if (response.data && response.data.data) {
      const result = response.data.data.pop();
      return result;
    }
  };

  public getEventFeed2 = async ({
    lat,
    lon,
    distanceInMiles,
    offset,
    limit
  }: FeedRequest): Promise<EventModel[]> => {
    const header = await getBearerToken();
    const query = `http://api-dev.pluggnation.com/events/feed?lat=${lat}&lon=${lon}&distanceInMiles=${distanceInMiles}&offset=${offset}&limit=${limit}`;
    console.log(query);
    const result = await fetch(query, {
      method: "GET",
      headers: {
        ...header,
        "Content-Type": "application/json"
      }
    });
    const response = await result.json();
    return response.data as EventModel[];
  };

  public getEventFeed = async (
    feedRequest: EventFeedRequest,
    { lat, lon, distanceInMiles }: LocationRequest,
    { offset, limit }: PaginationParams
  ): Promise<EventModel[]> => {
    const header = await getBearerToken();
    const query = `http://api-dev.pluggnation.com/events/feed?lat=${lat}&lon=${lon}&distanceInMiles=${distanceInMiles}&offset=${offset}&limit=${limit}`;
    const result = await fetch(query, {
      method: "GET",
      headers: {
        ...header,
        "Content-Type": "application/json"
      }
    });
    const response = await result.json();
    return response.data as EventModel[];
  };

  public createEvent = async (): Promise<EventModel> => {
    return Promise.resolve({});
  };

  public getLocationImage = async ({
    city,
    state,
    zipCode
  }: LocationImageRequest) => {
    const token = await getBearerToken();
    const param = pick(
      {
        city,
        state,
        zipCode
      },
      ["city", "state", "zipCode"]
    );
    const qs = QueryUtils.stringify(param);
    const query = `http://api-dev.pluggnation.com/location/image?${qs}`;
    console.log(query);
    const result = await fetch(query, {
      method: "GET",
      headers: {
        ...token,
        "Content-Type": "application/json"
      }
    });
    const response = await result.json();
    return response.data.pop() as LocationImageResponse;
  };

  public createCustomerWithDefaultCard = async (
    tokenRequest: StripeTokenRequest
  ) => {
    await refreshAuthorization();
    const tokenResponse = await this.stripeController.createToken(tokenRequest);
    const response = await this.paymentController.createCustomerWithDefaultCardUsingPUT(
      tokenResponse.id
    );
    const customerModel = firstOrDefault<BaseResponseModelCustomer>(response);
    if (customerModel.data) {
      const customer = customerModel.data.pop()!;
      return customer;
    }
    throw new Error("Customer not created");
  };

  public addCardToCustomer = async (tokenRequest: StripeTokenRequest) => {
    await refreshAuthorization();
    const tokenResponse = await this.stripeController.createToken(tokenRequest);
    const response = await this.paymentController.addCardToCustomerUsingPOST(
      tokenResponse.id
    );
    return response;
  };

  public changeDefaultCardForCustomer = async (source: string) => {
    await refreshAuthorization();
    const response = await this.paymentController.changeDefaultCardForCustomerUsingPOST(
      source
    );
    return response;
  };

  public deleteCardFromCustomer = async (source: string) => {
    await refreshAuthorization();
    const response = await this.paymentController.deleteCardFromCustomerUsingDELETE(
      source
    );
    return response;
  };

  public getCustomer = async () => {
    await refreshAuthorization();
    const response = await this.paymentController.getCustomerUsingGET();
    const parsed = JSON.parse(
      response.request._response
    ) as BaseResponseModelCustomer;
    const customer = parsed.data!.pop();
    console.log(customer);
    if (customer && customer.id) {
      return customer;
    }
    throw new Error(JSON.stringify(response.data.error));
  };

  public listCustomerCards = async (limit: number) => {
    await refreshAuthorization();
    const response = await this.paymentController.listCustomerCardsUsingGET(
      limit
    );
    const paymentSources = response.data.data!.pop();
    if (paymentSources) {
      return paymentSources.data as Card[];
    }
    return [] as Card[];
  };
}

export function firstOrDefault<T extends any>(response: AxiosResponse<T>) {
  return response.data?.data?.pop() as T;
}

export function unwrapResponse<T extends any>(response: AxiosResponse<T>) {
  return response.data?.data as T;
}
