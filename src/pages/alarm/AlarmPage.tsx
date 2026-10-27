import { AlarmItem } from "@/store/useNotificationStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AlarmLogo, AlarmUp } from "@/assets/svgs/alarm";
import { Goback } from "@/assets/svgs/search";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useNotificationList } from "@/hooks/notification/useNotificationApi";
import { useNotificationStore } from "@/store/useNotificationStore";
import { formatTimeAgo } from "@/utils/dateUtils";
import { NotificationType } from "@/types/alarm/notificationApi.type";

const AlarmPage = () => {
  const navigate = useNavigate();

  const { data: notifications, isLoading } = useNotificationList();
  const { setAlarms, resetUnread, alarms } = useNotificationStore();

  const typeLabel = (type: NotificationType) => {
    if (type === "OUTBID") return "상위 입찰";
    if (type === "WIN") return "낙찰 성공";
    if (type === "AUCTION_CANCELLED") return "경매 취소";
    if (type === "NEXT_WINNER_OFFER") return "구매 제안";
    return "경매 종료";
  };

  const getTypeIcon = (type: NotificationType) => {
    return type === "OUTBID" ? AlarmUp : AlarmLogo;
  };

  useEffect(() => {
    if (!notifications) return;

    const mapped = notifications.map(
      (n): AlarmItem => ({
        id: n.id,
        message: n.message,
        auctionId: n.auctionId,
        type: n.type,
        isRead: n.isRead,
        createdAt: n.createdAt,

        typeLabel: typeLabel(n.type),
        timeLabel: formatTimeAgo(n.createdAt),
      })
    );

    setAlarms(mapped);
  }, [notifications, setAlarms]);

  useEffect(() => {
    return () => resetUnread();
  }, []);

  if (isLoading || !notifications) return <LoadingSpinner />;

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="w-full flex items-center px-4 py-3 border-b border-bluegrey02 mt-3 relative">
        <button onClick={() => navigate(-1)} className="text-xl font-bold">
          <Goback className="w-4 h-4 cursor-pointer" />
        </button>
        <h2 className="absolute left-1/2 -translate-x-1/2 text-med16 text-bluegrey10">
          알림
        </h2>
      </div>

      <div className="p-4 mt-4 space-y-6">
        {alarms.map(item => {
          const IconComp = getTypeIcon(item.type);
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 border-b border-grey01 pb-4"
            >
              <IconComp
                className={
                  item.type === "WIN" ? "w-7 h-7 mt-1" : "w-5 h-5 mt-1"
                }
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center min-w-0">
                  <p className="text-grey14 text-[11px]">{item.typeLabel}</p>
                  <p className="text-[11px] text-grey14 whitespace-nowrap shrink-0 ml-auto">
                    {item.timeLabel}
                  </p>
                </div>

                <p className="text-reg14 text-darkgrey05 break-words mt-1">
                  {item.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlarmPage;
