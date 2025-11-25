import { ENUM_ALERT_STATUS, IAlertCenterOnChainAlert, ISelectedAlert } from "@types";
import { Chip, TextCell } from "@ui-kit";
import { startCase } from "lodash";

import { CopyToClipboard } from "../../../copy-to-clipboard";
import { AlertStatusButtonMenu } from "./alert-status-button-menu";

interface AlertInfoProps {
  alert: IAlertCenterOnChainAlert;
  onStatusChange: (alert: ISelectedAlert) => void;
}

export const AlertInfo = ({ alert, onStatusChange }: AlertInfoProps) => {
  return (
    <div className="flex flex-col gap-4 border-b border-dashed pb-4">
      <div className="flex gap-4">
        <TextCell
          title="Alert ID"
          value={alert.id}
          appendInner={<CopyToClipboard text={alert.id} size="iconXSmall" />}
          className="w-[calc(50%_-_0.5rem)]"
        />
        <TextCell
          title="Alert Name"
          value={alert.ruleName}
          hasBorder={false}
          restrictWidth={false}
          className="w-[calc(50%_-_0.5rem)]"
        />
      </div>

      <div className="flex gap-4">
        <TextCell title="Date" value="07.05.2025 14:25:14" restrictWidth={false} className="w-[calc(50%_-_0.5rem)]" />
        <TextCell
          title="Reaction"
          value={alert.reaction}
          hasBorder={false}
          restrictWidth={false}
          className="w-[calc(50%_-_0.5rem)]"
        />
      </div>

      <div className="flex">
        <TextCell
          title="Alert Status"
          value={<Chip title={startCase(alert.status)} size="small" />}
          appendInner={
            alert.status !== ENUM_ALERT_STATUS.Reviewed ? (
              <AlertStatusButtonMenu
                status={alert.status}
                onStatusChange={(status) => onStatusChange({ id: alert.id, status })}
              />
            ) : null
          }
          className="w-[calc(50%_-_0.5rem)]"
        />
      </div>

      <div>
        <TextCell
          title="Rule"
          value={alert.ruleDescription.startsWith("If") ? alert.ruleDescription : `If ${alert.ruleDescription}`}
          hasBorder={false}
          restrictWidth={false}
        />
      </div>
    </div>
  );
};
