export interface CreateChatRoomResponse {
  chatRoomId: number;
  auctionId: number;
  sellerId: number;
  sellerNickname: string;
  buyerId: number;
  buyerNickname: string;
  paymentStatus: "PENDING" | "COMPLETED";
}

export interface ChatRoomListItem {
  chatRoomId: number;
  auctionId: number;
  goodsName: string;
  imageUrl: string | null;
  finalPrice: number;
  paymentStatus: "PENDING" | "COMPLETED";
  sellerId: number;
  sellerNickname: string;
  buyerId: number;
  buyerNickname: string;
  opponentNickname: string;
  opponentProfileImageUrl: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface ChatMessageItem {
  messageId: number;
  senderId: number;
  senderName: string;
  profileImageUrl: string;
  messageContent: string;
  sendAt: string;
  isRead: boolean;
  myMessage: boolean;
  clientMessageId?: string;
  deliveryStatus?: "pending" | "sent" | "failed";
}

export type ChatMesageList = ChatMessageItem[];
