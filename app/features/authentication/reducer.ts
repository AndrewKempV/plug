import { APIActionStatus } from "../../models/ApiActionStatus";
import { AppActionObjectTypes } from "store/AppActions";
import { IAuthenticationResult } from "../../types/auth";

interface AuthState {
  status: APIActionStatus;
  response: IAuthenticationResult;
}
const initialState: AuthState = {
  status: APIActionStatus.STARTED,
  response: { state: "Unauthenticated" }
};
export default function authReducer(
  state: AuthState = initialState,
  action: AppActionObjectTypes
): AuthState {
  switch (action.type) {
    case "SIGN_IN":
      return createAuthStart(action.payload.res);
    case "SIGNIN_SUCCESS":
      return createAuthSuccess(action.payload.res);
    case "SIGNIN_FAIL":
      return createAuthFailure(action.payload.res);
    case "SIGN_UP":
      return createAuthStart(action.payload.res);
    case "SIGNUP_FAIL":
      return createAuthFailure(action.payload.res);
    case "SIGNUP_SUCCESS":
      return createAuthSuccess(action.payload.res);
    case "CHANGE_PASSWORD":
      return createAuthStart(action.payload.res);
    case "CHANGE_PASSWORD_FAIL":
      return createAuthFailure(action.payload.res);
    case "CHANGE_PASSWORD_SUCCESS":
      return createAuthSuccess(action.payload.res);
    case "RESEND_CODE":
      return createAuthStart(action.payload.res);
    case "RESEND_CODE_FAIL":
      return createAuthFailure(action.payload.res);
    case "RESEND_CODE_SUCCESS":
      return createAuthSuccess(action.payload.res);
    case "SIGNUP_CONFIRM":
      return createAuthStart(action.payload.res);
    case "SIGNUP_CONFIRM_FAIL":
      return createAuthFailure(action.payload.res);
    case "SIGNUP_CONFIRM_SUCCESS":
      return createAuthSuccess(action.payload.res);
    case "UPDATE_ATTRIBUTES":
      return createAuthStart(action.payload.res);
    case "UPDATE_ATTRIBUTES_SUCCESS":
      return createAuthSuccess(action.payload.res);
    case "UPDATE_ATTRIBUTES_FAIL":
      return createAuthFailure(action.payload.res);
    default:
      return state;
  }
}

const createAuthSuccess = (result: any) => {
  return {
    status: APIActionStatus.SUCCEEDED,
    response: result as IAuthenticationResult
  };
};
const createAuthFailure = (result: any) => {
  return {
    status: APIActionStatus.FAILED,
    response: result as IAuthenticationResult
  };
};
const createAuthStart = (result: any) => {
  return {
    status: APIActionStatus.STARTED,
    response: result as IAuthenticationResult
  };
};
