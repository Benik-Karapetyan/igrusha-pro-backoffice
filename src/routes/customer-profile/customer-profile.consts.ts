import { z } from "zod";

export const CustomerTabSchema = z
  .union([
    z.literal("compliance"),
    z.literal("finance"),
    z.literal("transactions"),
    z.literal("addresses"),
    z.literal("trading"),
    z.literal("p2pAccount"),
    z.literal("apis"),
    z.literal("auditLog"),
  ])
  .optional();
export const ComplianceTabSchema = z.union([z.literal("overview"), z.literal("ipAddresses")]).optional();
export const FinanceTabSchema = z.union([z.literal("overview"), z.literal("fees")]).optional();
export const AddressesTabSchema = z.union([z.literal("deposit"), z.literal("withdrawal")]).optional();
export const TradingTabSchema = z.union([z.literal("orderHistory"), z.literal("tradingHistory")]).optional();
export const AuditLogTabSchema = z.union([z.literal("blocked"), z.literal("deactivated")]).optional();

export type TCustomerTabValue = z.infer<typeof CustomerTabSchema>;
export type TComplianceTabValue = z.infer<typeof ComplianceTabSchema>;
export type TFinanceTabValue = z.infer<typeof FinanceTabSchema>;
export type TAddressesTabValue = z.infer<typeof AddressesTabSchema>;
export type TTradingTabValue = z.infer<typeof TradingTabSchema>;
export type TAuditLogTabValue = z.infer<typeof AuditLogTabSchema>;
