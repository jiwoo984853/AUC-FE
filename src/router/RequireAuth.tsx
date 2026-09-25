import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import { refreshAccessToken } from "@/apis/auth/refreshAccessToken";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useAuthStore } from "@/store/useAuthStore";

const RequireAuth = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const [isCheckingSession, setIsCheckingSession] = useState(!isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      setIsCheckingSession(false);
      return;
    }

    let cancelled = false;
    refreshAccessToken()
      .then(({ accessToken }) => {
        if (!cancelled) useAuthStore.getState().login(accessToken);
      })
      .catch(() => {
        if (!cancelled) useAuthStore.getState().logout();
      })
      .finally(() => {
        if (!cancelled) setIsCheckingSession(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  if (isCheckingSession) return <LoadingSpinner />;

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
