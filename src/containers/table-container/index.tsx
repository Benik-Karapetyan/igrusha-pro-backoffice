import { PropsWithChildren, useEffect, useMemo, useState } from "react";

import { useStore } from "@store";
import { cn } from "@utils";

interface TableContainerProps {
  itemsLength: number;
  className?: string;
}

export const TableContainer = ({ children, itemsLength, className }: PropsWithChildren<TableContainerProps>) => {
  const isAppSidebarMini = useStore((s) => s.isAppSidebarMini);
  const [hasScroll, setHasScroll] = useState(false);

  const maxWidth = useMemo(() => {
    const scrollWidth = hasScroll ? 7 : 0;
    return isAppSidebarMini ? `calc(100vw - ${58 + scrollWidth}px)` : `calc(100vw - ${302 + scrollWidth}px)`;
  }, [isAppSidebarMini, hasScroll]);

  useEffect(() => {
    const checkScroll = () => {
      setHasScroll(document.documentElement.scrollHeight > window.innerHeight);
    };

    checkScroll();

    window.addEventListener("resize", checkScroll);

    return () => window.removeEventListener("resize", checkScroll);
  }, [itemsLength]);

  return (
    <div className="p-4" style={{ maxWidth }}>
      <div className={cn("w-full overflow-hidden rounded-t-md", className)}>{children}</div>
    </div>
  );
};
