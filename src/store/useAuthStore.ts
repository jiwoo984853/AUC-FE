import { create } from "zustand";

type AuthStore = {
  userId: number | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  login: (accessToken: string) => void;
  logout: () => void;
  setAccessToken: (accessToken: string) => void;
};

// 이전 버전에서 저장한 토큰도 브라우저에서 제거한다.
if (typeof window !== "undefined") {
  window.localStorage.removeItem("auth-storage");
}

const getUserId = (accessToken: string): number => {
  const payload = JSON.parse(
    atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
  );
  const userId = Number(payload.id);
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new Error("인증 토큰의 사용자 ID가 유효하지 않습니다.");
  }
  return userId;
};

export const useAuthStore = create<AuthStore>()(set => ({
  userId: null,
  accessToken: null,
  isLoggedIn: false,
  login: accessToken => {
    set({ userId: getUserId(accessToken), accessToken, isLoggedIn: true });
  },
  logout: () => {
    set({ userId: null, accessToken: null, isLoggedIn: false });
  },
  setAccessToken: accessToken => {
    set({ userId: getUserId(accessToken), accessToken, isLoggedIn: true });
  },
}));
