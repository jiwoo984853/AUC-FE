import instance from "@/apis/instance";
import type { DeckAuctionResponse } from "@/types/auction/deckApi.type";

export const getAuctionDeck = async (
  excludeIds: number[] = []
): Promise<DeckAuctionResponse> => {
  const res = await instance.get<DeckAuctionResponse>("/auctions/deck", {
    params: excludeIds.length
      ? { excludeIds: excludeIds.join(",") }
      : undefined,
  });
  return res.data;
};
