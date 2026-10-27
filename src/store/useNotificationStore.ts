import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NotificationType } from "@/types/alarm/notificationApi.type";

export type AlarmItem = {
  id: number;
  message: string;
  auctionId: number;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;

  timeLabel: string; // 5분 전, 1시간 전
  typeLabel: string; // 상위 입찰, 낙찰 종료
};

type NotificationStore = {
  alarms: AlarmItem[];
  unreadCount: number;

  addAlarm: (alarm: AlarmItem) => void;
  setAlarms: (list: AlarmItem[]) => void;
  resetUnread: () => void;
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    set => ({
      alarms: [],
      unreadCount: 0,

      addAlarm: alarm =>
        set(state => ({
          alarms: [alarm, ...state.alarms],
          unreadCount: state.unreadCount + 1,
        })),

      setAlarms: list =>
        set(() => ({
          alarms: list,
          unreadCount: list.filter(alarm => !alarm.isRead).length,
        })),

      resetUnread: () => set({ unreadCount: 0 }),
    }),
    {
      name: "notification-store",
    }
  )
);
