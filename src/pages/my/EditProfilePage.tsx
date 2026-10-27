import defaultProfileImage from "@/assets/images/profile/default-profile.png";
import Header from "@/components/common/Header";
import { useImageUpload } from "@/hooks/auction/useImageUploadApi";
import { useAuthApi } from "@/hooks/auth/useAuthApi";
import { useUserStore } from "@/store/useUserStore";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const EditProfilePage = () => {
  const navigate = useNavigate();
  const userName = useUserStore(state => state.userName);
  const userImage = useUserStore(state => state.userImage);
  const [nickname, setNickname] = useState(userName ?? "");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const [imageError, setImageError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getUserProfileMutation, putUserProfileMutation } = useAuthApi();
  const { uploadImages, loading: isImageUploading } = useImageUpload();

  useEffect(() => {
    if (!userName) {
      getUserProfileMutation.mutate();
    }
  }, []);

  useEffect(() => {
    if (userName) setNickname(userName);
  }, [userName]);

  useEffect(() => {
    setImageFailed(false);
  }, [userImage]);

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const trimmedNickname = nickname.trim();
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 10;
  const hasChanged = trimmedNickname !== userName || selectedImage !== null;
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
    setImageFailed(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isNicknameValid || !hasChanged || isSubmitting) {
      return;
    }

    setSubmitError("");

    let profileImageUrl: string | undefined;

    if (selectedImage) {
      try {
        const uploadedUrls = await uploadImages([selectedImage]);
        profileImageUrl = uploadedUrls[0];

        if (!profileImageUrl) {
          setSubmitError("이미지를 업로드하지 못했어요. 다시 시도해 주세요.");
          return;
        }
      } catch {
        setSubmitError("이미지를 업로드하지 못했어요. 다시 시도해 주세요.");
        return;
      }
    }

    putUserProfileMutation.mutate(
      {
        nickname: trimmedNickname,
        ...(profileImageUrl && { profileImageUrl }),
      },
      {
        onSuccess: () => navigate("/my", { replace: true }),
        onError: () =>
          setSubmitError(
            "정보를 수정하지 못했어요. 잠시 후 다시 시도해 주세요."
          ),
      }
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="내 정보 수정" />

      <form onSubmit={handleSubmit} className="flex flex-col px-6 py-8">
        <div className="mb-8 flex flex-col items-center">
          <img
            src={
              previewImage ||
              (imageFailed || !userImage ? defaultProfileImage : userImage)
            }
            alt="프로필"
            onError={() => setImageFailed(true)}
            className="h-24 w-24 rounded-full border-2 border-grey04 object-cover"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 rounded-lg border border-grey09 px-4 py-2 text-reg14 text-bluegrey10"
          >
            사진 변경
          </button>
          <p className="mt-2 text-xs text-gray-500">
            JPG, PNG, WEBP · 최대 5MB
          </p>
          {imageError && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {imageError}
            </p>
          )}
        </div>

        <label htmlFor="nickname" className="mb-2 text-med16 text-bluegrey10">
          닉네임
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          maxLength={10}
          onChange={event => setNickname(event.target.value)}
          className="rounded-xl border border-grey09 px-4 py-3 text-reg16 text-bluegrey10 focus:border-mainpink focus:outline-none"
          placeholder="닉네임을 입력하세요"
        />
        <div className="mt-2 flex justify-between text-sm">
          <p className={isNicknameValid ? "text-gray-500" : "text-red-500"}>
            2~10자 이내로 입력해 주세요.
          </p>
          <span className="text-gray-400">{nickname.length}/10</span>
        </div>

        {submitError && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={!isNicknameValid || !hasChanged || isSubmitting}
          className="mt-10 rounded-xl bg-mainpink py-4 text-med16 text-white disabled:cursor-not-allowed disabled:bg-grey05"
        >
          {isSubmitting ? "수정 중…" : "수정 완료"}
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;
