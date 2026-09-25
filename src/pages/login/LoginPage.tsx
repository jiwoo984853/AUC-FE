import { Kakao, Logo } from "@/assets/svgs/common";

const KAKAO_AUTH_URL = `${import.meta.env.VITE_AUTH_API_URL ?? import.meta.env.VITE_SERVER_API_URL}/oauth2/authorization/kakao`;

const LoginPage = () => {
  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div className="relative h-screen">
      <div className="absolute top-[40%] left-1/2 -translate-1/2 w-full flex flex-col items-center px-8">
        <Logo className="w-32 h-32" />
        <h1 className="text-center text-semibold20 text-darkgrey05 mb-14">
          간편하게 로그인하고
          <br />
          바로 서비스를 이용해보세요
        </h1>
        <button
          onClick={handleKakaoLogin}
          className="bg-kakao w-full rounded-md flex items-center justify-center gap-5 py-3 cursor-pointer"
        >
          <Kakao className="w-6 h-5" />
          <span className="text-med16 text-black">카카오계정으로 로그인</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
