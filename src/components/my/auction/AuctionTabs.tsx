interface AuctionTabsProps {
  activeTab: "ongoing" | "completed";
  setActiveTab: (tab: "ongoing" | "completed") => void;
  ongoingCount: number;
  completedCount: number;
}

const AuctionTabs = ({
  activeTab,
  setActiveTab,
  ongoingCount,
  completedCount,
}: AuctionTabsProps) => {
  return (
    <div className="mt-4 px-4">
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => (window.location.href = "/my/item/new")}
          className="cursor-pointer rounded-lg bg-bluegrey01 px-3 py-2 text-med14 text-darkgrey05"
        >
          + 새 경매 등록
        </button>
      </div>

      <div className="flex border-b -mx-3.5 border-bluegrey02">
        <button
          onClick={() => setActiveTab("ongoing")}
          className={`flex-1 py-3 text-center text-med16 cursor-pointer ${
            activeTab === "ongoing"
              ? "text-darkgrey05 border-b-2 border-darkgrey05"
              : "text-bluegrey07"
          }`}
        >
          경매중 <span className="ml-1">{ongoingCount}</span>
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`flex-1 py-3 text-center text-med16 cursor-pointer ${
            activeTab === "completed"
              ? "text-darkgrey05 border-b-2 border-darkgrey05"
              : "text-bluegrey07"
          }`}
        >
          거래 완료 <span className="ml-1">{completedCount}</span>
        </button>
      </div>
    </div>
  );
};

export default AuctionTabs;
