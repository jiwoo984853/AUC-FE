import { AlarmLogo, AlarmUp } from "@/assets/svgs/alarm";
import { Delete } from "@/assets/svgs/common";
import clsx from "clsx";
import { Toast, toast } from "react-hot-toast";

interface NotificationToastProps {
  t: Toast;
  message: string;
  type: "WIN" | "OUTBID" | "AUCTION_CANCELLED";
}

export default function NotificationToast({
  t,
  message,
  type,
}: NotificationToastProps) {
  const isWin = type === "WIN";
  const title = isWin
    ? "낙찰 성공!"
    : type === "AUCTION_CANCELLED"
      ? "경매 취소"
      : "입찰 알림";

  return (
    <div
      className={clsx(
        "flex items-center gap-4 p-3 w-full max-w-[350px]",
        "rounded-xl shadow-lg bg-white border-none",
        "transition-all duration-300 ease-in-out",

        t.visible
          ? "animate-enter opacity-100 translate-y-0"
          : "animate-leave opacity-0 -translate-y-2"
      )}
    >
      <div>
        {isWin ? (
          <AlarmLogo className="w-10 h-10" />
        ) : (
          <AlarmUp className="w-7 h-7" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-bold14 text-mainpink">{title}</p>
        <p className="mt-1 text-reg14 text-darkgrey02">{message}</p>
      </div>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="ml-2 cursor-pointer"
      >
        <Delete className="w-3 h-3" />
      </button>
    </div>
  );
}
