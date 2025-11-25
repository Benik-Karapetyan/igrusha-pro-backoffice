import { useMemo } from "react";

import { mdiAccountBoxOutline, mdiArchiveOutline } from "@mdi/js";

type NavLinkItem =
  | {
      group: false;
      title: string;
      url: string;
      icon: string;
      permissionKey: string;
    }
  | { group: true; title: string; icon: string; children: { title: string; url: string; permissionKey: string }[] };

export const useNavlinks = () => {
  const navLinks = useMemo(() => {
    const allNavLinks: NavLinkItem[] = [
      {
        group: true,
        title: "Customer Management",
        icon: mdiAccountBoxOutline,
        children: [
          {
            title: "Customers",
            url: "/customers",
            permissionKey: "customer_read",
          },
          {
            title: "API Keys",
            url: "/api-keys",
            permissionKey: "DEV",
          },
        ],
      },
      {
        group: false,
        title: "Products",
        url: "/products",
        icon: mdiArchiveOutline,
        permissionKey: "product_read",
      },
    ];

    return allNavLinks;
  }, []);

  return {
    navLinks,
  };
};
