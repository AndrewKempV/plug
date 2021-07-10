import { CognitoAttributes, CognitoUserVariables } from "../types/auth";
import { IAddress } from "./IAdress";

interface IUser {
  id?: number;
  auth: CognitoUserVariables;
  attributes: CognitoAttributes;
  address?: IAddress;
  phone?: string;
}

export { IUser };
