export interface MyAuctionItem {
  id: number;
  title: string;

  imageUrl: string | null;
  imageUrls: string[];

  currentPrice: number;
  price: number;

  endAt: string;
  status: string;
  paymentStatus?: "PENDING" | "COMPLETED";
  hasWinner?: boolean;

  timeLeft?: {
    hours: number;
    minutes: number;
  };
}

export interface MyAuctionsResponse {
  auctions: MyAuctionItem[];
}
