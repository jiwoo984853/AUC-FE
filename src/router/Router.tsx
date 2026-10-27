import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import LayoutWithFooter from "@/layouts/LayoutWithFooter";
import MainLayout from "@/layouts/MainLayout";

// 메인(홈)
const HomePage = lazy(() => import("@/pages/home/HomePage"));

// 로그인
const AdditionalInfoPage = lazy(
  () => import("@/pages/login/AdditionalInfoPage")
);
const KakaoRedirectPage = lazy(() => import("@/pages/login/KakaoRedirectPage"));
const LoginPage = lazy(() => import("@/pages/login/LoginPage"));

// 검색
const CategoryResultPage = lazy(
  () => import("@/pages/search/CategoryResultPage")
);
const CategorySearchPage = lazy(
  () => import("@/pages/search/CategorySearchPage")
);
const CategorySelectPage = lazy(
  () => import("@/pages/search/CategorySelectPage")
);
const SearchPage = lazy(() => import("@/pages/search/SearchPage"));
const SearchResultPage = lazy(() => import("@/pages/search/SearchResultPage"));

// 입찰/아이템
const BidItemPage = lazy(() => import("@/pages/bidItem/BidItemPage"));
const ItemDetailPage = lazy(() => import("@/pages/itemDetail/ItemDetailPage"));

// 마이/포인트
const ChargePointPage = lazy(() => import("@/pages/my/charge/ChargePointPage"));
const PaymentFailPage = lazy(() => import("@/pages/my/charge/PaymentFailPage"));
const PaymentSuccessPage = lazy(
  () => import("@/pages/my/charge/PaymentSuccessPage")
);
const MyPage = lazy(() => import("@/pages/my/MyPage"));
const EditProfilePage = lazy(() => import("@/pages/my/EditProfilePage"));
const NewAutionPage = lazy(() => import("@/pages/my/NewAutionPage"));
const PointInquiryPage = lazy(() => import("@/pages/my/PointInquiryPage"));

// 알림
const AlarmPage = lazy(() => import("@/pages/alarm/AlarmPage"));

// 기타
const ChatPage = lazy(() => import("@/pages/chat/ChatPage"));
const NotFoundPage = lazy(() => import("@/pages/notFound/NotFoundPage"));
const RequireAuth = lazy(() => import("@/router/RequireAuth"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // 공개 라우트
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "auth/kakao/callback",
        element: <KakaoRedirectPage />,
      },

      // 보호된 라우트
      {
        element: <RequireAuth />,
        children: [
          // Footer가 있는 화면
          {
            element: <LayoutWithFooter />,
            children: [
              { index: true, element: <HomePage /> },
              { path: "items", element: <BidItemPage /> },
              { path: "search", element: <SearchPage /> },
              { path: "search/result", element: <SearchResultPage /> },
              {
                path: "search/category-select",
                element: <CategorySelectPage />,
              },
              {
                path: "search/category-search",
                element: <CategorySearchPage />,
              },
              {
                path: "search/category-result",
                element: <CategoryResultPage />,
              },
              { path: "my", element: <MyPage /> },
            ],
          },

          // Footer가 없는 화면
          {
            path: "register/additional-info",
            element: <AdditionalInfoPage />,
          },
          { path: "item/:id", element: <ItemDetailPage /> },
          { path: "chat/:id", element: <ChatPage /> },
          { path: "alarm", element: <AlarmPage /> },
          { path: "my/points", element: <PointInquiryPage /> },
          { path: "my/profile", element: <EditProfilePage /> },
          { path: "my/points/charge", element: <ChargePointPage /> },
          { path: "my/item/new", element: <NewAutionPage /> },
          { path: "/payment/success", element: <PaymentSuccessPage /> },
          { path: "/payment/fail", element: <PaymentFailPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
