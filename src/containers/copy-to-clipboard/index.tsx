import { FC, useState } from "react";

import { useToast } from "@hooks";
import { mdiCheckBold } from "@mdi/js";
import { Button, Icon } from "@ui-kit";
import { cn, Colors, copyIcon } from "@utils";

interface CopyToClipboardProps {
  text: string;
  size?: "icon" | "iconSmall" | "iconXSmall";
  iconColor?: keyof Colors;
  iconSize?: number;
}

export const CopyToClipboard: FC<CopyToClipboardProps> = ({ text, size = "icon", iconColor, iconSize }) => {
  const toast = useToast();
  const [toastOpen, setToastOpen] = useState(false);

  const copyToClipboard = () => {
    if (toastOpen) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setToastOpen(true);
        toast.success(`Copied to clipboard: ${text}`);
        setTimeout(() => setToastOpen(false), 4000);
      })
      .catch((err) => {
        toast.error(`Failed to copy: ${err}`);
      });
  };

  return (
    <Button variant="ghost" size={size} onClick={copyToClipboard}>
      <Icon
        name={toastOpen ? mdiCheckBold : copyIcon}
        color={toastOpen ? "icon-success" : iconColor}
        className={cn(!toastOpen && "cursor-pointer")}
        size={iconSize}
      >
        Copy to clipboard
      </Icon>
    </Button>
  );
};
