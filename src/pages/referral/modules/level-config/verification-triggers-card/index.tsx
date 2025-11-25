import { useEffect, useState } from "react";

import { AppDrawer } from "@containers";
import { emptyVerificationTriggers, VerificationTriggersForm } from "@forms";
import { mdiMinus } from "@mdi/js";
import { api } from "@services";
import { useStore } from "@store";
import { ENUM_VERIFICATION_TRIGGER_TYPE, TVerificationTrigger } from "@types";
import { Button, Icon, ProgressCircular, Switch, Typography } from "@ui-kit";
import { editIcon, formatAmount } from "@utils";

export const VerificationTriggersCard = () => {
  const [loading, setLoading] = useState(false);
  const [triggers, setTriggers] = useState<TVerificationTrigger[]>([]);
  const verificationTriggers = useStore((s) => s.verificationTriggers);
  const setVerificationTriggers = useStore((s) => s.setVerificationTriggers);

  const getVerificationTriggers = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/verificationTriggerConfiguration/all");
      setTriggers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void getVerificationTriggers();
  }, []);

  return (
    <div className="flex max-w-[353px] grow flex-col gap-6 rounded-xl border bg-background-subtle p-4">
      <div className="flex items-center gap-4">
        <h3 className="grow font-semibold text-foreground-secondary">Verification Triggers</h3>

        <Button variant="ghost" size="iconSmall" onClick={() => setVerificationTriggers({ triggers })}>
          <Icon name={editIcon} />
        </Button>
      </div>

      {loading ? (
        <div className="flex h-full items-center justify-center text-primary">
          <ProgressCircular indeterminate />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {triggers.map((trigger, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="grow text-sm">{trigger.name}</div>

                <Switch checked={trigger.enabled} disabled />
              </div>

              {trigger.type === ENUM_VERIFICATION_TRIGGER_TYPE.Deposit && (
                <div className="flex items-center gap-2">
                  <div className="grow text-sm">Total Deposit Amount</div>

                  {trigger.amount ? (
                    <Typography variant="heading-4">{formatAmount(trigger.amount)} USD</Typography>
                  ) : (
                    <Icon name={mdiMinus} dense className="mr-1" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AppDrawer
        open={!!verificationTriggers.triggers.length}
        onOpenChange={() => setVerificationTriggers(emptyVerificationTriggers)}
      >
        <VerificationTriggersForm
          onCancel={() => setVerificationTriggers(emptyVerificationTriggers)}
          onSuccess={() => {
            setVerificationTriggers(emptyVerificationTriggers);
            void getVerificationTriggers();
          }}
        />
      </AppDrawer>
    </div>
  );
};
