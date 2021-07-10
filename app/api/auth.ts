import {
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserSession
} from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";
import _ from "lodash";
import {
  IAuthenticationResult,
  ICode,
  CognitoAttributes,
  CognitoUserVariables,
  IPassword,
  IUsername,
  CognitoAttribute
} from "../types/auth";
import { notEmpty } from "utils/helpers";

export type ConfirmPasswordRequest = IUsername & ICode & IPassword;
export type ConfirmAccountRequest = IUsername & ICode;
export type EditableAttributes = Omit<CognitoAttributes, "email">;
export interface ChangePasswordRequest {
  oldPassword: string;
  password: string;
}
export interface IdentityProviderSignInRequest {
  id_token: string;
  access_token: string;
  refresh_token?: string;
}

/**
 * Check user authentication state
 * @param cognitoAuthResult optional result of authentication operation.
 * Else `Auth.currentSession()`
 * @returns See {@link IAuthenticationResult}
 */
export const checkSession = async (
  cognitoAuthResult?: CognitoUser | any | undefined
): Promise<IAuthenticationResult> => {
  let session = cognitoAuthResult;
  if (_.isNil(session)) {
    session = await Auth.currentSession();
  }

  let user = session instanceof CognitoUser ? session : undefined;
  if (_.get(session, "user") && session.user instanceof CognitoUser) {
    user = session.user;
  }

  const isError: boolean = session instanceof Error;

  // if (__DEV__) {
  //     Alert.alert(!isError ? 'Session started for:' + `\n${user!.getUsername()}` : session);
  // }

  let result: IAuthenticationResult;

  if (_.get(user, "username") && _.get(session, "userConfirmed") !== false) {
    result = { state: "Authenticated", user: session as CognitoUser };
    return result;
  }

  const challengeName: string = _.get(session, "challengeName") || "";

  // Resetting password
  const codeDelivery = _.get(session, ["CodeDeliveryDetails", "Destination"]);
  if (
    challengeName === "NEW_PASSWORD_REQUIRED" ||
    (!_.isNil(codeDelivery) && !_.isEmpty(codeDelivery))
  ) {
    result = { state: "NEW_PASSWORD_REQUIRED" };
    return result;
  }

  const code = _.get(session, "code");

  // Not confirmed
  if (
    code === "UserNotConfirmedException" ||
    code === "CodeMismatchException" ||
    _.get(session, "userConfirmed") === false
  ) {
    result = {
      state: "ConfirmAccountCodeWaiting",
      user: (user as CognitoUser) || (session as CognitoUser) || undefined,
      error: new Error(_.get(session, "message") || "User not confirmed")
    };

    return result;
  }

  if (code === "ExpiredCodeException") {
    result = {
      state: "ConfirmAccountCodeExpired",
      error: new Error(
        _.get(session, "message") || "Account confirmation code expired"
      )
    };
    return result;
  }
  if (code === "AliasExistsException" && _.get(session, "message")) {
    result = {
      state: "Authenticated",
      message: session.message
    };
    return result;
  }
  if (!_.isNil(code) && _.get(session, "message")) {
    // Other codes
    result = {
      state: "Unauthenticated",
      error: new Error(session.message)
    };
    // Alert.alert(`result code: ${code}, result: ${JSON.stringify(result)}`);

    return result;
  }

  result = {
    state: isError ? "AuthenticationError" : "Unauthenticated",
    error: isError ? session : undefined
  };
  // Alert.alert(isError ? `result: ${result.state} and error: ${result.error}` : `result: ${result.state}`)
  return result;
};

/**
 * Handles user login event
 * @param input See {@link CognitoUserVariables}
 * @returns See {@link IAuthenticationResult}
 */
export const signIn = async (
  input: CognitoUserVariables
): Promise<IAuthenticationResult> => {
  try {
    const result = await Auth.signIn(
      input.username as string,
      input.password as string
    );
    return checkSession(result);
  } catch (error) {
    return checkSession(error);
  }
};
/**
 * Start the change password flow with AWS Cognito, followed by the {@link ConfirmPassword}
 * @param input See {@link ICognitoUserVariables}
 * @returns See {@link IAuthenticationResult}
 */
export const forgotPassword = async (
  username: string
): Promise<IAuthenticationResult> => {
  try {
    const result = await Auth.forgotPassword(username);
    return checkSession(result);
  } catch (error) {
    return checkSession(error);
  }
};

/**
 *
 * @param request
 * @param code
 * @param password
 */
export const confirmPassword = async (
  request: ConfirmPasswordRequest
): Promise<IAuthenticationResult> => {
  try {
    const { username, code, password } = request;
    await Auth.forgotPasswordSubmit(username, code, password);
    return checkSession();
  } catch (error) {
    return checkSession(error);
  }
};

/**
 * Handles confirm account event
 * @param code user code used to confirm account
 * @param userName the user to confirm
 * @returns See {@link IAuthenticationResult}
 */
export const confirmAccount = async (
  request: ConfirmAccountRequest
): Promise<IAuthenticationResult> => {
  try {
    const { username, code } = request;
    const codeInt = Number(code);
    if (!codeInt || codeInt < 100) {
      throw Error("Not a valid Code");
    }
    const result = await Auth.confirmSignUp(username, code, {
      forceAliasCreation: true
    });
    return checkSession(result);
  } catch (error) {
    return checkSession(error);
  }
};
/**
 * Register the user with AWS Cognito through Amplify
 * @param input See {@link ICognitoUserVariables}
 * @returns See {@link IAuthenticationResult}
 */
export const signUp = async (
  input: CognitoUserVariables,
  attrs: CognitoAttributes
): Promise<IAuthenticationResult> => {
  const { email, given_name, family_name, preferred_username } = attrs;
  const opts = {
    username: input.username as string,
    password: input.password as string,
    attributes: {
      email,
      given_name,
      family_name,
      preferred_username
    }
  };
  try {
    const result = await Auth.signUp(opts);
    return checkSession(result);
  } catch (error) {
    return checkSession(error);
  }
};

/**
 * Handles the process of sending a new account confirmation code.
 *
 * @param input
 */
export const resendConfirmationCode = async (
  username: string
): Promise<IAuthenticationResult> => {
  try {
    if (_.isNil(username)) {
      throw Error("Username must be supplied to resend confirmation code");
    }
    const result = await Auth.resendSignUp(username);
    return checkSession(result);
  } catch (error) {
    return checkSession(error);
  }
};

/**
 * Handles the process of signing out a user who is currently authenticated .
 *
 */
export const signOut = async (): Promise<IAuthenticationResult> => {
  try {
    await Auth.signOut();
    return checkSession();
  } catch (error) {
    return checkSession(error);
  }
};

/**
 *
 * @param request
 */
export const changePassword = async (
  request: ChangePasswordRequest
): Promise<any> => {
  try {
    const { oldPassword, password } = request;
    const user = await Auth.currentAuthenticatedUser();
    const result = await Auth.changePassword(user, oldPassword, password);
    return result;
  } catch (error) {
    return error;
  }
};

export const updatePreferredUsername = async (
  newPrefUsername: string
): Promise<IAuthenticationResult> => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    const result = await Auth.updateUserAttributes(user, {
      preferred_username: newPrefUsername
    });
    return checkSession(result);
  } catch (error) {
    return checkSession(error);
  }
};

export const updateEmail = async (newEmail: string): Promise<any> => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    const result = await Auth.updateUserAttributes(user, { email: newEmail });
    return result;
  } catch (error) {
    console.log(error);
    return error;
    // return CheckSession(error);
  }
};

export const requestUpdateEmailVerification = async () => {
  try {
    const response = await Auth.verifyCurrentUserAttribute("email");
    return response;
  } catch (error) {
    return error;
  }
};

export const verifyUpdateEmail = async (code: string): Promise<any> => {
  try {
    const result = await Auth.verifyCurrentUserAttributeSubmit("email", code);
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateUserAttributes = async (
  attributes: EditableAttributes | Omit<EditableAttributes, "phone_number">
): Promise<IAuthenticationResult> => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    console.log(attributes);
    const result = await Auth.updateUserAttributes(user, attributes);
    console.log(result);
    return checkSession(result);
  } catch (error) {
    console.log(error);
    return checkSession(error);
  }
};

export const createIdentityProviderSession = ({
  id_token,
  access_token,
  refresh_token
}: IdentityProviderSignInRequest) => {
  const IdToken = new CognitoIdToken({ IdToken: id_token });
  const AccessToken = new CognitoAccessToken({ AccessToken: access_token });
  const RefreshToken = new CognitoRefreshToken({
    RefreshToken: refresh_token!
  });
  return new CognitoUserSession({ IdToken, AccessToken, RefreshToken });
};
// tslint:disable-next-line:variable-name
export const identityProviderSignIn = async (
  credentials: IdentityProviderSignInRequest
) => {
  try {
    const session = createIdentityProviderSession(credentials);
    const user = Auth.createCognitoUser(
      session.getIdToken().decodePayload()["cognito:username"]
    ) as CognitoUser;
    user.setSignInUserSession(session);
    const currentUser = (await Auth.currentAuthenticatedUser()) as CognitoUser;
    return checkSession(currentUser);
  } catch (error) {
    return checkSession(error);
  }
};

export const getAttributes = async (): Promise<CognitoAttribute[] | null> => {
  try {
    const user = (await Auth.currentAuthenticatedUser()) as CognitoUser;
    const result = (await Auth.userAttributes(user)) as CognitoUserAttribute[];
    const attributes = result
      .filter(notEmpty)
      .map(attr => attr.toJSON() as CognitoAttribute);
    console.log(attributes);
    return attributes;
  } catch (error) {
    return null;
  }
};

const AuthApi = {
  checkSession,
  signIn,
  signUp,
  signOut,
  confirmAccount,
  confirmPassword,
  forgotPassword,
  changePassword,
  resendConfirmationCode,
  updatePreferredUsername,
  updateEmail,
  updateUserAttributes,
  identityProviderSignIn,
  getAttributes,
  verifyUpdateEmail,
  requestUpdateEmailVerification
};

export default AuthApi;
