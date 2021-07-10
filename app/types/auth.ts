import { CognitoUser } from "amazon-cognito-identity-js";

export interface ITestIDProps {
  testID?: string | undefined;
}

/**
 * Describes the current state of user authentication process with AWS Cognito
 */
export type CognitoAuthState =
  | "Authenticated"
  | "AuthenticationError"
  | "Unauthenticated"
  | "ConfirmAccountCodeWaiting"
  | "ConfirmAccountCodeAccepted"
  | "ConfirmAccountCodeNotAccepted"
  | "ConfirmAccountCodeExpired"
  | "NEW_PASSWORD_REQUIRED";
// Consider adding a key for the ambiguous state of UserAlreadyExistsException ;

/**
 * Describes the result of an authentication attempt with Amazon Cognito
 */
export interface IAuthenticationResult {
  message?: string;
  /**
   * See {@link CognitoAuthState}
   */
  state: CognitoAuthState;
  /**
   * If `state` was `AuthenticationError` this contains the error
   */
  error?: Error | undefined;
  /**
   * If `state` was `Authenticated` this contains the user
   */
  user?: CognitoUser | undefined;
}

/**
 * Describes user input for AWS Cognito authentication
 */
export interface CognitoUserVariables {
  password: string | undefined;
  username: string | undefined;
}
/**
 * Describes user attributes for AWS Cognito signup flow.
 */
export interface CognitoAttributes {
  email: string;
  given_name: string;
  family_name: string;
  preferred_username: string;
  gender: string;
  phone_number: string;
  //place phone # and gender fields here then update attribute.
}

export interface CognitoAttribute {
  Name: string;
  Value: string;
}

export interface IUsername {
  username: string;
}
export interface ICode {
  code: string;
}
export interface IPassword {
  password: string;
}
export interface IPhone {
  phone?: string;
}
