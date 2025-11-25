import { AppSidebar } from "@containers";
import { useStore } from "@store";
import { Outlet } from "@tanstack/react-router";
import { cn } from "@utils";

export const RootLayout = () => {
  const isAppSidebarMini = useStore((s) => s.isAppSidebarMini);

  return (
    <div className="flex py-2">
      <AppSidebar />

      <main
        className={cn(
          "min-h-[calc(100vh_-_1rem)] grow bg-background-alt transition-all duration-200",
          isAppSidebarMini ? "pl-[56px]" : "pl-[300px]"
        )}
      >
        <div className="h-full rounded-l-xl border bg-background-default shadow-[0px_0px_6px_0px_#0E121B29]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
