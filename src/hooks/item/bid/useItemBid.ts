import { useBidApi } from "@/hooks/item/bid/useBidApi";
import { useUserStore } from "@/store/useUserStore";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRef, useState } from "react";

export const useItemBid = (currentPrice: number, auctionId: number) => {
  const [isBidSheetOpen, setBidSheetOpen] = useState(false);
  const [currentHighestPrice, setCurrentHighestPrice] = useState(currentPrice);
  const bidInFlight = useRef(false);
  const queryClient = useQueryClient();

  const { postSwipMutation, postBidMutation } = useBidApi();
  const { mutate: createBid } = postBidMutation();
  const { mutate: swipeAction } = postSwipMutation();

  const userId = useUserStore(state => state.userId);
  if (!userId) {
    alert("로그인이 필요합니다.");
  }

  const handleBidClick = () => {
    setBidSheetOpen(true);
  };

  const handleBidSubmit = (amount: number) => {
    if (bidInFlight.current || !userId) return;
    bidInFlight.current = true;

    createBid(
      {
        auctionId,
        bidPrice: amount,
      },
      {
        onSuccess: bid => {
          bidInFlight.current = false;
          setCurrentHighestPrice(amount);
          setBidSheetOpen(false);
          queryClient.invalidateQueries({
            queryKey: ["auctionDetail", auctionId],
          });
          queryClient.invalidateQueries({
            queryKey: ["bidHistory", auctionId],
          });
          swipeAction(
            { auctionId, action: "BIDDING", bidId: bid.bidId },
            { onError: err => console.error("입찰 상태 기록 실패:", err) }
          );
        },
        onError: (err: AxiosError<{ message: string }>) => {
          bidInFlight.current = false;
          alert(err.response?.data.message || "입찰 도중 오류가 발생했습니다.");
        },
      }
    );
  };

  const closeBidSheet = () => setBidSheetOpen(false);

  return {
    isBidSheetOpen,
    setBidSheetOpen,
    currentHighestPrice,
    handleBidClick,
    handleBidSubmit,
    closeBidSheet,
  };
};
