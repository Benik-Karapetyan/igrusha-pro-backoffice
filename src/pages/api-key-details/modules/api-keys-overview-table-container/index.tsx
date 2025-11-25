import { FC, PropsWithChildren, useEffect, useMemo, useState } from "react";

import { useStore } from "@store";

export const ApiKeysOverViewTableContainer: FC<PropsWithChildren> = ({ children }) => {
  const isAppSidebarMini = useStore((s) => s.isAppSidebarMini);
  const [hasScroll, setHasScroll] = useState(false);

  const maxWidth = useMemo(() => {
    const scrollWidth = hasScroll ? 7 : 0;
    return isAppSidebarMini ? `calc(100vw - ${56 + scrollWidth}px)` : `calc(100vw - ${302 + scrollWidth}px)`;
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
    <div style={{ maxWidth }}>
      <div className="w-full overflow-hidden rounded-t-md">{children}</div>
    </div>
  );
};
