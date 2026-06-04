import { FC, useEffect, useMemo, useState } from "react";

import { useStore } from "@store";
import { IOrderItem } from "@types";
import { DataTable, TableItem } from "@ui-kit";

import { useOrderItemHeaders } from "./hooks/useOrderItemHeaders";

interface ExpandContentProps {
  items: IOrderItem[];
}

export const ExpandContent: FC<ExpandContentProps> = ({ items }) => {
  const { headers } = useOrderItemHeaders();
  const isAppSidebarMini = useStore((s) => s.isAppSidebarMini);
  const [hasScroll, setHasScroll] = useState(false);
  const mappedItems = items.map((item) => ({ ...(item as unknown as { productId: IOrderItem }).productId, ...item }));

  const maxWidth = useMemo(() => {
    const scrollWidth = hasScroll ? 7 : 0;
    return isAppSidebarMini ? `calc(100vw - ${112 + scrollWidth}px)` : `calc(100vw - ${356 + scrollWidth}px)`;
  }, [isAppSidebarMini, hasScroll]);

  useEffect(() => {
    const checkScroll = () => {
      setHasScroll(document.documentElement.scrollHeight > window.innerHeight);
    };

    checkScroll();

    window.addEventListener("resize", checkScroll);

    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  return (
    <div className="py-5" style={{ maxWidth }}>
      <div className="w-full overflow-hidden rounded-xl border">
        <div className="overflow-auto">
          <DataTable headers={headers} items={mappedItems as unknown as TableItem[]} hideFooter />
        </div>
      </div>
    </div>
  );
};
