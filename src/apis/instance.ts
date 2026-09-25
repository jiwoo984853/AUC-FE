import { useAuthStore } from "@/store/useAuthStore";
import { refreshAccessToken } from "@/apis/auth/refreshAccessToken";
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: true,
});

instance.interceptors.request.use(config => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (!config.headers.get("Content-Type")) {
    config.headers.set("Content-Type", "application/json");
  }

  return config;
});

instance.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;

    if (err.response?.status === 401 && original && !original._retry) {
      original._retry = true;

      try {
        const { accessToken } = await refreshAccessToken();
        useAuthStore.getState().setAccessToken(accessToken);

        original.headers.set("Authorization", `Bearer ${accessToken}`);

        return instance(original);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
