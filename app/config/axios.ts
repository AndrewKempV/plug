import { Auth } from "aws-amplify";
import axios from "axios";

export const getBearerToken = async () => {
  try {
    const session = await Auth.currentSession();
    return { Authorization: `Bearer ${session.accessToken.jwtToken}` };
  } catch (error) {
    throw error;
  }
};
export const refreshAuthorization = async () => {
  try {
    const session = await Auth.currentSession();
    axios.defaults.headers.common = {
      Authorization: `Bearer ${session.accessToken.jwtToken}`
    };
  } catch (error) {
    throw error;
  }
};
