import { ChevronLeft } from "@/assets/svgs/common";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  opponentName: string;
  goodsName: string;
  imageUrl: string;
  isTransactionCompleted: boolean;
}

const Header = ({
  opponentName,
  goodsName,
  imageUrl,
  isTransactionCompleted,
}: HeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="sticky top-0 bg-white">
      <div className="flex items-center justify-center h-12 px-2 py-3 border-b border-grey04">
        <button
          onClick={handleBack}
          className="absolute left-2 flex items-center justify-center cursor-pointer"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
        <h1 className="text-med18 text-darkgrey02">{opponentName}</h1>
      </div>

      <div className="flex items-center gap-3 p-4 border-b border-grey04">
        <img
          src={imageUrl}
          alt={goodsName}
          className="w-12 h-12 rounded-lg bg-bluegrey02"
        />

        <div className="flex flex-col flex-1">
          <h3 className="text-med14 text-darkgrey04">{goodsName}</h3>
          <p className="text-reg12 text-bluegrey08">경매가 종료되었습니다</p>
        </div>

        <div className="flex flex-col gap-1 items-center justify-center">
          <div className="px-2 py-1 rounded-full text-med13 text-mainpink bg-lightpink">
            낙찰 성공
          </div>
          <p className="text-reg12 text-bluegrey08">
            {isTransactionCompleted ? "결제 완료" : "결제 대기중"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
