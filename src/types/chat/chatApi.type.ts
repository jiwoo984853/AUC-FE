export interface CreateChatRoomResponse {
  chatRoomId: number;
  auctionId: number;
  sellerId: number;
  sellerNickname: string;
  buyerId: number;
  buyerNickname: string;
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
