import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { authRoute } from "../auth";
import { TransactionsTabSchema } from "../transactions/transactions.consts";
import {
  AddressesTabSchema,
  AuditLogTabSchema,
  ComplianceTabSchema,
  CustomerTabSchema,
  FinanceTabSchema,
  TradingTabSchema,
} from "./customer-profile.consts";

export const customerProfileRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/customers/$id",
  validateSearch: z.object({
    tab: CustomerTabSchema,
    complianceTab: ComplianceTabSchema,
    financeTab: FinanceTabSchema,
    transactionsTab: TransactionsTabSchema,
    addressesTab: AddressesTabSchema,
    tradingTab: TradingTabSchema,
    auditTab: AuditLogTabSchema,
  }),
}).lazy(() => import("./customer-profile.lazy").then((d) => d.Route));
