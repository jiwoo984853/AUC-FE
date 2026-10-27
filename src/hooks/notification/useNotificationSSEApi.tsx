import NotificationToast from "@/components/notification/NotificationToast";
import { useAuthStore } from "@/store/useAuthStore";
import { AlarmItem, useNotificationStore } from "@/store/useNotificationStore";
import { Event, EventSourcePolyfill } from "event-source-polyfill";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function useNotificationSSE() {
  const addAlarm = useNotificationStore(s => s.addAlarm);
  const accessToken = useAuthStore(state => state.accessToken);
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSourcePolyfill(
      `${import.meta.env.VITE_SERVER_API_URL}/api/notification/stream`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        heartbeatTimeout: 600000,
      }
    );

    eventSource.onopen = () => {
      console.log("SSE 연결됨!");
    };

    eventSource.addEventListener("win", (e: Event) => {
      const event = e as MessageEvent;
      try {
        const data = JSON.parse(event.data);

        const newAlarm: AlarmItem = {
          id: Date.now(),
          message: data.message,
          auctionId: data.auctionId || 0,
          type: "WIN",
          isRead: false,
          createdAt: new Date().toISOString(),
          timeLabel: "방금 전",
          typeLabel: "낙찰 성공",
        };
        addAlarm(newAlarm);

        toast.custom(
          t => <NotificationToast t={t} message={data.message} type="WIN" />,
          {
            position: "top-center",
            duration: 10000,
          }
        );
      } catch (err) {
        console.error("WIN 이벤트 파싱 에러:", err);
      }
    });

    eventSource.addEventListener("outbid", (e: Event) => {
      const event = e as MessageEvent;
      try {
        const data = JSON.parse(event.data);

        const newAlarm: AlarmItem = {
          id: Date.now(),
          message: data.message,
          auctionId: data.auctionId || 0,
          type: "OUTBID",
          isRead: false,
          createdAt: new Date().toISOString(),
          timeLabel: "방금 전",
          typeLabel: "입찰 알림",
        };
        addAlarm(newAlarm);

        toast.custom(
          t => <NotificationToast t={t} message={data.message} type="OUTBID" />,
          {
            position: "top-center",
            duration: 10000,
          }
        );
      } catch (err) {
        console.error("OUTBID 이벤트 파싱 에러:", err);
      }
    });

    eventSource.addEventListener("auction-cancelled", (e: Event) => {
      const event = e as MessageEvent;
      try {
        const data = JSON.parse(event.data);

        const newAlarm: AlarmItem = {
          id: Date.now(),
          message: data.message,
          auctionId: data.auctionId || 0,
          type: "AUCTION_CANCELLED",
          isRead: false,
          createdAt: new Date().toISOString(),
          timeLabel: "방금 전",
          typeLabel: "경매 취소",
        };
        addAlarm(newAlarm);

        toast.custom(
          t => (
            <NotificationToast
              t={t}
              message={data.message}
              type="AUCTION_CANCELLED"
            />
          ),
          {
            position: "top-center",
            duration: 10000,
          }
        );
      } catch (err) {
        console.error("AUCTION_CANCELLED 이벤트 파싱 에러:", err);
      }
    });

    eventSource.onerror = err => {
      console.error("SSE error →", err);
      if (eventSource.readyState === EventSource.CLOSED) {
        eventSource.close();
      }
    };

    eventSourceRef.current = eventSource;

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [accessToken]);
}
