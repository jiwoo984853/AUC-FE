export interface DeckAuctionItem {
  id: number;
  title: string;
  imageUrl: string;
  currentPrice: number;
  endAt: string;

  bidPlaced?: boolean;
  bidPrice?: number;
}

export interface DeckAuctionResponse {
  auctions: DeckAuctionItem[];
}

export type SwipeActionRequest =
  | { auctionId: number; action: "BIDDING"; bidId: number }
  | { auctionId: number; action: "DISLIKE" | "HOLD" };

export interface SwipeActionResponse {
  success: boolean;
}
