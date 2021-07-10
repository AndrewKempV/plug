import AuthApi from "api/auth";
import { InferActionTypes, createAsyncAction } from "store/ActionCreators";
import * as types from "./types";

const authActions = {
  signIn: createAsyncAction(
    [types.SIGNIN, types.SIGNIN_SUCCESS, types.SIGNIN_FAIL],
    AuthApi.signIn
  ),
  signOut: createAsyncAction(
    [types.SIGNOUT, types.SIGNOUT_FAIL, types.SIGNOUT_SUCCESS],
    AuthApi.signOut
  ),
  signUp: createAsyncAction(
    [types.SIGNUP, types.SIGNUP_FAIL, types.SIGNUP_SUCCESS],
    () => new Promise<any>(res => res)
  ),
  confirmSignUp: createAsyncAction(
    [
      types.SIGNUP_CONFIRM,
      types.SIGNUP_CONFIRM_FAIL,
      types.SIGNUP_CONFIRM_SUCCESS
    ],
    AuthApi.confirmAccount
  ),
  resendCode: createAsyncAction(
    [types.RESEND_CODE, types.RESEND_CODE_FAIL, types.RESEND_CODE_SUCCESS],
    AuthApi.resendConfirmationCode
  ),
  changePassword: createAsyncAction(
    [
      types.CHANGE_PASSWORD,
      types.CHANGE_PASSWORD_FAIL,
      types.CHANGE_PASSWORD_SUCCESS
    ],
    AuthApi.changePassword
  ),
  updatePreferredUsername: createAsyncAction(
    [
      types.UPDATE_USERNAME,
      types.UPDATE_USERNAME_SUCCESS,
      types.UPDATE_USERNAME_FAIL
    ],
    AuthApi.updatePreferredUsername
  ),
  updateUserAttributes: createAsyncAction(
    [
      types.UPDATE_ATTRIBUTES,
      types.UPDATE_ATTRIBUTES_SUCCESS,
      types.UPDATE_ATTRIBUTES_FAIL
    ],
    AuthApi.updateUserAttributes
  )
};

export default authActions;
export type AuthActionObjectTypes = InferActionTypes<typeof authActions>;
