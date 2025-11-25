import { useStore } from "@store";
import { Link } from "@tanstack/react-router";
import { Button, Icon, NavLink, NavLinkGroup } from "@ui-kit";
import { cn, sidebarMenuIcon } from "@utils";

import { AppModeSwitch } from "../app-mode-switch";
import { UserProfile } from "../user-profile";
import { useNavlinks } from "./useNavlinks";

export const AppSidebar = () => {
  const isAppSidebarMini = useStore((s) => s.isAppSidebarMini);
  const setIsAppSidebarMini = useStore((s) => s.setIsAppSidebarMini);
  const { navLinks } = useNavlinks();

  return (
    <aside
      className={cn(
        "fixed z-50 h-[calc(100vh_-_1rem)] bg-background-subtle transition-all duration-200",
        isAppSidebarMini ? "w-[56px]" : "w-[300px]"
      )}
    >
      <div
        className={cn("flex items-center", isAppSidebarMini ? "justify-center py-4" : "justify-between px-4 py-[7px]")}
      >
        {!isAppSidebarMini && (
          <Link to="/" className="p-2">
            <img src="../../app-logo.svg" alt="app logo" className="h-[26px] w-[98.35px] object-contain" />
          </Link>
        )}

        <Button variant="ghost" size="iconSmall" onClick={() => setIsAppSidebarMini(!isAppSidebarMini)}>
          <Icon name={sidebarMenuIcon} className={cn(isAppSidebarMini && "rotate-180")} />
        </Button>
      </div>

      <AppModeSwitch />

      <div className={cn(!isAppSidebarMini && "px-4 py-3")}>
        <div
          className={cn(
            "flex h-[28px] w-full items-center gap-2 whitespace-nowrap rounded-md bg-primary-light px-2 text-sm",
            isAppSidebarMini ? "justify-center" : "justify-between"
          )}
        >
          {!isAppSidebarMini && <span className="text-foreground-primary">System Currency:</span>}
          <span className="font-semibold text-primary">USD</span>
        </div>
      </div>

      <nav
        className={cn(
          "mt-3 flex flex-col overflow-auto",
          isAppSidebarMini ? "h-[calc(100vh_-_16rem)]" : "h-[calc(100vh_-_15rem)]"
        )}
      >
        {navLinks.map((link) =>
          link.group ? (
            <NavLinkGroup key={link.title} link={link} />
          ) : (
            <NavLink key={link.title} link={link} variant={isAppSidebarMini ? "mini" : "base"} />
          )
        )}
      </nav>

      <UserProfile />
    </aside>
  );
};
