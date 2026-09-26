import { Alarm, Logo } from "@/assets/svgs/main";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useNavigate } from "react-router-dom";

export default function HeaderBell() {
  const navigate = useNavigate();
  const unread = useNotificationStore(s => s.unreadCount);

  return (
    <header className="max-w-[360px] w-full z-10 mx-auto  py-4">
      <div className="flex items-center justify-between">
        {/* LOGO */}
        <Logo className="h-auto w-[58px] ml-3" aria-label="AUC" />

        {/* 알림 버튼 */}
        <div className="mr-3">
          <button className="relative" onClick={() => navigate("/alarm")}>
            <Alarm className="w-6 h-6 cursor-pointer" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-mainpink text-white text-reg12 rounded-full flex items-center z-50 justify-center">
                {unread}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
