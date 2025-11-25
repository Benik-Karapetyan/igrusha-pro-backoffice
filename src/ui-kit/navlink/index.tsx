import { FC } from "react";

import { Link } from "@tanstack/react-router";
import { cn } from "@utils";

import { BaseLink } from "./base-link";
import { MiniLink } from "./mini-link";
import { SubLink } from "./sub-link";

export interface NavLink {
  title: string;
  url: string;
  icon?: string;
}

interface NavLinkProps {
  open?: boolean;
  variant?: "base" | "mini" | "sub";
  link: NavLink;
}

export const NavLink: FC<NavLinkProps> = ({ open, variant = "base", link: { title, url, icon } }) => {
  return (
    <div
      className={cn("relative flex min-h-11 items-center px-4", variant === "mini" ? "px-3" : "px-4", {
        "px-0": variant === "mini",
      })}
    >
      <Link key={title} to={url} className={cn("inline-flex h-8 grow", variant === "mini" && "h-auto text-left")}>
        {({ isActive }) =>
          variant === "mini" ? (
            <MiniLink isActive={isActive} icon={icon} title={title} open={open} />
          ) : variant === "sub" ? (
            <SubLink isActive={isActive} title={title} icon={icon} />
          ) : (
            <BaseLink isActive={isActive} title={title} icon={icon} />
          )
        }
      </Link>
    </div>
  );
};
