import defaultProfileImage from "@/assets/images/profile/default-profile.png";
import { useImageUpload } from "@/hooks/auction/useImageUploadApi";
import { useAuthApi } from "@/hooks/auth/useAuthApi";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const AdditionalInfoPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [imageError, setImageError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const { putUserProfileMutation } = useAuthApi();
  const { uploadImages, loading: isImageUploading } = useImageUpload();

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const trimmedNickname = nickname.trim();
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 10;
  const isSubmitting = isImageUploading || putUserProfileMutation.isPending;

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageError("");
    setSubmitError("");

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError("JPG, PNG, WEBP 형식의 이미지만 선택할 수 있어요.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setImageError("이미지 크기는 5MB 이하여야 해요.");
      event.target.value = "";
      return;
    }

    if (previewImage) URL.revokeObjectURL(previewImage);
    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUseDefaultImage = () => {
    if (previewImage) URL.revokeObjectURL(previewImage);
    setSelectedImage(null);
    setPreviewImage("");
    setImageError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getDefaultImageFile = async () => {
    const response = await fetch(defaultProfileImage);
    const blob = await response.blob();
    return new File([blob], "default-profile.png", { type: "image/png" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isNicknameValid || isSubmitting) return;

    setSubmitError("");

    try {
      const profileFile = selectedImage ?? (await getDefaultImageFile());
      const uploadedUrls = await uploadImages([profileFile]);
      const profileImageUrl = uploadedUrls[0];

      if (!profileImageUrl) {
        setSubmitError(
          "프로필 이미지를 저장하지 못했어요. 다시 시도해 주세요."
        );
        return;
      }

      putUserProfileMutation.mutate(
        { nickname: trimmedNickname, profileImageUrl },
        {
          onSuccess: () => navigate("/", { replace: true }),
          onError: () =>
            setSubmitError(
              "프로필 설정에 실패했어요. 잠시 후 다시 시도해 주세요."
            ),
        }
      );
    } catch {
      setSubmitError("프로필 이미지를 저장하지 못했어요. 다시 시도해 주세요.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-4 my-8 flex flex-col">
      <h2 className="mb-8 text-bold20 text-bluegrey10">
        프로필을 설정해 가입을 완료하세요.
      </h2>

      <p className="mb-3 text-med16 text-bluegrey10">프로필 이미지</p>
      <div className="mb-8 flex flex-col items-center">
        <img
          src={previewImage || defaultProfileImage}
          alt={selectedImage ? "선택한 프로필 이미지" : "기본 프로필 이미지"}
          className="h-24 w-24 rounded-full border-2 border-grey04 object-cover"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="hidden"
        />

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-grey09 px-4 py-2 text-reg14 text-bluegrey10"
          >
            사진 추가
          </button>
          {selectedImage && (
            <button
              type="button"
              onClick={handleUseDefaultImage}
              className="rounded-lg border border-grey09 px-4 py-2 text-reg14 text-bluegrey10"
            >
              기본 이미지 사용
            </button>
          )}
        </div>

        <p className="mt-2 text-reg12 text-darkgrey01">
          사진을 추가하지 않으면 기본 이미지로 설정돼요.
        </p>
        <p className="mt-1 text-reg12 text-darkgrey01">
          JPG, PNG, WEBP · 최대 5MB
        </p>
        {imageError && (
          <p role="alert" className="mt-2 text-reg12 text-red-500">
            {imageError}
          </p>
        )}
      </div>

      <label htmlFor="nickname" className="mb-4 text-med16 text-bluegrey10">
        닉네임을 설정하세요.
      </label>
      <input
        id="nickname"
        type="text"
        value={nickname}
        maxLength={10}
        onChange={event => setNickname(event.target.value)}
        placeholder="닉네임을 입력하세요"
        className="mb-2 w-full rounded-xl border border-grey09 px-4 py-3 text-reg16 text-bluegrey10 focus:border-mainpink focus:outline-none"
      />

      <div className="flex justify-between text-reg14">
        <p className={isNicknameValid ? "text-darkgrey01" : "text-red-500"}>
          2~10자 이내로 입력해 주세요.
        </p>
        <span className="text-darkgrey01">{nickname.length}/10</span>
      </div>

      {submitError && (
        <p role="alert" className="mt-4 text-reg14 text-red-500">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={!isNicknameValid || isSubmitting}
        className="mt-6 w-full cursor-pointer rounded-xl bg-mainpink py-4 text-med16 text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-grey05"
      >
        {isSubmitting ? "설정 중…" : "완료"}
      </button>
    </form>
  );
};

export default AdditionalInfoPage;
