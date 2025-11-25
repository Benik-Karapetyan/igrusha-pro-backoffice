import { useMemo, useState } from "react";

import { AlertRuleForm } from "@forms";
import { IAlertRule } from "@types";
import { Button, Icon, Switch, Typography } from "@ui-kit";
import { editIcon, getTimeDuration } from "@utils";

interface AlertRuleCardProps {
  rule: IAlertRule;
  onStatusChange: (rule: IAlertRule) => void;
  onSuccess: () => void;
}

export const AlertRuleCard = ({ rule, onStatusChange, onSuccess }: AlertRuleCardProps) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  const ruleDescription = useMemo(() => {
    const descriptionArray = rule.description?.split(" ");
    const withinWordIndex = descriptionArray.indexOf("within");

    if (withinWordIndex !== -1) {
      const result = getTimeDuration(descriptionArray[withinWordIndex + 1].slice(0, 8));

      descriptionArray[withinWordIndex + 1] = result;
    }

    const description = descriptionArray.join(" ");

    return description?.startsWith("If") ? description : `If ${description}`;
  }, [rule.description]);

  return mode === "view" ? (
    <div className="flex flex-col gap-4 rounded-xl border bg-background-subtle p-3">
      <div className="flex items-center justify-between">
        <Typography variant="heading-4">{rule.name}</Typography>

        <div className="flex items-center gap-4">
          <Switch checked={rule.enabled} onCheckedChange={() => onStatusChange(rule)} />

          <Button variant="outline" size="iconXSmall" onClick={() => setMode("edit")}>
            <Icon name={editIcon} size={18} />
          </Button>
        </div>
      </div>

      <ul className="list-disc pl-5">
        <li>
          <Typography>{ruleDescription}</Typography>
        </li>
      </ul>
    </div>
  ) : (
    <AlertRuleForm rule={rule} onCancel={() => setMode("view")} onSuccess={onSuccess} />
  );
};
