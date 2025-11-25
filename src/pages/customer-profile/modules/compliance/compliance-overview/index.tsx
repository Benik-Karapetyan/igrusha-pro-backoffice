import { useCallback, useEffect, useRef, useState } from "react";

import { AppDrawer, ComplianceOverviewCard, ConfirmDialog, CustomerNotes } from "@containers";
import { CustomerRiskLevelForm, CustomerVipLevelForm } from "@forms";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useParams } from "@tanstack/react-router";
import { ProgressCircular } from "@ui-kit";
import { getErrorMessage } from "@utils";

export const ComplianceOverview = () => {
  const toast = useToast();
  const { id } = useParams({ from: "/auth/customers/$id" });
  const [sectionLoading, setSectionLoading] = useState(false);
  const customerComplianceOverview = useStore((s) => s.customerComplianceOverview);
  const setCustomerComplianceOverview = useStore((s) => s.setCustomerComplianceOverview);
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [pepOpen, setPepOpen] = useState(false);
  const [vipLevelOpen, setVipLevelOpen] = useState(false);
  const [riskLevelOpen, setRiskLevelOpen] = useState(false);

  const handlePepStatusChange = async () => {
    try {
      setLoading(true);

      await api.patch(
        `/bo/api/customers/set-pepstatus?id=${id}&isPep=${customerComplianceOverview?.pepStatus === "Yes" ? false : true}`
      );

      if (customerComplianceOverview) {
        setCustomerComplianceOverview({
          ...customerComplianceOverview,
          pepStatus: customerComplianceOverview?.pepStatus === "Yes" ? "No" : "Yes",
        });
      }

      setPepOpen(false);
      toast.success("PEP status has been updated!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getComplianceOverview = useCallback(async () => {
    try {
      setSectionLoading(true);

      const { data } = await api.get(`/bo/api/customers/${id}/overview`);
      setCustomerComplianceOverview(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSectionLoading(false);
    }
  }, [id, setCustomerComplianceOverview]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getComplianceOverview();
    }
  }, [getComplianceOverview]);

  return sectionLoading ? (
    <div className="flex justify-center text-primary">
      <ProgressCircular indeterminate />
    </div>
  ) : (
    <div className="flex flex-col gap-6">
      <ComplianceOverviewCard
        onRiskLevelClick={() => setRiskLevelOpen(true)}
        onVipLevelClick={() => setVipLevelOpen(true)}
        onPepClick={() => setPepOpen(true)}
      />

      <CustomerNotes />

      <AppDrawer open={riskLevelOpen} onOpenChange={setRiskLevelOpen}>
        <CustomerRiskLevelForm
          customerRiskLevel={customerComplianceOverview?.customerRiskLevel || 0}
          onClose={() => setRiskLevelOpen(false)}
          onSuccess={() => {
            setRiskLevelOpen(false);
            getComplianceOverview();
          }}
        />
      </AppDrawer>

      <AppDrawer open={vipLevelOpen} onOpenChange={setVipLevelOpen}>
        <CustomerVipLevelForm
          customerVipLevel={customerComplianceOverview?.vipLevel || ""}
          onClose={() => setVipLevelOpen(false)}
          onSuccess={() => {
            setVipLevelOpen(false);
            getComplianceOverview();
          }}
        />
      </AppDrawer>

      <ConfirmDialog
        open={pepOpen}
        onOpenChange={setPepOpen}
        title="PEP Status Change"
        text="Are you sure you want to change the PEP status?"
        loading={loading}
        onCancel={() => setPepOpen(false)}
        onConfirm={handlePepStatusChange}
      />
    </div>
  );
};
