import MessageItem from "@/components/chat/message/MessageItem";
import { ChatMesageList } from "@/types/chat/chatApi.type";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: ChatMesageList;
  onRemoveFailed: (clientMessageId: string) => void;
}

const MessageList = ({ messages, onRemoveFailed }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map(msg => (
        <MessageItem
          key={msg.clientMessageId || msg.messageId}
          msg={msg}
          onRemoveFailed={onRemoveFailed}
        />
      ))}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default MessageList;
