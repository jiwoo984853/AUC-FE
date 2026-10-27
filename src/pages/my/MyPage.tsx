import { postLogout } from "@/apis/auth/authApi";
import { useAuthStore } from "@/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import Footer from "@/components/common/Footer";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Bidding from "@/components/item/bid/bidding/Bidding";
import WonBid from "@/components/item/bid/won/WonBid";
import AuctionList from "@/components/my/point/AuctionList";
import AuctionTabs from "@/components/my/auction/AuctionTabs";
import PointCard from "@/components/my/point/PointCard";
import PointHistoryList from "@/components/my/point/PointHistoryList";
import ProfileHeader from "@/components/my/profile/ProfileHeader";
import { useMyAuctions } from "@/hooks/auction/useMyAuctionsApi";
import { useAuthApi } from "@/hooks/auth/useAuthApi";
import { useChatApi } from "@/hooks/chat/useChatApi";
import { useBidApi } from "@/hooks/item/bid/useBidApi";
import { usePointApi } from "@/hooks/my/charge/usePointApi";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setLogoutError("");
    try {
      await postLogout();
      await queryClient.cancelQueries();
      queryClient.clear();
      useUserStore.getState().clearUser();
      useAuthStore.getState().logout();
      // A full navigation also closes active WebSocket/SSE connections.
      window.location.replace("/login");
    } catch {
      setLogoutError("로그아웃하지 못했어요. 잠시 후 다시 시도해 주세요.");
      setIsLoggingOut(false);
    }
  };

  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">(
    "ongoing"
  );
  const [auctionCategory, setAuctionCategory] = useState<
    "registered" | "participated"
  >("registered");

  const { ongoing, completed, loading: auctionLoading } = useMyAuctions();

  const { getUserProfileMutation } = useAuthApi();
  const { getAuctionSummaryQuery } = useBidApi();
  const { postCreateChatRoomMutation } = useChatApi();
  const { getPointHisotryQuery } = usePointApi();
  const { data: PointHistoryData, isLoading: pointLoading } =
    getPointHisotryQuery();

  useEffect(() => {
    getUserProfileMutation.mutate();
  }, []);

  const userName = useUserStore(state => state.userName);
  const userImage = useUserStore(state => state.userImage);
  const point = useUserStore(state => state.point);
  const userId = useUserStore(state => state.userId);
  const { data: participatedItems, isLoading: participatedLoading } =
    getAuctionSummaryQuery(userId);
  const { mutate: createChatRoom } = postCreateChatRoomMutation();
  if (!userName || !userImage) {
    alert("로그인 정보가 없습니다.");
    return;
  }

  const now = new Date();

  const ongoingItems = ongoing.map(a => {
    const end = new Date(a.endAt);
    const diff = end.getTime() - now.getTime();

    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);

    return {
      id: a.id,
      title: a.title,
      price: a.currentPrice,
      status: "경매중",

      imageUrls: a.imageUrls,

      timeLeft: { hours, minutes },
    };
  });

  const completedItems = completed.map(a => ({
    id: a.id,
    title: a.title,
    price: a.currentPrice,
    status: "거래 완료",

    imageUrls: a.imageUrls,
  }));

  const handleChatClick = (auctionId: number) => {
    const selectedItem = participatedItems?.wonItems.find(
      item => item.auctionId === auctionId
    );

    createChatRoom(auctionId, {
      onSuccess: res => {
        navigate(`/chat/${res.chatRoomId}`, {
          state: {
            itemInfo: {
              goodsName: selectedItem?.goodsName,
              imageUrl: selectedItem?.imageUrl?.[0] || "",
              finalPrice: selectedItem?.finalPrice,
              sellerId: res.sellerId,
              sellerNickname: res.sellerNickname,
              buyerId: res.buyerId,
              buyerNickname: res.buyerNickname,
            },
          },
        });
      },
      onError: error => {
        console.error("채팅방 생성 실패: ", error);
        alert("채팅방 연결에 실패했습니다.");
      },
    });
  };

  if (auctionLoading || pointLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 overflow-y-auto pb-20">
        {/* 프로필 */}
        <ProfileHeader name={userName} profileImage={userImage} />

        <div className="px-6 py-3">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 disabled:opacity-50"
          >
            {isLoggingOut ? "로그아웃 중…" : "로그아웃"}
          </button>
          {logoutError && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {logoutError}
            </p>
          )}
        </div>

        {/* 포인트 카드 */}
        <PointCard amount={point} />

        {/* 포인트 내역 */}
        <PointHistoryList histories={PointHistoryData || []} />

        <section className="mt-6">
          <div className="mx-4 flex border-b border-bluegrey02">
            <button
              type="button"
              onClick={() => setAuctionCategory("registered")}
              className={`flex-1 cursor-pointer py-3 text-center text-med16 ${
                auctionCategory === "registered"
                  ? "border-b-2 border-darkgrey05 text-darkgrey05"
                  : "text-bluegrey07"
              }`}
            >
              내가 등록한 경매
            </button>
            <button
              type="button"
              onClick={() => setAuctionCategory("participated")}
              className={`flex-1 cursor-pointer py-3 text-center text-med16 ${
                auctionCategory === "participated"
                  ? "border-b-2 border-darkgrey05 text-darkgrey05"
                  : "text-bluegrey07"
              }`}
            >
              내가 참여한 경매
            </button>
          </div>

          {auctionCategory === "registered" ? (
            <>
              <AuctionTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                ongoingCount={ongoingItems.length}
                completedCount={completedItems.length}
              />
              <AuctionList
                activeTab={activeTab}
                ongoingItems={ongoingItems}
                completedItems={completedItems}
              />
            </>
          ) : participatedLoading ? (
            <div className="py-10">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-2 bg-grey02">
              <WonBid
                wonItems={participatedItems?.wonItems || []}
                onChat={handleChatClick}
              />
              <Bidding biddingItems={participatedItems?.bidItems || []} />
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default MyPage;
