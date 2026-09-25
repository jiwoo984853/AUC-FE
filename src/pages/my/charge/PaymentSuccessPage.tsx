import { postChargePoint } from "@/apis/my/pointApi";
import { Check } from "@/assets/svgs/common";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { formatPrice } from "@/utils/priceUtils";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [isConfirmed, setIsConfirmed] = useState(false);

  const isProcessing = useRef(false);

  const paymentKey = params.get("paymentKey");
  const orderId = params.get("orderId");
  const amount = params.get("amount");

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentAmount = Number(amount);
      if (
        !paymentKey ||
        !orderId ||
        !amount ||
        !Number.isSafeInteger(paymentAmount) ||
        paymentAmount <= 0
      ) {
        navigate(
          "/payment/fail?message=잘못된 접근입니다.&code=INVALID_PARAMS",
          { replace: true }
        );
        return;
      }
      if (isProcessing.current || isConfirmed) return;

      isProcessing.current = true;

      try {
        await postChargePoint({
          paymentKey,
          orderId,
          amount: paymentAmount,
        });

        setIsConfirmed(true);
      } catch (error) {
        console.error("결제 승인 실패: ", error);

        let errorMessage = "결제 승인 중 오류가 발생했습니다.";
        let errorCode = "UNKNOWN";

        if (error instanceof AxiosError) {
          const errorData = error.response?.data as { error?: string };

          if (errorData?.error) {
            errorMessage = errorData.error;
          }
          if (error.response?.status) {
            errorCode = String(error.response.status);
          }
        }

        navigate(
          `/payment/fail?message=${encodeURIComponent(errorMessage)}&code=${errorCode}`,
          { replace: true }
        );
      }
    };

    confirmPayment();
  }, [paymentKey, orderId, amount, navigate]);

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  const handleGoHistory = () => {
    navigate("/my/points", { replace: true });
  };

  if (!isConfirmed) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-5">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-lightpink">
        <Check className="h-12 w-12 text-mainpink" />
      </div>

      <h1 className="mb-2 text-bold24 text-bluegrey10">결제 성공!</h1>
      <p className="mb-8 text-center text-reg16 text-bluegrey08">
        포인트 충전이 정상적으로 완료되었습니다.
      </p>

      <div className="mb-12 w-full rounded-xl bg-grey01 p-6 text-center">
        <p className="mb-2 text-reg14 text-bluegrey08">충전 금액</p>
        <p className="text-bold24 text-mainpink">
          {formatPrice(Number(amount))}원
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <button
          onClick={handleGoHistory}
          className="w-full rounded-xl bg-mainpink py-4 text-med16 text-white cursor-pointer"
        >
          충전 내역 확인하기
        </button>
        <button
          onClick={handleGoHome}
          className="w-full rounded-xl bg-white border border-grey04 py-4 text-med16 text-bluegrey08 transition hover:bg-grey01 cursor-pointer"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
