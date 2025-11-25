import { AlertRuleCard } from "@containers";
import { IAlertRule } from "@types";
import { Typography } from "@ui-kit";

interface RuleCardsProps {
  groupedRules: Record<string, IAlertRule[]>;
  onStatusChange: (rule: IAlertRule) => void;
  onSuccess: () => void;
}

export const RuleCards = ({ groupedRules, onStatusChange, onSuccess }: RuleCardsProps) => {
  return (
    <div className="flex flex-col gap-4">
      {Object.keys(groupedRules).map((workflowName) => (
        <div key={workflowName} className="flex flex-col gap-4">
          <Typography variant="heading-4" color="secondary">
            {workflowName}
          </Typography>

          {groupedRules[workflowName].map((rule) => (
            <AlertRuleCard key={rule.id} rule={rule} onStatusChange={onStatusChange} onSuccess={onSuccess} />
          ))}
        </div>
      ))}
    </div>
  );
};
