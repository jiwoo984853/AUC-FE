import { useUserStore } from "@/store/useUserStore";
import { AuctionDetailResponse } from "@/types/item/detail/itemDetailApi.type";

interface UseItemStateProps {
  item: AuctionDetailResponse;
}

type ViewState = "LIVE" | "LIVE_BIDDING" | "WON" | "LOST" | "ENDED";

export interface ItemState {
  isLive: boolean;
  isEnded: boolean;
  viewState: ViewState;
  depositAmount: number;
  hasBid: boolean;
  isSeller: boolean;
}

export const useItemState = ({ item }: UseItemStateProps): ItemState => {
  const userId = useUserStore(state => state.userId);

  const isSeller = item.seller.user_id === userId;
  const hasBid = item.myBidPrice !== null && item.myBidPrice > 0;
  const isWinner = item.winner?.user_id === userId;
  const isLive = item.status === "IN_PROGRESS";
  const isEnded = item.status === "CLOSED" || item.status === "CANCELLED";

  /**
   * LIVE : 입찰 안 함(경매중)
   * LIVE_BIDDING : 입찰함(경매중)
   * WON : 낙찰됨
   * LOST : 낙찰 실패
   * ENDED : 경매 종료
   */
  const viewState: ViewState = (() => {
    if (isLive) {
      return hasBid && !isSeller ? "LIVE_BIDDING" : "LIVE";
    }
    if (isEnded) {
      if (isWinner || (isSeller && item.winner?.user_id !== null)) return "WON";
      if (!isWinner && hasBid) return "LOST";
    }
    return "ENDED";
  })();

  // 보증금
  const depositAmount = item.myBidPrice ? item.myBidPrice / 10 : 0;

  return {
    isLive,
    isEnded,
    viewState,
    depositAmount,
    hasBid,
    isSeller,
  };
};
