import { useMemo } from "react";

import { mdiAccountBoxOutline, mdiArchiveOutline, mdiFileDocumentMinusOutline, mdiPackageVariantClosed } from "@mdi/js";

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
      {
        group: false,
        title: "Expenses",
        url: "/expenses",
        icon: mdiFileDocumentMinusOutline,
      },
    ];

    return allNavLinks;
  }, []);

  return {
    navLinks,
  };
};
