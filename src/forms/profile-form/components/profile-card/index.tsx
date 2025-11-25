import { FC } from "react";

import { ProfileFormValues } from "../../profile-form.consts";

interface ProfileCardProps {
  profile: ProfileFormValues;
}

export const ProfileCard: FC<ProfileCardProps> = () => {
  return <div className="flex w-full flex-wrap gap-5"></div>;
};
