import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import { refreshAccessToken } from "@/apis/auth/refreshAccessToken";
import { useAuthApi } from "@/hooks/auth/useAuthApi";
import { useAuthStore } from "@/store/useAuthStore";

const KakaoRedirectPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authLogin = useAuthStore(state => state.login);
  const { getUserProfileMutation } = useAuthApi();

  const isProcessing = useRef(false);

  useEffect(() => {
    if (isProcessing.current) return;

    const firstLoginParam = searchParams.get("isFirstLogin");
    isProcessing.current = true;

    const finishLogin = async () => {
      try {
        const { accessToken } = await refreshAccessToken();
        authLogin(accessToken);
        if (firstLoginParam === "true") {
          navigate("/register/additional-info", { replace: true });
        } else {
          await getUserProfileMutation.mutateAsync(undefined);
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("로그인 처리 실패:", error);
        useAuthStore.getState().logout();
        navigate("/login", { replace: true });
      }
    };

    finishLogin();
  }, [navigate, authLogin, searchParams]);

  return <LoadingSpinner />;
};

export default KakaoRedirectPage;
