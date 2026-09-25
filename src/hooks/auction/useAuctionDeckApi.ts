import { getAuctionDeck } from "@/apis/auction/auctionDeckApi";
import type { DeckAuctionItem } from "@/types/auction/deckApi.type";
import { useCallback, useEffect, useRef, useState } from "react";

export const useAuctionDeck = () => {
  const [deck, setDeck] = useState<DeckAuctionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const deckRef = useRef<DeckAuctionItem[]>([]);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const fetchDeck = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    try {
      setIsLoading(true);
      setError("");
      const res = await getAuctionDeck(deckRef.current.map(item => item.id));
      const seen = new Set(deckRef.current.map(item => item.id));
      const fresh = res.auctions.filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
      if (fresh.length === 0) hasMoreRef.current = false;
      deckRef.current = [...deckRef.current, ...fresh];
      setDeck(deckRef.current);
    } catch (err) {
      console.error(err);
      setError("경매 데이터를 가져오는 중 오류가 발생했습니다.");
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDeck();
  }, [fetchDeck]);

  useEffect(() => {
    if (deck.length <= 3 && !isLoading) void fetchDeck();
  }, [deck.length, isLoading, fetchDeck]);

  const removeTopCard = useCallback(() => {
    deckRef.current = deckRef.current.slice(1);
    setDeck(deckRef.current);
  }, []);

  return { deck, isLoading, error, removeTopCard };
};
