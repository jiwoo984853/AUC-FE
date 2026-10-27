import { Goback } from "@/assets/svgs/search";
import Footer from "@/components/common/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuctionDeliverySection from "@/components/my/newAuctionForm/AuctionDeliverySection";
import AuctionDropdown from "@/components/my/newAuctionForm/AuctionDropdown";
import AuctionImageUploader from "@/components/my/newAuctionForm/AuctionImageUploader";
import AuctionTimeSection from "@/components/my/newAuctionForm/AuctionTimeSection";
import { useCategoriesApi } from "@/hooks/category/useCategoriesApi";
import {
  conditionMap,
  conditions,
  deliveryMethods,
  durations,
} from "@/constants/newAuction";

import { Check } from "@/assets/svgs/common";
import { Warning } from "@/assets/svgs/my";

import { useCreateAuction } from "@/hooks/auction/useCreateAuctionApi";
import { useImageUpload } from "@/hooks/auction/useImageUploadApi";

import { CreateAuctionRequest } from "@/types/auction/auctionApi.type";

const formatEndAt = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  const ms = String(date.getMilliseconds()).padStart(3, "0") + "000";

  return `${year}-${month}-${day}T${hour}:${minute}:${second}.${ms}`;
};

const NewAuctionPage = () => {
  const navigate = useNavigate();

  const { uploadImages } = useImageUpload();
  const { submitAuction } = useCreateAuction();
  const { data: categoryOptions = [], isError: isCategoryError } =
    useCategoriesApi();

  const [images, setImages] = useState<(File | null)[]>([null, null, null]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");

  const [year, setYear] = useState("");
  const [location, setLocation] = useState("");

  const [duration, setDuration] = useState("12시간");
  const [hideBid, setHideBid] = useState(false);
  const [delivery, setDelivery] = useState("직거래");

  const [deliveryCharge, setDeliveryCharge] = useState<"판매자" | "구매자">(
    "판매자"
  );

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const openAlert = (message: string, success: boolean) => {
    setAlertMessage(message);
    setIsSuccess(success);
    setAlertOpen(true);
  };

  const handleAlertConfirm = () => {
    setAlertOpen(false);
    if (isSuccess) navigate("/my");
  };

  // 경매 종료 시간 계산
  const calculateEndAt = () => {
    const now = new Date();
    const end = new Date(now);

    if (duration === "12시간") {
      end.setHours(end.getHours() + 12);
      return formatEndAt(end);
    }

    if (duration === "24시간") {
      end.setHours(end.getHours() + 24);
      return formatEndAt(end);
    }

    const target = duration;

    const dayMatch = target.match(/(\d+)일/);
    const hourMatch = target.match(/(\d+)시간/);
    const minuteMatch = target.match(/(\d+)분/);

    const d = Number(dayMatch?.[1] ?? 0);
    const h = Number(hourMatch?.[1] ?? 0);
    const m = Number(minuteMatch?.[1] ?? 0);

    end.setDate(end.getDate() + d);
    end.setHours(end.getHours() + h);
    end.setMinutes(end.getMinutes() + m);

    return formatEndAt(end);
  };

  const handleSubmit = async () => {
    if (!title || !category || !condition || !year || !location) {
      openAlert("내용을 모두 입력해주세요.", false);
      return;
    }

    const selectedCategory = categoryOptions.find(
      item => item.categoryName === category
    );
    if (!selectedCategory) {
      openAlert("유효한 카테고리를 선택해주세요.", false);
      return;
    }

    const fileList = images.filter((f): f is File => f !== null);
    if (fileList.length === 0) {
      openAlert("최소 1장의 이미지를 등록해주세요.", false);
      return;
    }

    try {
      const uploadedUrls = await uploadImages(fileList);

      const body: CreateAuctionRequest = {
        goodsName: title,
        description: description,
        startPrice: 1000,
        startAt: new Date().toISOString(),
        endAt: calculateEndAt(),
        condition: conditionMap[condition],
        transactionMethod: delivery === "직거래" ? "FACE_TO_FACE" : "DELIVERY",
        manufactureYear: year,
        location: location,
        imageUrls: uploadedUrls,
        categoryIds: [selectedCategory.categoryId],
        hideBidPrice: hideBid,
      };

      await submitAuction(body);

      openAlert("새 경매 등록이 완료되었습니다!", true);
    } catch {
      openAlert("등록 중 오류가 발생했습니다.", false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 overflow-y-auto pb-20">
        {/* 헤더 */}
        <div className="flex items-center gap-2 mt-5 ml-5 mb-4">
          <Goback
            className="w-5 h-5 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h1 className="text-med18 ml-24 text-bluegrey10">새 경매 등록</h1>
        </div>

        {/* 본문 영역 */}
        <div className="p-4">
          <div className="bg-white rounded-[8px] py-[16px] -mt-4">
            {/* 이미지 업로더 */}
            <AuctionImageUploader images={images} setImages={setImages} />

            <p className="text-bluegrey08 text-reg12 -mt-2 mb-4 ml-1">
              최대 10장까지 등록 가능합니다
            </p>

            <div className="w-[375px] h-px bg-bluegrey02 my-4 -mx-4"></div>

            {/* 물품명 */}
            <label className="block text-med16 text-bluegrey10 mb-2">
              물품명
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="물품명을 입력하세요"
              className="w-full border text-reg16 border-bluegrey03 rounded-[8px] p-3 mb-4 outline-none"
            />

            {/* 설명 */}
            <label className="block text-med16 text-bluegrey10 mb-2">
              설명 작성
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value.slice(0, 200))}
              placeholder="기본 성능, 구성품 등 상세한 설명을 작성해주세요."
              maxLength={200}
              className="w-full border text-reg16 border-bluegrey03 rounded-[8px] p-3 mb-1 h-28 resize-none outline-none"
            />
            <div className="text-right text-bluegrey08 text-reg12 mb-4">
              {description.length}/200
            </div>

            <div className="w-[375px] h-px bg-bluegrey02 my-4 -mx-4"></div>

            {/* 카테고리, 상태 */}
            <AuctionDropdown
              label="카테고리"
              value={category}
              onChange={setCategory}
              options={categoryOptions.map(item => item.categoryName)}
            />
            {isCategoryError && (
              <p className="-mt-3 mb-4 text-reg12 text-red-500">
                카테고리 목록을 불러오지 못했습니다.
              </p>
            )}
            <AuctionDropdown
              label="상태"
              value={condition}
              onChange={setCondition}
              options={conditions}
            />

            {/* 연식 / 위치 */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-med16 text-bluegrey10 mb-2">
                  연식
                </label>
                <input
                  value={year}
                  onChange={e => setYear(e.target.value.replace(/[^0-9]/g, ""))}
                  maxLength={4}
                  inputMode="numeric"
                  placeholder="예: 2023"
                  className="w-full border text-reg16 border-bluegrey03 rounded-[8px] p-3 outline-none"
                />
              </div>

              <div className="flex-1">
                <label className="block text-med16 text-bluegrey10 mb-2">
                  위치
                </label>
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="예: 서울시 강남구"
                  className="w-full border text-reg16 border-bluegrey03 rounded-[8px] p-3 outline-none"
                />
              </div>
            </div>

            {/* 경매 시간 */}
            <AuctionTimeSection
              duration={duration}
              onChangeDuration={setDuration}
              options={durations}
              hideBid={hideBid}
              onToggle={setHideBid}
            />

            {/* 배송방법 */}
            <AuctionDeliverySection
              delivery={delivery}
              onChangeDelivery={setDelivery}
              options={deliveryMethods}
            />

            {/* 배송비 부담 */}
            {delivery === "택배" && (
              <div className="mt-4">
                <label className="block text-med16 text-bluegrey10 mb-2">
                  배송비 부담
                </label>

                <div className="flex gap-3">
                  <button
                    onClick={() => setDeliveryCharge("판매자")}
                    className={`flex-1 py-3 rounded-[8px] border text-center text-med14 cursor-pointer ${
                      deliveryCharge === "판매자"
                        ? "bg-lightpink text-mainpink border-mainpink"
                        : "border-bluegrey02 text-bluegrey09 bg-white"
                    }`}
                  >
                    판매자
                  </button>

                  <button
                    onClick={() => setDeliveryCharge("구매자")}
                    className={`flex-1 py-3 rounded-[8px] border text-center text-med14 cursor-pointer ${
                      deliveryCharge === "구매자"
                        ? "bg-lightpink text-mainpink border-mainpink"
                        : "border-bluegrey02 text-bluegrey09 bg-white"
                    }`}
                  >
                    구매자
                  </button>
                </div>
              </div>
            )}

            <div className="w-[375px] h-px bg-bluegrey02 my-4 -mx-4"></div>

            {/* 주의사항 */}
            <div className="bg-[#FEFCE8] border border-[#FEF08A] text-[#854D0E] p-4 rounded-[8px] mt-6">
              <div className="flex items-center gap-2 mb-2">
                <Warning className="w-[13px] h-[13px]" />
                <span className="text-med14">주의사항</span>
              </div>
              <p className="text-reg14 leading-[20px] ml-5">
                등록한 정보는 수정이 제한됩니다.
                <br />
                위조품·허위 등록 시 계정이 제재됩니다.
              </p>
            </div>

            {/* 제출 버튼 */}
            <button
              onClick={handleSubmit}
              className="w-[343px] bg-mainpink text-white py-3 rounded-[8px] text-med18 cursor-pointer transition mt-6"
            >
              경매 등록하기
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {/* 알림 모달 */}
      {alertOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-[500]">
          <div className="bg-white w-[320px] rounded-xl p-6 text-center shadow-lg">
            <div className="flex justify-center mb-3">
              <Check className="w-10 h-10 text-mainpink" />
            </div>

            <p className="text-med16 text-darkgrey05 mb-4">{alertMessage}</p>

            <button
              onClick={handleAlertConfirm}
              className="w-full bg-mainpink text-white py-2 rounded-lg text-semibold cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewAuctionPage;
