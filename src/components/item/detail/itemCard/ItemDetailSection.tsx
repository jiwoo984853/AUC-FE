import { AuctionDetailResponse } from "@/types/item/detail/itemDetailApi.type";

interface AuctionDetailProps {
  item: AuctionDetailResponse;
}

const ItemsDetailSection = ({ item }: AuctionDetailProps) => (
  <section className="border-t border-bluegrey02 pt-4">
    <div className="border-b border-grey02 pb-3">
      <h3 className="text-semibold14 text-bluegrey10 mb-3">상품 설명</h3>
      <p className="text-reg14 text-darkgrey03 mb-4">{item.description}</p>
    </div>

    <div className="grid grid-cols-2 space-y-3 pt-4">
      <div>
        <h5 className="text-reg14 text-bluegrey08">상태</h5>
        <p className="text-med14 text-bluegrey10">{item.condition}</p>
      </div>
      <div>
        <h5 className="text-reg14 text-bluegrey08">카테고리</h5>
        <p className="text-med14 text-bluegrey10">
          {item.categories?.[0]?.categoryName ?? "카테고리 정보 없음"}
        </p>
      </div>
      <div>
        <h5 className="text-reg14 text-bluegrey08">연식</h5>
        <p className="text-med14 text-bluegrey10">{`${item.manufactureYear}년`}</p>
      </div>
      <div>
        <h5 className="text-reg14 text-bluegrey08">위치</h5>
        <p className="text-med14 text-bluegrey10">{item.location}</p>
      </div>
    </div>
  </section>
);

export default ItemsDetailSection;
