export type NotificationType =
  | "OUTBID"
  | "WIN"
  | "FAIL"
  | "NEXT_WINNER_OFFER"
  | "AUCTION_CANCELLED";

export interface NotificationItem {
  id: number;
  message: string;
  auctionId: number;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}
