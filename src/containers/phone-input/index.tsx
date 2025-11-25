import { useMemo, useRef } from "react";
import { PhoneInput as DefaultPhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import { cn } from "@utils";

interface PhoneInputProps {
  value: string;
  name: string;
  defaultCountry?: string;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (val: string, dialCode: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  name,
  defaultCountry,
  label,
  disabled,
  error,
  errorMessage,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasError = useMemo(() => error || !!errorMessage, [error, errorMessage]);

  const handleContainerClick = () => {
    if (containerRef.current) (containerRef.current.children[0] as HTMLInputElement).focus();
  };

  return (
    <div className="flex flex-col gap-1 text-start">
      {label && (
        <label
          htmlFor={label}
          className={cn(
            "cursor-pointer select-none text-sm font-semibold text-foreground-muted",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {label}
        </label>
      )}

      <div className="flex h-[62px] flex-col gap-0">
        <div
          ref={containerRef}
          className={cn(
            "flex h-[46px] w-full cursor-text items-center rounded-xl border bg-background-alt transition-colors focus-within:ring-1",
            disabled && "cursor-not-allowed opacity-50",
            hasError
              ? "border-error focus-within:ring-error"
              : "focus-within:border-button-primary-background focus-within:ring-button-primary-background"
          )}
          onClick={handleContainerClick}
        >
          <DefaultPhoneInput
            key={defaultCountry}
            value={value}
            defaultCountry={defaultCountry}
            onChange={(value, meta) => onChange(value, meta.country.dialCode)}
            className="flex w-full cursor-text items-center rounded-lg px-4"
            inputStyle={{
              width: "100%",
              height: "44px",
              background: "white",
              border: "none",
              fontSize: "0.875rem",
            }}
            inputProps={{
              id: label,
              name,
            }}
            countrySelectorStyleProps={{
              buttonClassName: "border-none",
              dropdownStyleProps: {
                className: "p-1 min-h-[350px] outline-none shadow-md border rounded-xl",
                listItemClassName: "p-3 rounded-lg hover:bg-background",
              },
            }}
          />
        </div>

        {errorMessage && <span className="text-xs text-error">{errorMessage}</span>}
      </div>
    </div>
  );
};
