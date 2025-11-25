import { FC, ReactNode } from "react";

import { Typography } from "@ui-kit";

interface AssetTransferInfoItemProps {
  label: string;
  text: string | ReactNode;
  subText?: string;
}

export const AssetTransferInfoItem: FC<AssetTransferInfoItemProps> = ({ label, text, subText }) => {
  return (
    <div className="flex w-[calc(50%_-_0.5rem)] flex-col gap-1">
      <Typography variant="body-sm" color="secondary">
        {label}
      </Typography>
      {typeof text === "string" ? <Typography variant="heading-3">{text}</Typography> : text}
      {subText && (
        <Typography variant="body-sm" color="secondary">
          {subText}
        </Typography>
      )}
    </div>
  );
};
