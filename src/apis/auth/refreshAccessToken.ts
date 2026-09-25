import type { PostRefreshResponse } from "@/types/login/loginApi.type";
import axios from "axios";

let pendingRefresh: Promise<PostRefreshResponse> | null = null;

export const refreshAccessToken = (): Promise<PostRefreshResponse> => {
  if (!pendingRefresh) {
    pendingRefresh = axios
      .post<PostRefreshResponse>(
        `${import.meta.env.VITE_AUTH_API_URL ?? import.meta.env.VITE_SERVER_API_URL}/token/access`,
        {},
        { withCredentials: true }
      )
      .then(response => response.data)
      .finally(() => {
        pendingRefresh = null;
      });
  }
  return pendingRefresh;
};
