import { useNavigate } from "react-router-dom";

interface AuctionItem {
  id: number;
  title: string;
  price: number;
  status: string;
  canDelete: boolean;
  imageUrls: string[];
  timeLeft?: {
    hours: number;
    minutes: number;
  };
}

interface AuctionListProps {
  activeTab: "ongoing" | "completed";
  ongoingItems: AuctionItem[];
  completedItems: AuctionItem[];
  deletingAuctionId: number | null;
  onDelete: (item: AuctionItem) => void;
}

const AuctionList = ({
  activeTab,
  ongoingItems,
  completedItems,
  deletingAuctionId,
  onDelete,
}: AuctionListProps) => {
  const navigate = useNavigate();
  const list = activeTab === "ongoing" ? ongoingItems : completedItems;

  const formatTimeLeft = (timeLeft?: { hours: number; minutes: number }) => {
    if (!timeLeft) return "";
    const { hours, minutes } = timeLeft;
    if (hours === 0 && minutes === 0) return "마감";
    if (hours === 0) return `${minutes}분 남음`;
    if (minutes === 0) return `${hours}시간 남음`;
    return `${hours}시간 ${minutes}분 남음`;
  };

  return (
    <div className="mx-4 mt-3 rounded-xl bg-white p-4">
      {list.length === 0 ? (
        <p className="text-sm text-bluegrey07 text-center py-6">
          등록된 경매가 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map(item => (
            <div
              key={item.id}
              onClick={() => navigate(`/item/${item.id}`)}
              className="relative flex cursor-pointer items-center gap-4 rounded-xl border border-bluegrey02 px-4 py-3 transition hover:shadow-sm active:bg-grey01"
            >
              {item.canDelete && (
                <button
                  type="button"
                  disabled={deletingAuctionId === item.id}
                  onClick={event => {
                    event.stopPropagation();
                    onDelete(item);
                  }}
                  className="absolute right-3 top-3 z-10 text-reg12 text-red-500 disabled:text-grey08"
                >
                  {deletingAuctionId === item.id ? "삭제 중…" : "삭제"}
                </button>
              )}
              {/* 왼쪽 상품 이미지 */}
              <div className="w-[72px] h-[72px] rounded-lg flex-shrink-0 overflow-hidden">
                <img
                  src={item.imageUrls?.[0] || "/default.png"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 오른쪽 상품 정보 */}
              <div
                className={`flex flex-1 flex-col justify-center ${
                  item.canDelete ? "pr-10" : ""
                }`}
              >
                <p className="text-reg14 text-darkgrey05 mb-[2px]">
                  {item.title}
                </p>

                <p className="text-reg12 text-darkgrey01 mb-[6px]">
                  {activeTab === "ongoing"
                    ? `최고가: ₩${item.price.toLocaleString()}`
                    : `최종가: ₩${item.price.toLocaleString()}`}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-[2px] rounded-full text-reg12 ${
                      activeTab === "ongoing"
                        ? "bg-lightorange01 text-orange01"
                        : "bg-grey01 text-darkgrey04"
                    }`}
                  >
                    {item.status}
                  </span>
                  <p className="text-reg12 text-darkgrey02 whitespace-nowrap">
                    {activeTab === "ongoing"
                      ? formatTimeLeft(item.timeLeft)
                      : item.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === "completed" && (
        <p className="pt-4 text-center text-reg12 text-darkgrey01">
          등록자가 삭제한 경매는 나타나지 않습니다.
        </p>
      )}
    </div>
  );
};

export default AuctionList;
