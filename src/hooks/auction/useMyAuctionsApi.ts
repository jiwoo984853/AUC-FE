import { getMyAuctions } from "@/apis/my/myAuctionApi";
import { MyAuctionItem } from "@/types/auction/myauctionApi.type";
import { useEffect, useState } from "react";

export const useMyAuctions = () => {
  const [ongoing, setOngoing] = useState<MyAuctionItem[]>([]);
  const [completed, setCompleted] = useState<MyAuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyAuctions();

        const now = new Date();

        const normalized: MyAuctionItem[] = res.auctions.map(a => ({
          ...a,
          imageUrls: a.imageUrl ? [a.imageUrl] : [],
          price: a.currentPrice,
        }));

        const ongoingItems = normalized.filter(a => new Date(a.endAt) > now);
        const completedItems = normalized.filter(a => new Date(a.endAt) <= now);

        setOngoing(ongoingItems);
        setCompleted(completedItems);
      } catch (err) {
        console.error(err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const removeAuction = (auctionId: number) => {
    setOngoing(items => items.filter(item => item.id !== auctionId));
    setCompleted(items => items.filter(item => item.id !== auctionId));
  };

  return { ongoing, completed, loading, error, removeAuction };
};
