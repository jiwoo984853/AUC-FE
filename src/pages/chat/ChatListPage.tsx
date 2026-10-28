import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useChatApi } from "@/hooks/chat/useChatApi";
import { formatTimeAgo } from "@/utils/dateUtils";

const ChatListPage = () => {
  const navigate = useNavigate();
  const { getChatRoomsQuery } = useChatApi();
  const { data: chatRooms, isLoading, isError } = getChatRoomsQuery();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-full bg-white">
      <header className="border-b border-grey04 px-5 py-5">
        <h1 className="text-xl font-bold text-black">채팅</h1>
      </header>

      {isError ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
          <MessageCircle className="mb-3 h-10 w-10 text-grey08" />
          <p className="text-reg14 text-grey14">
            채팅방을 불러오지 못했어요.
            <br />
            잠시 후 다시 시도해 주세요.
          </p>
        </div>
      ) : chatRooms?.length ? (
        <ul className="divide-y divide-grey04">
          {chatRooms.map(room => (
            <li key={room.chatRoomId}>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-5 py-4 text-left"
                onClick={() =>
                  navigate(`/chat/${room.chatRoomId}`, {
                    state: {
                      itemInfo: {
                        goodsName: room.goodsName,
                        imageUrl: room.imageUrl || "",
                        finalPrice: room.finalPrice,
                        sellerId: room.sellerId,
                        sellerNickname: room.sellerNickname,
                        buyerId: room.buyerId,
                        buyerNickname: room.buyerNickname,
                        paymentStatus: room.paymentStatus,
                      },
                    },
                  })
                }
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-grey03">
                  {room.imageUrl ? (
                    <img
                      src={room.imageUrl}
                      alt={room.goodsName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-grey10" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-med16 text-black">
                      {room.opponentNickname}
                    </p>
                    {room.lastMessageAt && (
                      <span className="ml-auto shrink-0 text-[11px] text-grey10">
                        {formatTimeAgo(room.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[12px] text-grey14">
                    {room.goodsName}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="min-w-0 flex-1 truncate text-reg14 text-grey12">
                      {room.lastMessage || "아직 대화가 없습니다."}
                    </p>
                    {room.unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-mainpink px-1.5 text-[11px] text-white">
                        {room.unreadCount > 99 ? "99+" : room.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
          <MessageCircle className="mb-3 h-10 w-10 text-grey08" />
          <p className="text-med16 text-grey14">아직 채팅방이 없어요.</p>
          <p className="mt-1 text-reg14 text-grey10">
            낙찰된 경매에서 채팅을 시작하면 여기에 표시됩니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatListPage;
