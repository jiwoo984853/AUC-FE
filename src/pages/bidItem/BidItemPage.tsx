import LoadingSpinner from "@/components/common/LoadingSpinner";
import Bidding from "@/components/item/bid/bidding/Bidding";
import Header from "@/components/item/bid/header/Header";
import WonBid from "@/components/item/bid/won/WonBid";
import { useChatApi } from "@/hooks/chat/useChatApi";
import { useBidApi } from "@/hooks/item/bid/useBidApi";
import { useUserStore } from "@/store/useUserStore";
import { useNavigate } from "react-router-dom";

const BidItemPage = () => {
  const navigate = useNavigate();
  const userId = useUserStore(state => state.userId);

  const { getAuctionSummaryQuery } = useBidApi();
  const { postCreateChatRoomMutation } = useChatApi();

  const { data: items, isLoading } = getAuctionSummaryQuery(userId);
  const { mutate: creatChatRoom } = postCreateChatRoomMutation();

  const handleChatClick = (auctionId: number) => {
    const selectedItem = items?.wonItems.find(
      item => item.auctionId === auctionId
    );

    creatChatRoom(auctionId, {
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
              paymentStatus: res.paymentStatus,
            },
          },
        });
      },
      onError: err => {
        console.error("채팅방 생성 실패: ", err);
        alert("채팅방 연결에 실패했습니다.");
      },
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex flex-col gap-2 bg-grey02">
        <WonBid wonItems={items?.wonItems || []} onChat={handleChatClick} />
        <Bidding biddingItems={items?.bidItems || []} />
      </div>
    </div>
  );
};

export default BidItemPage;
