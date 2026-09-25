import { ChatMessageItem } from "@/types/chat/chatApi.type";
import { useAuthStore } from "@/store/useAuthStore";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";

interface UseStompClientProps {
  roomId: number;
  onMessage: (message: ChatMessageItem) => void;
  onConnectionError: () => void;
}

type ChatMessageEvent = {
  messageId: number;
  senderId: number;
  senderName: string;
  profileImageUrl: string;
  messageContent: string;
  createdAt: string;
  clientMessageId?: string;
};

export const useStompClient = ({
  roomId,
  onMessage,
  onConnectionError,
}: UseStompClientProps) => {
  const stompClient = useRef<Client | null>(null);
  const accessToken = useAuthStore(state => state.accessToken);
  const onMessageRef = useRef(onMessage);
  const onConnectionErrorRef = useRef(onConnectionError);
  onMessageRef.current = onMessage;
  onConnectionErrorRef.current = onConnectionError;

  useEffect(() => {
    if (!roomId || !accessToken) return;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_SERVER_API_URL}/ws/chat`),
      connectHeaders: { Authorization: `Bearer ${accessToken}` },

      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        client.subscribe(`/topic/chat/rooms/${roomId}`, message => {
          const received: ChatMessageEvent = JSON.parse(message.body);
          onMessageRef.current({
            messageId: received.messageId,
            senderId: received.senderId,
            senderName: received.senderName,
            profileImageUrl: received.profileImageUrl,
            messageContent: received.messageContent,
            sendAt: received.createdAt,
            clientMessageId: received.clientMessageId,
            isRead: false,
            myMessage: false,
            deliveryStatus: "sent",
          });
        });
      },

      onStompError: frame => {
        console.error("연결 오류: ", frame.headers["message"]);
        onConnectionErrorRef.current();
      },

      onWebSocketClose: () => onConnectionErrorRef.current(),
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, [roomId, accessToken]);

  const sendMessage = (message: object) => {
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.publish({
        destination: `/app/chat/rooms/${roomId}/send`,
        body: JSON.stringify(message),
      });
      return true;
    } else {
      return false;
    }
  };

  return { sendMessage };
};
