import {
  GetUserProfileResponse,
  PutUserProfileRequset,
  PutUserProfileResponse,
} from "@/types/login/loginApi.type";

import axios from "axios";
import { refreshAccessToken } from "./refreshAccessToken";

import instance from "@/apis/instance";
export { refreshAccessToken as postRefresh } from "@/apis/auth/refreshAccessToken";

export const putUserProfile = async (
  data: PutUserProfileRequset
): Promise<PutUserProfileResponse> => {
  const response = await instance.put("/user/profile", data);
  return response.data;
};

export const getUserProfile = async (): Promise<GetUserProfileResponse> => {
  const response = await instance.get("/user/profile");
  return response.data;
};

export const postLogout = async (): Promise<void> => {
  // Refresh first so logout also works after the access token expires.
  const { accessToken } = await refreshAccessToken();
  await axios.post(
    `${import.meta.env.VITE_AUTH_API_URL ?? import.meta.env.VITE_SERVER_API_URL}/api/auth/logout`,
    {},
    {
      withCredentials: true,
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
};
