import { useMemo } from "react";

import { mdiAccountBoxOutline, mdiArchiveOutline, mdiPackageVariantClosed } from "@mdi/js";

type NavLinkItem =
  | {
      group: false;
      title: string;
      url: string;
      icon: string;
    }
  | { group: true; title: string; icon: string; children: { title: string; url: string }[] };

export const useNavlinks = () => {
  const navLinks = useMemo(() => {
    const allNavLinks: NavLinkItem[] = [
      {
        group: false,
        title: "Users",
        url: "/users",
        icon: mdiAccountBoxOutline,
      },
      {
        group: false,
        title: "Products",
        url: "/products",
        icon: mdiArchiveOutline,
      },
      {
        group: false,
        title: "Orders",
        url: "/orders",
        icon: mdiPackageVariantClosed,
      },
    ];

    return allNavLinks;
  }, []);

  return {
    navLinks,
  };
};
