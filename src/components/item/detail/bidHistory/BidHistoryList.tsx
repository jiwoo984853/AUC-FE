import BidHistoryItem from "@/components/item/detail/bidHistory/BidHistoryItem";
import { BidHistoryResponse } from "@/types/item/bid/bidApi.type";
import { useState } from "react";

interface BidHistoryListProps {
  status: "IN_PROGRESS" | "CLOSED" | "CANCELLED";
  bidData: BidHistoryResponse;
}

const BidHistoryList = ({ status, bidData }: BidHistoryListProps) => {
  const [showAll, setShowAll] = useState(false);

  const displayBids = showAll ? bidData.bids : bidData.bids.slice(0, 4);

  return (
    <div className="bg-white py-4 mb-2">
      <div className="mx-4">
        <h3 className="text-med18 text-darkgrey05 mb-4">입찰 히스트리</h3>

        <div className="flex flex-col gap-3">
          {bidData.bids.length > 0 ? (
            displayBids.map((bid, index) => {
              const rank = index + 1;

              const isWinner =
                (status === "CLOSED" || status === "CANCELLED") && rank === 1;
              const isCurrentTop = status === "IN_PROGRESS" && rank === 1;

              return (
                <BidHistoryItem
                  key={index}
                  bid={bid}
                  rank={rank}
                  isWinner={isWinner}
                  isCurrentTop={isCurrentTop}
                />
              );
            })
          ) : (
            <p className="text-center text-reg14 text-grey06 py-6">
              아직 입찰 내역이 없습니다.
            </p>
          )}
        </div>

        {!showAll && bidData.count > 4 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full mt-4 py-2 text-center text-reg14 text-darkgrey02 cursor-pointer hover:bg-grey04 rounded-lg"
          >
            모든 입찰 보기 ({bidData.count})
          </button>
        )}
      </div>
    </div>
  );
};

export default BidHistoryList;
