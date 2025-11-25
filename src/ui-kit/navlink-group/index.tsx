import { FC, useEffect, useMemo, useState } from "react";

import { useStore } from "@store";
import { useLocation } from "@tanstack/react-router";

import { BaseGroup } from "./base-group";
import { MiniGroup } from "./mini-group";

interface NavLinkGroup {
  group: true;
  title: string;
  icon?: string;
  children: { title: string; url: string }[];
}

interface NavLinkGroupProps {
  link: NavLinkGroup;
}

export const NavLinkGroup: FC<NavLinkGroupProps> = ({ link: { title, icon, children } }) => {
  const { pathname } = useLocation();
  const isAppSidebarMini = useStore((s) => s.isAppSidebarMini);
  const [open, setOpen] = useState(false);
  const isActive = useMemo(() => children.some((child) => pathname.includes(child.url)), [children, pathname]);

  useEffect(() => {
    if (isActive) setOpen(true);
    else setOpen(false);
  }, [isActive]);

  return isAppSidebarMini ? (
    <div onMouseEnter={() => setTimeout(() => setOpen(true), 0)} onMouseLeave={() => setOpen(false)}>
      <MiniGroup open={open} onOpenChange={setOpen} isActive={isActive} title={title} icon={icon} children={children} />
    </div>
  ) : (
    <BaseGroup open={open} onOpenChange={setOpen} isActive={isActive} title={title} icon={icon} children={children} />
  );
};
