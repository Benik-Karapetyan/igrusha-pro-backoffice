import type { FC, HTMLProps } from "react";

import type { Colors } from "@utils";
import { colors } from "@utils";
import clsx from "clsx";

interface IconProps extends HTMLProps<HTMLSpanElement> {
  name: string;
  color?: keyof Colors;
  size?: number;
  dense?: boolean;
  small?: boolean;
  large?: boolean;
  disabled?: boolean;
}

export const Icon: FC<IconProps> = ({
  className,
  name,
  color = "icon-default",
  size,
  dense,
  small,
  large,
  disabled,
  onClick,
}) => {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        className,
        !(small || dense || large) && "text-2xl",
        small && "h-4 w-4 text-base",
        dense && "h-5 w-5 text-xl",
        large && "h-8 w-8 text-[2rem]",
        colors[color],
        "notranslate",
        "inline-flex",
        "justify-center",
        "items-center",
        "leading-none",
        "tracking-normal",
        "align-middle",
        "select-none",
        disabled && "pointer-events-none opacity-50"
      )}
      style={{
        fontFeatureSettings: '"liga"',
        fontSize: size && size + "px",
        width: size && size + "px",
        height: size && size + "px",
      }}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        role="img"
        aria-hidden="true"
        className={clsx(
          "fill-current",
          !(small || dense || large) && "h-6 w-6",
          small && "h-4 w-4 text-base",
          dense && "h-5 w-5 text-xl",
          large && "h-8 w-8 text-[2rem]"
        )}
        style={{
          fontSize: size && size + "px",
          width: size && size + "px",
          height: size && size + "px",
        }}
      >
        <path d={name}></path>
      </svg>
    </span>
  );
};
