import { useCallback, useEffect, useMemo, useState } from "react";

import { AlertApproveRejectForm } from "@forms";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import {
  ENUM_ALERT_CENTER_ON_CHAIN_DECISION_STATUS,
  ENUM_TRANSACTION_ALERTS_DRAWER_MODE,
  IAlertCenterOnChainTransaction,
  ISelectedAlert,
} from "@types";
import { Button, DrawerFooter, DrawerHeader, DrawerTitle, ProgressCircular } from "@ui-kit";
import { getErrorMessage } from "@utils";

import { AlertCenterOnChainDecisionStatusCell } from "..";
import { AppDrawer } from "../../app-drawer";
import { ConfirmDialog } from "../../confirm-dialog";
import { ActionsButton } from "./actions-button";
import { AlertGenerationFailed } from "./alert-generation-failed";
import { AlertInfo } from "./alert-info";

interface TransactionAlertsDrawerProps {
  onSuccess: () => void;
}

export const TransactionAlertsDrawer = ({ onSuccess }: TransactionAlertsDrawerProps) => {
  const toast = useToast();
  const selectedAlertTransactionId = useStore((s) => s.selectedAlertTransactionId);
  const setSelectedAlertTransactionId = useStore((s) => s.setSelectedAlertTransactionId);
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<IAlertCenterOnChainTransaction | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<ISelectedAlert | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [drawerMode, setDrawerMode] = useState<ENUM_TRANSACTION_ALERTS_DRAWER_MODE>(
    ENUM_TRANSACTION_ALERTS_DRAWER_MODE.View
  );
  const drawerTitle = useMemo(() => {
    return drawerMode === ENUM_TRANSACTION_ALERTS_DRAWER_MODE.View
      ? "Transaction Details"
      : drawerMode === ENUM_TRANSACTION_ALERTS_DRAWER_MODE.Approve
        ? "Confirm Approving Transaction"
        : "Confirm Rejecting Transaction";
  }, [drawerMode]);

  const handleClose = () => {
    setSelectedAlertTransactionId(null);
    setSelectedAlert(null);
    setDrawerMode(ENUM_TRANSACTION_ALERTS_DRAWER_MODE.View);
  };

  const getTransaction = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/alerts/api/transactions/${selectedAlertTransactionId}`);

      setTransaction(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedAlertTransactionId]);

  const changeAlertStatus = useCallback(async () => {
    try {
      setStatusLoading(true);

      await api.patch(`/alerts/api/alerts/${selectedAlert?.id}/status`, {
        status: selectedAlert?.status,
      });

      toast.success("Alert status changed successfully");
      setSelectedAlert(null);
      void getTransaction();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setStatusLoading(false);
    }
  }, [selectedAlert, toast, getTransaction]);

  useEffect(() => {
    if (selectedAlertTransactionId) {
      void getTransaction();
    }
  }, [selectedAlertTransactionId, getTransaction]);

  return (
    <AppDrawer open={!!selectedAlertTransactionId} onOpenChange={handleClose}>
      <DrawerHeader>
        <DrawerTitle>{drawerTitle}</DrawerTitle>

        {transaction?.status && drawerMode === ENUM_TRANSACTION_ALERTS_DRAWER_MODE.View && (
          <AlertCenterOnChainDecisionStatusCell status={transaction.status} />
        )}
      </DrawerHeader>

      {drawerMode === ENUM_TRANSACTION_ALERTS_DRAWER_MODE.View ? (
        <>
          <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4">
            {loading ? (
              <div className="flex h-full items-center justify-center text-primary">
                <ProgressCircular indeterminate />
              </div>
            ) : transaction?.alerts.length ? (
              <div className="flex flex-col gap-4">
                {transaction?.alerts.map((alert) => (
                  <AlertInfo key={alert.id} alert={alert} onStatusChange={setSelectedAlert} />
                ))}
              </div>
            ) : (
              <AlertGenerationFailed />
            )}
          </div>

          <DrawerFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Close
            </Button>

            {transaction?.status === ENUM_ALERT_CENTER_ON_CHAIN_DECISION_STATUS.Pending && (
              <ActionsButton
                onApprove={() => setDrawerMode(ENUM_TRANSACTION_ALERTS_DRAWER_MODE.Approve)}
                onReject={() => setDrawerMode(ENUM_TRANSACTION_ALERTS_DRAWER_MODE.Reject)}
              />
            )}
          </DrawerFooter>
        </>
      ) : drawerMode === ENUM_TRANSACTION_ALERTS_DRAWER_MODE.Approve ? (
        <AlertApproveRejectForm
          type="approve"
          transactionId={selectedAlertTransactionId ?? ""}
          onCancel={() => setDrawerMode(ENUM_TRANSACTION_ALERTS_DRAWER_MODE.View)}
          onSuccess={() => {
            onSuccess();
            handleClose();
          }}
        />
      ) : (
        <AlertApproveRejectForm
          type="reject"
          transactionId={selectedAlertTransactionId ?? ""}
          onCancel={() => setDrawerMode(ENUM_TRANSACTION_ALERTS_DRAWER_MODE.View)}
          onSuccess={() => {
            onSuccess();
            handleClose();
          }}
        />
      )}

      <ConfirmDialog
        open={!!selectedAlert}
        title="Change Alert Status"
        text="Are you sure you want to change the alert status?"
        loading={statusLoading}
        onCancel={() => setSelectedAlert(null)}
        onConfirm={changeAlertStatus}
      />
    </AppDrawer>
  );
};
