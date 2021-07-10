import { ApiClient } from "api/client";
import { InferActionTypes, createAsyncAction } from "store/ActionCreators";
import * as types from "./types";

const profileActions = {
  createProfile: createAsyncAction(
    [
      types.CREATE_USER_PROFILE,
      types.CREATE_USER_PROFILE_SUCCESS,
      types.CREATE_USER_PROFILE_FAIL
    ],
    ApiClient.instance.createUserProfile
  ),
  updateProfile: createAsyncAction(
    [
      types.UPDATE_PROFILE,
      types.UPDATE_PROFILE_SUCCESS,
      types.UPDATE_PROFILE_FAIL
    ],
    ApiClient.instance.updateUserProfile
  ),
  updateProfileImage: createAsyncAction(
    [
      types.UPDATE_PROFILE_IMAGE,
      types.UPDATE_PROFILE_IMAGE_SUCCESS,
      types.UPDATE_PROFILE_IMAGE_FAIL
    ],
    ApiClient.instance.updateProfileImage
  ),
  getOwnUserProfile: createAsyncAction(
    [
      types.GET_OWN_PROFILE,
      types.GET_OWN_PROFILE_SUCCESS,
      types.GET_OWN_PROFILE_FAIL
    ],
    ApiClient.instance.getOwnUserProfile
  ),
  getUserProfile: createAsyncAction(
    [
      types.GET_USER_PROFILE,
      types.GET_USER_PROFILE_SUCCESS,
      types.GET_USER_PROFILE_FAILURE
    ],
    ApiClient.instance.getUserProfile
  ),
  createBlock: createAsyncAction(
    [
      types.CREATE_BLOCK,
      types.CREATE_BLOCK_SUCCESS,
      types.CREATE_BLOCK_FAILURE
    ],
    ApiClient.instance.createBlock
  ),
  removeBlock: createAsyncAction(
    [
      types.REMOVE_BLOCK,
      types.REMOVE_BLOCK_SUCCESS,
      types.REMOVE_BLOCK_FAILURE
    ],
    ApiClient.instance.removeBlock
  ),
  createFavoriteEvent: createAsyncAction(
    [
      types.CREATE_FAVORITE_EVENT,
      types.CREATE_FAVORITE_EVENT_SUCCESS,
      types.CREATE_FAVORITE_EVENT_FAILURE
    ],
    ApiClient.instance.createFavoriteEvent
  ),
  removeFavoriteEvent: createAsyncAction(
    [
      types.REMOVE_FAVORITE_EVENT,
      types.REMOVE_FAVORITE_EVENT_SUCCESS,
      types.REMOVE_FAVORITE_EVENT_FAILURE
    ],
    ApiClient.instance.removeFavoriteEvent
  ),
  createFollower: createAsyncAction(
    [
      types.CREATE_FOLLOWER,
      types.CREATE_FOLLOWER_SUCCESS,
      types.CREATE_FOLLOWER_FAILURE
    ],
    ApiClient.instance.createFollower
  ),
  removeFollower: createAsyncAction(
    [
      types.REMOVE_FOLLOWER,
      types.REMOVE_FOLLOWER_SUCCESS,
      types.REMOVE_FOLLOWER_FAILURE
    ],
    ApiClient.instance.removeFollower
  ),
  getFollowers: createAsyncAction(
    [
      types.GET_FOLLOWERS,
      types.GET_FOLLOWERS_SUCCESS,
      types.GET_FOLLOWERS_FAILURE
    ],
    ApiClient.instance.getFollowers
  ),
  getFollowing: createAsyncAction(
    [
      types.GET_FOLLOWING,
      types.GET_FOLLOWING_SUCCESS,
      types.GET_FOLLOWING_FAILURE
    ],
    ApiClient.instance.getFollowing
  ),
  getOwnFollowers: createAsyncAction(
    [
      types.GET_OWN_FOLLOWERS,
      types.GET_OWN_FOLLOWERS_SUCCESS,
      types.GET_OWN_FOLLOWERS_FAILURE
    ],
    ApiClient.instance.getOwnFollowers
  ),
  getOwnFollowing: createAsyncAction(
    [
      types.GET_OWN_FOLLOWING,
      types.GET_OWN_FOLLOWING_SUCCESS,
      types.GET_OWN_FOLLOWING_FAILURE
    ],
    ApiClient.instance.getOwnFollowing
  ),
  getFavoriteEvents: createAsyncAction(
    [
      types.GET_FAVORITE_EVENTS,
      types.GET_FAVORITE_EVENTS_SUCCESS,
      types.GET_FAVORITE_EVENTS_FAILURE
    ],
    ApiClient.instance.getFavoriteEvents
  ),
  getPastEvents: createAsyncAction(
    [
      types.GET_PAST_EVENTS,
      types.GET_PAST_EVENTS_SUCCESS,
      types.GET_PAST_EVENTS_FAILURE
    ],
    ApiClient.instance.getPastEvents
  ),
  getHostedEvents: createAsyncAction(
    [
      types.GET_HOSTED_EVENTS,
      types.GET_HOSTED_EVENTS_SUCCESS,
      types.GET_HOSTED_EVENTS_FAILURE
    ],
    ApiClient.instance.getHostedEvents
  ),
  getSuggestedUsers: createAsyncAction(
    [
      types.GET_SUGGESTED_USERS,
      types.GET_SUGGESTED_USERS_SUCCESS,
      types.GET_SUGGESTED_USERS_FAILURE
    ],
    ApiClient.instance.getSuggestedUsers
  ),
  getBlockedUsers: createAsyncAction(
    [
      types.GET_BLOCKED_USERS,
      types.GET_BLOCKED_USERS_SUCCESS,
      types.GET_BLOCKED_USERS_FAILURE
    ],
    ApiClient.instance.getBlockedUsers
  ),
  getFavoriteEventsForUser: createAsyncAction(
    [
      types.GET_FAVORITE_EVENTS_FOR_USER,
      types.GET_FAVORITE_EVENTS_FOR_USER_SUCCESS,
      types.GET_FAVORITE_EVENTS_FOR_USERS_FAILURE
    ],
    ApiClient.instance.getFavoriteEventsForUser
  ),
  getPastEventsForUser: createAsyncAction(
    [
      types.GET_PAST_EVENTS_FOR_USER,
      types.GET_PAST_EVENTS_FOR_USER_SUCCESS,
      types.GET_PAST_EVENTS_FOR_USER_FAILURE
    ],
    ApiClient.instance.getPastEventsForUser
  ),
  getHostedEventsForUser: createAsyncAction(
    [
      types.GET_HOSTED_EVENTS_FOR_USER,
      types.GET_HOSTED_EVENTS_FOR_USER_SUCCESS,
      types.GET_HOSTED_EVENTS_FOR_USER_FAILURE
    ],
    ApiClient.instance.getHostedEventsForUser
  )
};

export default profileActions;
export type ProfileActionObjectTypes = InferActionTypes<typeof profileActions>;
