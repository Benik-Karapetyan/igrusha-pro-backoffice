import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ActionsMenu, AppHeader, CustomerMainInfoCard } from "@containers";
import { useAppMode, useCheckPermission, useToast } from "@hooks";
import { TCustomerTabValue } from "@routes";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { ENUM_CUSTOMER_STATUS } from "@types";
import { ProgressCircular, Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-kit";
import { getErrorMessage } from "@utils";
import axios from "axios";

import { Addresses } from "./modules/addresses";
import { ApiKeys } from "./modules/api-keys";
import { AuditLog } from "./modules/audit-log";
import { Compliance } from "./modules/compliance";
import { Finance } from "./modules/finance";
import { Trading } from "./modules/trading";
import { Transactions } from "./modules/transactions";

export const CustomerProfilePage = () => {
  const { isWallet } = useAppMode();
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams({ from: "/auth/customers/$id" });
  const { tab } = useSearch({ from: "/auth/customers/$id" });
  const { checkPermission } = useCheckPermission();
  const customerMainInfo = useStore((s) => s.customerMainInfo);
  const setCustomerMainInfo = useStore((s) => s.setCustomerMainInfo);
  const canFetchCustomer = useRef(true);
  const canCheckActiveOrders = useRef(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [ordersCheckLoading, setOrdersCheckLoading] = useState(false);
  const [hasActiveOrders, setHasActiveOrders] = useState(false);

  const showActionsMenu = useMemo(() => {
    return (
      checkPermission("customer_update") &&
      !pageLoading &&
      customerMainInfo?.status !== ENUM_CUSTOMER_STATUS.Banned &&
      customerMainInfo?.status !== ENUM_CUSTOMER_STATUS.Closed &&
      customerMainInfo?.status !== ENUM_CUSTOMER_STATUS.ClosedByAdmin
    );
  }, [pageLoading, customerMainInfo?.status, checkPermission]);

  const handleTabClick = (value: TCustomerTabValue) => {
    navigate({ to: "/customers/$id", params: { id: String(id) }, search: { tab: value } });
  };

  const getCustomerMainInfo = useCallback(async () => {
    try {
      const { data } = isWallet
        ? await axios.get(`${import.meta.env.VITE_WALLET_SERVICE_URL}/customers/${id}/details`)
        : await api.get(`/bo/api/customers/${id}/details`);
      setCustomerMainInfo(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setPageLoading(false);
    }
  }, [id, toast, setCustomerMainInfo, isWallet]);

  const checkActiveOrders = useCallback(async () => {
    try {
      setOrdersCheckLoading(true);
      const { data } = await api.get(`/bo/api/customers/${id}/checkOpenOrders`);
      setHasActiveOrders(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setOrdersCheckLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    canFetchCustomer.current = true;
  }, [isWallet]);

  useEffect(() => {
    if (!checkPermission("customer_read")) {
      navigate({ to: "/" });
    } else {
      if (canFetchCustomer.current) {
        canFetchCustomer.current = false;
        void getCustomerMainInfo();
      }

      if (!isWallet && canCheckActiveOrders.current && customerMainInfo?.status === ENUM_CUSTOMER_STATUS.Active) {
        canCheckActiveOrders.current = false;
        void checkActiveOrders();
      }
    }
  }, [customerMainInfo?.status, checkPermission, navigate, getCustomerMainInfo, checkActiveOrders, isWallet]);

  return (
    <Tabs defaultValue={tab || isWallet ? "transactions" : "compliance"}>
      <AppHeader
        backUrl="/customers"
        title={customerMainInfo?.fullName}
        Tabs={
          <TabsList>
            {isWallet ? (
              <>
                <TabsTrigger value="transactions" onClick={() => handleTabClick("transactions")}>
                  Transactions
                </TabsTrigger>
              </>
            ) : (
              <>
                {checkPermission("customer_profile_compliance_read") && (
                  <TabsTrigger value="compliance" onClick={() => handleTabClick("compliance")}>
                    Compliance
                  </TabsTrigger>
                )}
                {checkPermission("customer_profile_finance_read") && (
                  <TabsTrigger value="finance" className="min-w-[100px]" onClick={() => handleTabClick("finance")}>
                    Finance
                  </TabsTrigger>
                )}
                <TabsTrigger value="transactions" onClick={() => handleTabClick("transactions")}>
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="addresses" onClick={() => handleTabClick("addresses")}>
                  Addresses
                </TabsTrigger>
                <TabsTrigger value="trading" onClick={() => handleTabClick("trading")}>
                  Trading
                </TabsTrigger>
                <TabsTrigger value="p2pAccount" onClick={() => handleTabClick("p2pAccount")}>
                  P2P Account
                </TabsTrigger>
                <TabsTrigger value="apis" onClick={() => handleTabClick("apis")}>
                  API Keys
                </TabsTrigger>
                {checkPermission("customer_profile_audit_log_read") && (
                  <TabsTrigger value="auditLog" onClick={() => handleTabClick("auditLog")}>
                    Audit Log
                  </TabsTrigger>
                )}
              </>
            )}
          </TabsList>
        }
        MainButton={
          showActionsMenu &&
          !isWallet && (
            <ActionsMenu
              ordersCheckLoading={ordersCheckLoading}
              hasActiveOrders={hasActiveOrders}
              onSuccess={getCustomerMainInfo}
            />
          )
        }
      />

      {pageLoading ? (
        <div className="p-4">
          <div className="flex justify-center rounded-xl border bg-background-subtle p-5 text-primary">
            <ProgressCircular indeterminate />
          </div>
        </div>
      ) : customerMainInfo ? (
        <div className="flex flex-col gap-6 p-4">
          <CustomerMainInfoCard customerMainInfo={customerMainInfo} />

          {isWallet ? (
            <>
              <TabsContent value="transactions">
                <Transactions />
              </TabsContent>
            </>
          ) : (
            <>
              {checkPermission("customer_profile_compliance_read") && (
                <TabsContent value="compliance">
                  <Compliance />
                </TabsContent>
              )}

              {checkPermission("customer_profile_finance_read") && (
                <TabsContent value="finance">
                  <Finance />
                </TabsContent>
              )}

              <TabsContent value="transactions">
                <Transactions />
              </TabsContent>

              <TabsContent value="addresses">
                <Addresses />
              </TabsContent>

              <TabsContent value="trading">
                <Trading />
              </TabsContent>

              <TabsContent value="p2pAccount">P2P Account under construction</TabsContent>

              <TabsContent value="apis">
                <ApiKeys identityId={customerMainInfo?.identityId} />
              </TabsContent>

              {checkPermission("customer_profile_audit_log_read") && (
                <TabsContent value="auditLog">
                  <AuditLog />
                </TabsContent>
              )}
            </>
          )}
        </div>
      ) : (
        <div>Error State</div>
      )}
    </Tabs>
  );
};
