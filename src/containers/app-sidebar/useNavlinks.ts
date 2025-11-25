import { useMemo } from "react";

import { useCheckPermission } from "@hooks";
import {
  mdiAccountBoxOutline,
  mdiAccountCogOutline,
  mdiAccountHardHatOutline,
  mdiAlertDecagram,
  mdiArchiveOutline,
  mdiChartLine,
  mdiEarth,
  mdiFinance,
  mdiMonitorEdit,
  mdiShieldStarOutline,
  mdiWalletOutline,
} from "@mdi/js";
import { useStore } from "@store";
import { feeAndLevelsIcon, financeIcon, marketingIcon } from "@utils";

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
  const { checkPermission } = useCheckPermission();
  const appMode = useStore((s) => s.appMode);
  const isWallet = appMode === "wallet";

  const navLinks = useMemo(() => {
    if (isWallet) {
      return [
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
          ],
        },
        {
          group: true,
          title: "Tx Monitoring",
          icon: mdiMonitorEdit,
          children: [
            {
              title: "Transactions",
              url: "/transactions",
              permissionKey: "DEV",
            },
          ],
        },
      ] as NavLinkItem[];
    }

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
      {
        group: false,
        title: "Regions",
        url: "/regions",
        icon: mdiEarth,
        permissionKey: "regions_read",
      },
      {
        group: true,
        title: "Tx Monitoring",
        icon: mdiMonitorEdit,
        children: [
          {
            title: "Transactions",
            url: "/transactions",
            permissionKey: "DEV",
          },
          {
            title: "Order History",
            url: "/order-history",
            permissionKey: "DEV",
          },
          {
            title: "Trading History",
            url: "/trading-history",
            permissionKey: "DEV",
          },
        ],
      },
      {
        group: true,
        title: "Custody",
        icon: mdiWalletOutline,
        children: [
          {
            title: "Networks",
            url: "/networks",
            permissionKey: "network_read",
          },
          {
            title: "Nodes",
            url: "/nodes",
            permissionKey: "node_read",
          },
          {
            title: "Coins",
            url: "/coins",
            permissionKey: "coin_read",
          },
          {
            title: "Assets",
            url: "/assets",
            permissionKey: "asset_read",
          },
          {
            title: "Withdrawal & Deposit Settings",
            url: "/withdrawal-deposit-settings",
            permissionKey: "withdrawal_deposit_settings_read",
          },
          {
            title: "Vaults",
            url: "/vaults",
            permissionKey: "vault_read",
          },
          {
            title: "Scanners",
            url: "/scanners",
            permissionKey: "scanner_read",
          },
        ],
      },
      {
        group: true,
        title: "Finance & Reporting",
        icon: financeIcon,
        children: [
          {
            title: "Accounts",
            url: "/accounts",
            permissionKey: "DEV",
          },
          {
            title: "Payment History",
            url: "/payment-history",
            permissionKey: "DEV",
          },
          {
            title: "Deposit Analytics",
            url: "/deposit-analytics",
            permissionKey: "DEV",
          },
          {
            title: "Withdrawal Analytics",
            url: "/withdrawal-analytics",
            permissionKey: "DEV",
          },
        ],
      },
      {
        group: true,
        title: "Fees & Levels",
        icon: feeAndLevelsIcon,
        children: [
          {
            title: "Levels",
            url: "/levels",
            permissionKey: "fee_level_read",
          },
          {
            title: "Fee Settings",
            url: "/fee-settings",
            permissionKey: "DEV",
          },
        ],
      },
      {
        group: true,
        title: "P2P Trading",
        icon: mdiFinance,
        children: [
          {
            title: "P2P Offers",
            url: "/peer-to-peer-offers",
            permissionKey: "DEV",
          },
          {
            title: "P2P Orders",
            url: "/peer-to-peer-orders",
            permissionKey: "DEV",
          },
        ],
      },
      {
        group: false,
        title: "KYC Limits",
        url: "/kyc-limits",
        icon: mdiShieldStarOutline,
        permissionKey: "kyc_limits_read",
      },
      {
        group: false,
        title: "Alert Center",
        url: "/alert-center",
        icon: mdiAlertDecagram,
        permissionKey: "DEV",
      },
      {
        group: true,
        title: "Trading Pairs",
        icon: mdiChartLine,
        children: [
          {
            title: "Spot Trading Pairs",
            url: "/spot-trading-pairs",
            permissionKey: "markets_list_read",
          },
          {
            title: "Market Categories",
            url: "/market-categories",
            permissionKey: "market_category_read",
          },
          {
            title: "Market Data Feeds",
            url: "/market-data-feeds",
            permissionKey: "data_feed_read",
          },
        ],
      },
      {
        group: true,
        title: "Providers",
        icon: mdiAccountHardHatOutline,
        children: [
          {
            title: "Sms Providers",
            url: "/sms-providers",
            permissionKey: "sms_provider_read",
          },
        ],
      },
      {
        group: true,
        title: "Marketing",
        icon: marketingIcon,
        children: [
          {
            title: "Referral",
            url: "/referral",
            permissionKey: "DEV",
          },
          {
            title: "Affiliate",
            url: "/affiliate",
            permissionKey: "DEV",
          },
          {
            title: "Trading Contest",
            url: "/trading-contest",
            permissionKey: "DEV",
          },
        ],
      },
      {
        group: true,
        title: "Admins Management",
        icon: mdiAccountCogOutline,
        children: [
          {
            title: "Admin Users",
            url: "/admin-users",
            permissionKey: "admin_user_read",
          },
          {
            title: "Roles",
            url: "/roles",
            permissionKey: "roles_read",
          },
          {
            title: "Permission Sections",
            url: "/permission-sections",
            permissionKey: "permission_sections_read",
          },
          {
            title: "Permissions",
            url: "/permissions",
            permissionKey: "DEV",
          },
          {
            title: "Org Levels",
            url: "/org-levels",
            permissionKey: "org_level_read",
          },
          {
            title: "Brands",
            url: "/brands",
            permissionKey: "brand_read",
          },
        ],
      },
    ];

    return allNavLinks
      .map((link) => {
        if (link.group) {
          const filteredChildren = link.children.filter(
            (child) => child.permissionKey === "DEV" || checkPermission(child.permissionKey)
          );

          return filteredChildren.length ? { ...link, children: filteredChildren } : null;
        }

        return link.permissionKey === "DEV" || checkPermission(link.permissionKey) ? link : null;
      })
      .filter(Boolean) as NavLinkItem[];
  }, [isWallet, checkPermission]);

  return {
    navLinks,
  };
};
