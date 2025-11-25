import { ChangeEvent, FC, useEffect, useRef, useState } from "react";

import { mdiAccount } from "@mdi/js";
import { Icon } from "@ui-kit";
import { cn } from "@utils";

interface UserAvatarProps {
  readOnly: boolean;
  avatar?: string;
  onFileUpload: (value: FormData) => void;
}

export const UserAvatar: FC<UserAvatarProps> = ({ readOnly, avatar, onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState("");

  const handleFileChange = async ({ target: { files } }: ChangeEvent<HTMLInputElement>) => {
    const file = files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append("file", file);
      onFileUpload(formData);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (readOnly) {
      setImagePreview("");
    }
  }, [readOnly]);

  return (
    <div
      className={cn(
        "flex w-[100px] flex-col items-center gap-1 rounded-lg border p-2",
        readOnly ? "h-[100px]" : "h-[124px]"
      )}
    >
      <div className="flex h-full w-full items-center justify-center rounded-lg border">
        {imagePreview || avatar ? (
          <img
            src={imagePreview || avatar}
            alt=""
            width={80}
            height={80}
            className="block h-[80px] w-[80px] rounded-lg object-cover"
          />
        ) : (
          <Icon name={mdiAccount} size={64} />
        )}
      </div>

      {!readOnly && (
        <>
          <input
            id="upload-avatar"
            ref={fileInputRef}
            type="file"
            accept="image/jpeg, image/png"
            hidden
            onChange={handleFileChange}
          />
          <label
            htmlFor="upload-avatar"
            className="cursor-pointer select-none text-sm font-semibold text-foreground-muted"
          >
            Choose file
          </label>
        </>
      )}
    </div>
  );
};
