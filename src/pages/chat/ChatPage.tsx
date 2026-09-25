import Footer from "@/components/chat/footer/Footer";
import Header from "@/components/chat/header/Header";
import MessageList from "@/components/chat/message/MessageList";
import ConfirmModal from "@/components/common/ConfirmModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useChatApi } from "@/hooks/chat/useChatApi";
import { useStompClient } from "@/hooks/chat/useStompClientApi";
import { useUserStore } from "@/store/useUserStore";
import { ChatMesageList, ChatMessageItem } from "@/types/chat/chatApi.type";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const ChatPage = () => {
  const { id } = useParams();
  const roomId = Number(id);
  const navigate = useNavigate();
  const location = useLocation();

  const [isSending, setSending] = useState(false);
  const [isModalOPen, setModalOpen] = useState(false);
  const pendingTimers = useRef(
    new Map<string, ReturnType<typeof setTimeout>>()
  );

  useEffect(() => {
    const timers = pendingTimers.current;
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const itemInfo = location.state?.itemInfo;

  useEffect(() => {
    if (!itemInfo) {
      alert("잘못된 접근입니다.");
      navigate("/items", { replace: true });
    }
  }, [itemInfo, navigate]);

  const userId = useUserStore(state => state.userId);
  const userName = useUserStore(state => state.userName);
  const userImage = useUserStore(state => state.userImage);

  const isBuyer = itemInfo ? userId === itemInfo.buyerId : false;
  const opponentName = isBuyer
    ? itemInfo?.sellerNickname
    : itemInfo?.buyerNickname;

  const { getChatMessageQuery, postChatCompleteMutation } = useChatApi();
  const { data: initialChatMessages, isLoading } = getChatMessageQuery(roomId);

  const [realTimeMessages, setRealTimeMessages] = useState<ChatMesageList>([]);

  const handleReceiveMessage = useCallback(
    (message: ChatMessageItem) => {
      const confirmedMessage = {
        ...message,
        myMessage: message.senderId === userId,
      };
      if (message.clientMessageId) {
        clearTimeout(pendingTimers.current.get(message.clientMessageId));
        pendingTimers.current.delete(message.clientMessageId);
      }
      setRealTimeMessages(prev => {
        const pendingIndex = message.clientMessageId
          ? prev.findIndex(
              item => item.clientMessageId === message.clientMessageId
            )
          : -1;
        if (pendingIndex >= 0) {
          return prev.map((item, index) =>
            index === pendingIndex ? confirmedMessage : item
          );
        }
        if (prev.some(item => item.messageId === message.messageId))
          return prev;
        return [...prev, confirmedMessage];
      });
    },
    [userId]
  );

  const handleConnectionError = useCallback(() => {
    pendingTimers.current.forEach(timer => clearTimeout(timer));
    pendingTimers.current.clear();
    setRealTimeMessages(prev =>
      prev.map(item =>
        item.deliveryStatus === "pending"
          ? { ...item, deliveryStatus: "failed" }
          : item
      )
    );
  }, []);

  const { sendMessage } = useStompClient({
    roomId,
    onMessage: handleReceiveMessage,
    onConnectionError: handleConnectionError,
  });

  const disaplayMessages: ChatMesageList = [
    ...(initialChatMessages || []),
    ...realTimeMessages.filter(
      message =>
        message.deliveryStatus !== "sent" ||
        !initialChatMessages?.some(
          initial => initial.messageId === message.messageId
        )
    ),
  ];

  const handleMessageSubmit = (text: string): boolean => {
    if (isSending) return false;
    setSending(true);

    const clientMessageId = crypto.randomUUID();
    const payload = {
      messageContent: text,
      clientMessageId,
    };

    const tempMessage: ChatMessageItem = {
      messageId: -Date.now(),
      senderId: userId as number,
      senderName: userName || "",
      profileImageUrl: userImage || "",
      messageContent: text,
      sendAt: new Date().toISOString(),
      isRead: false,
      myMessage: true,
      clientMessageId,
      deliveryStatus: "pending",
    };

    try {
      const success = sendMessage(payload);
      if (!success) {
        alert("채팅 서버와 연결에 실패했습니다.");
        return false;
      }
      setRealTimeMessages(prev => [...prev, tempMessage]);
      pendingTimers.current.set(
        clientMessageId,
        setTimeout(() => {
          pendingTimers.current.delete(clientMessageId);
          setRealTimeMessages(prev =>
            prev.map(item =>
              item.clientMessageId === clientMessageId &&
              item.deliveryStatus === "pending"
                ? { ...item, deliveryStatus: "failed" }
                : item
            )
          );
        }, 10000)
      );
      return true;
    } catch (error) {
      console.error("메세지 전송 실패", error);
      alert("메세지 전송에 실패했습니다.");
      return false;
    } finally {
      setSending(false);
    }
  };

  const { mutate: postCompleteChat } = postChatCompleteMutation();

  const handleRemoveFailed = (clientMessageId: string) => {
    setRealTimeMessages(prev =>
      prev.filter(item => item.clientMessageId !== clientMessageId)
    );
  };

  const handelCompleteAution = () => {
    postCompleteChat(roomId, {
      onSuccess: () => {
        setModalOpen(false);
        navigate("/items");
      },
      onError: error => {
        console.error("거래 완료 실패: ", error);
        alert("거래 완료 처리에 실패했습니다.");
        setModalOpen(false);
      },
    });
  };

  if (!itemInfo) return null;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        opponentName={opponentName}
        goodsName={itemInfo.goodsName}
        imageUrl={itemInfo.imageUrl}
      />
      <MessageList
        messages={disaplayMessages}
        onRemoveFailed={handleRemoveFailed}
      />
      <Footer
        isBuyer={isBuyer}
        isSending={isSending}
        onSubmit={handleMessageSubmit}
        onComplete={() => setModalOpen(true)}
      />

      <ConfirmModal
        isOpen={isModalOPen}
        onClose={() => setModalOpen(false)}
        onConfirm={handelCompleteAution}
        title="거래 종료"
        confirmText="거래 완료 됐어요"
      >
        <p>
          거래가 무사히 성사되었나요?
          <br />
          상품을 받으신 후, 거래 완료를 눌러주세요
        </p>
      </ConfirmModal>
    </div>
  );
};

export default ChatPage;
