import { useState } from "react";

import { mdiAccountCircleOutline, mdiDotsVertical, mdiLogout } from "@mdi/js";
import { useStore } from "@store";
import { Link, useNavigate } from "@tanstack/react-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, Icon, Skeleton } from "@ui-kit";
import { cn } from "@utils";

export const UserProfile = () => {
  const navigate = useNavigate();
  const isAppSidebarMini = useStore((s) => s.isAppSidebarMini);
  const auth = useStore((s) => s.auth);
  const { isLoading, user, avatar } = auth;
  const setAuth = useStore((s) => s.setAuth);
  const [open, setOpen] = useState(false);

  const logout = () => {
    setAuth({ isLoading: true, check: false, user: null });
    localStorage.removeItem("accessToken");
    setOpen(false);
    navigate({ to: "/sign-in", reloadDocument: true });
    setAuth({ isLoading: false, check: false, user: null });
  };

  return (
    <div
      className={cn(
        "flex cursor-pointer select-none items-center justify-between rounded-lg py-3",
        isAppSidebarMini ? "flex-col gap-4" : "flex-row gap-2 pl-4 pr-2"
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full">
          {isLoading ? (
            <Skeleton className="h-9 w-9 rounded-full" />
          ) : avatar ? (
            <img src={avatar} alt="avatar" className="block h-full w-full rounded-full object-cover" />
          ) : (
            <Icon name={mdiAccountCircleOutline} size={36} />
          )}
        </div>

        {!isAppSidebarMini && (
          <>
            {isLoading ? (
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-3 w-[50px]" />
              </div>
            ) : (
              <div>
                <div className="flex items-center text-xs">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="flex gap-1 text-xs text-foreground-muted-more">Admin</div>
              </div>
            )}
          </>
        )}
      </div>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="h-6 w-6">
          <Icon name={mdiDotsVertical} />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="flex w-[200px] flex-col gap-1 bg-white py-3">
          <Link to="/profile" className="inline-flex w-full" onClick={() => setOpen(false)}>
            {({ isActive }) => (
              <span
                className={cn(
                  "inline-flex h-full w-full items-center gap-2 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-background",
                  isActive ? "bg-background text-foreground-link" : "text-foreground"
                )}
              >
                <Icon name={mdiAccountCircleOutline} color={isActive ? "current" : "icon-default"} />

                <span>Profile</span>
              </span>
            )}
          </Link>

          <div
            className="flex w-full cursor-pointer gap-2 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-background"
            onClick={logout}
          >
            <Icon name={mdiLogout} />

            <span>Logout</span>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
