import Read from "@/assets/svgs/chat/read.svg?react";
import { useUserStore } from "@/store/useUserStore";
import { ChatMessageItem } from "@/types/chat/chatApi.type";
import { formatTimeStamp } from "@/utils/dateUtils";

interface MessageItemProps {
  msg: ChatMessageItem;
  onRemoveFailed: (clientMessageId: string) => void;
}

const MessageItem = ({ msg, onRemoveFailed }: MessageItemProps) => {
  const userId = useUserStore(state => state.userId);
  const isSender = msg.myMessage || msg.senderId === userId;

  if (isSender) {
    return (
      <div className="flex justify-end mb-5">
        <div className="flex flex-col items-end gap-2 ml-10">
          <div className="px-4 py-3 bg-mainpink text-white rounded-2xl rounded-br-md whitespace-pre-line">
            {msg.messageContent}
          </div>

          <div className="flex items-center justify-center gap-1">
            <span className="text-reg12 text-bluegrey08">
              {formatTimeStamp(msg.sendAt || new Date().toISOString())}
            </span>
            {msg.isRead && <Read className="w-3 h-3" />}
            {msg.deliveryStatus === "pending" && <span>전송 중</span>}
            {msg.deliveryStatus === "failed" && (
              <button
                type="button"
                onClick={() =>
                  msg.clientMessageId && onRemoveFailed(msg.clientMessageId)
                }
                className="text-red-500 underline cursor-pointer"
              >
                전송 확인 실패 · 삭제
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-5">
      <div className="flex items-end gap-3">
        <img
          src={msg.profileImageUrl}
          alt={msg.senderName}
          className="w-8 h-8 bg-grey04 rounded-full object-cover"
        />

        <div className="flex flex-col gap-2 mr-10">
          <div className="px-4 py-3 bg-white text-bluegrey10 border border-bluegrey02 rounded-2xl rounded-bl-md whitespace-pre-line">
            {msg.messageContent}
          </div>
          <div className="text-reg12 text-bluegrey08">
            {formatTimeStamp(msg.sendAt || new Date().toISOString())}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
