import {
  GetUserProfileResponse,
  PutUserProfileRequset,
  PutUserProfileResponse,
} from "@/types/login/loginApi.type";

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
