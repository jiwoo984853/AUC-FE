import defaultProfileImage from "@/assets/images/profile/default-profile.png";
import { useEffect, useState } from "react";

interface ProfileHeaderProps {
  name: string;
  profileImage: string;
}

const ProfileHeader = ({ name, profileImage }: ProfileHeaderProps) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [profileImage]);

  return (
    <div className="mt-6 flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        {imageFailed ? (
          <img
            src={defaultProfileImage}
            alt="기본 프로필"
            className="w-16 h-16 rounded-full border-2 border-grey04 object-cover"
          />
        ) : (
          <img
            src={profileImage}
            alt={`${name} 프로필`}
            onError={() => setImageFailed(true)}
            className="w-16 h-16 rounded-full border-2 border-grey04"
          />
        )}
        <div>
          <p className="text-semibold20 text-darkgrey05">{name}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
