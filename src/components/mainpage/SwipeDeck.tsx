import SwipeCard from "@/components/mainpage/SwipeCard";
import BidSheet from "./BidSheet";
import ProductCard from "./ProductCard";

import { useBidApi } from "@/hooks/item/bid/useBidApi";
import { useUserStore } from "@/store/useUserStore";
import type { DeckAuctionItem } from "@/types/auction/deckApi.type";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";

interface SwipeDeckProps {
  items: DeckAuctionItem[];
  onRemoveCard: () => void;
}

export default function SwipeDeck({ items, onRemoveCard }: SwipeDeckProps) {
  const userId = useUserStore(state => state.userId);

  const current = items[0];
  const [price, setPrice] = useState(current ? current.currentPrice : 0);

  const { postSwipMutation, postBidMutation } = useBidApi();
  const { mutate: createBid } = postBidMutation();
  const { mutate: swipeAction } = postSwipMutation();

  const [sheetOpen, setSheetOpen] = useState(false);
  const bidInFlight = useRef(false);

  useEffect(() => {
    if (current) {
      setPrice(current.currentPrice);
    }
  }, [current, setPrice]);

  const openBidSheet = () => {
    if (!current) return;
    setSheetOpen(true);
  };

  const closeBidSheet = () => setSheetOpen(false);

  const removeCard = () => {
    onRemoveCard();
  };

  // 입찰
  const performBid = () => {
    if (bidInFlight.current) return;
    if (!current || !userId) {
      alert("오류가 발생했습니다. 다시 시도해 주세요.");
      return;
    }

    if (price <= current.currentPrice) {
      alert("입찰가는 현재 가격보다 높아야 합니다.");
      return;
    }

    const auctionId = current.id;
    const bidPrice = price;
    bidInFlight.current = true;

    createBid(
      {
        auctionId,
        bidPrice,
      },
      {
        onSuccess: bid => {
          bidInFlight.current = false;
          current.bidPrice = current.currentPrice = bidPrice;
          current.bidPlaced = true;
          setSheetOpen(false);
          swipeAction(
            { auctionId, action: "BIDDING", bidId: bid.bidId },
            { onError: err => console.error("입찰 상태 기록 실패:", err) }
          );
        },
        onError: (err: AxiosError<{ message: string }>) => {
          bidInFlight.current = false;
          alert(err.response?.data.message || "입찰 도중 오류가 발생했습니다.");
        },
      }
    );
  };

  // 보류
  const defer = () => {
    if (!current) return;

    swipeAction(
      {
        auctionId: current.id,
        action: "HOLD",
      },
      {
        onSuccess: () => {
          removeCard();
        },
        onError: () => {
          removeCard();
        },
      }
    );
  };

  // 관심 없음
  const onSwiped = (dir: string) => {
    if (dir === "left" && current) {
      swipeAction(
        { auctionId: current.id, action: "DISLIKE" },
        {
          onSuccess: () => {
            removeCard();
          },
          onError: () => {
            removeCard();
          },
        }
      );
    }
  };

  const visible = items.slice(0, 3);

  return (
    <div className="relative mx-auto h-[640px] w-[360px]">
      {visible.map((product, i) => {
        const depth = i;
        const scale = 1 - depth * 0.06;

        return (
          <div
            key={product.id}
            className="absolute inset-0 flex justify-center items-center"
            style={{
              zIndex: visible.length - i,
              transform: `scale(${scale})`,
            }}
          >
            <SwipeCard
              onSwipe={onSwiped}
              preventSwipe={
                sheetOpen ? ["left", "right"] : ["right", "up", "down"]
              }
            >
              <ProductCard
                product={product}
                onOpenBid={openBidSheet}
                onDefer={defer}
              />
            </SwipeCard>
          </div>
        );
      })}

      {current && (
        <BidSheet
          open={sheetOpen}
          value={price}
          onChange={setPrice}
          onClose={closeBidSheet}
          onConfirm={performBid}
          productTitle={current.title}
          highestBid={current.currentPrice}
        />
      )}
    </div>
  );
}
