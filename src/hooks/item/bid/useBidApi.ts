import { postBid } from "@/apis/auction/createBidApi";
import { postSwipeAction } from "@/apis/auction/postSwipeApi";
import { getAuctionSummary, getBidHistory } from "@/apis/item/bid/bidApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  CreateBidRequest,
  CreateBidResponse,
} from "@/types/item/bid/bidApi.type";

export const useBidApi = () => {
  const getAuctionSummaryQuery = (userId: number | null) => {
    return useQuery({
      queryKey: ["auctionSummary", userId],
      queryFn: () => getAuctionSummary(userId!),
      enabled: !!userId,
    });
  };

  const getBidHistoryQuery = (auctionId: number) => {
    return useQuery({
      queryKey: ["bidHistory", auctionId],
      queryFn: () => getBidHistory(auctionId),
      enabled: !!auctionId,
      refetchInterval: 5000,
      refetchOnMount: true,
    });
  };

  const postSwipMutation = () => {
    return useMutation({
      mutationFn: postSwipeAction,
    });
  };

  const postBidMutation = () => {
    return useMutation<
      CreateBidResponse,
      AxiosError<{ message?: string; detail?: string }>,
      CreateBidRequest
    >({
      mutationFn: postBid,
    });
  };

  return {
    getAuctionSummaryQuery,
    getBidHistoryQuery,
    postSwipMutation,
    postBidMutation,
  };
};
