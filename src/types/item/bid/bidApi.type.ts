export interface WonItemData {
  auctionId: number;
  goodsName: string;
  createdAt: string;
  finalPrice: number;
  imageUrl: string;
}

export interface BidItemData {
  auctionId: number;
  goodsName: string;
  createdAt: string;
  endAt: string;
  currentPrice: number;
  imageUrl: string;
  status: "IN_PROGRESS" | "FAIL";
}

export interface AuctionSummaryResponse {
  wonItems: WonItemData[];
  bidItems: BidItemData[];
}

export interface BidHistoryData {
  bidId: number;
  userId: number;
  auctionId: number;
  bidPrice: number;
  depositAmount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  depositStatus: "REFUNDED";
  profileImageUrl: string;
  nickname: string;
  createAt: string;
}

export interface BidHistoryResponse {
  count: number;
  bids: BidHistoryData[];
}

export interface CreateBidRequest {
  auctionId: number;
  bidPrice: number;
}

export interface CreateBidResponse {
  bidId: number;
  userId: number;
  auctionId: number;
  bidPrice: number;
  depositAmount: number;
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
  depositStatus: "HELD" | "REFUNDED" | "USED";
}
