import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AlertRuleStatusDialog } from "@containers";
import { api } from "@services";
import { IAlertRule } from "@types";
import { Autocomplete, Icon, ProgressCircular, TextField, Typography } from "@ui-kit";
import { searchIcon } from "@utils";
import { debounce, groupBy } from "lodash";

import { RuleCards } from "./rule-cards";

export const Settings = () => {
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState<IAlertRule[]>([]);
  const [selectedRule, setSelectedRule] = useState<IAlertRule | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedRuleWorkflowNames, setSelectedRuleWorkflowNames] = useState<string[]>([]);
  const groupedRules = useMemo(
    () =>
      selectedRuleWorkflowNames.length
        ? Object.fromEntries(
            Object.entries(groupBy(rules, "workflowName")).filter(([key]) => selectedRuleWorkflowNames.includes(key))
          )
        : groupBy(rules, "workflowName"),
    [rules, selectedRuleWorkflowNames]
  );
  const workflowsList = useMemo(
    () => Object.keys(groupBy(rules, "workflowName")).map((workflowName) => ({ name: workflowName, id: workflowName })),
    [rules]
  );

  const debouncedSearchTermChange = useRef(
    debounce((searchTerm: string) => {
      setSearchTerm(searchTerm);
      canFetch.current = true;
    }, 500)
  ).current;

  const handleSearchChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(value);
    debouncedSearchTermChange(value);
  };

  const getRules = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/rules/api/rules`, {
        params: { name: searchTerm },
      });
      setRules(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getRules();
    }
  }, [getRules]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="w-[240px]">
          <TextField
            value={searchValue}
            placeholder="Search by Rule Name"
            hideDetails
            prependInner={<Icon name={searchIcon} className="mr-2" />}
            onChange={handleSearchChange}
          />
        </div>

        <div className="w-[240px]">
          <Autocomplete
            selectedItems={selectedRuleWorkflowNames}
            placeholder="All Rules"
            hasSearch={false}
            items={workflowsList}
            onChange={(items) => setSelectedRuleWorkflowNames(items)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-[400px] items-center justify-center text-primary">
          <ProgressCircular indeterminate />
        </div>
      ) : Object.keys(groupedRules).length ? (
        <RuleCards groupedRules={groupedRules} onStatusChange={setSelectedRule} onSuccess={getRules} />
      ) : (
        <Typography
          variant="body-lg"
          color="secondary"
          className="flex h-[400px] flex-col items-center justify-center gap-3 py-5 font-normal"
        >
          No Data Available
        </Typography>
      )}

      <AlertRuleStatusDialog
        open={!!selectedRule}
        onOpenChange={() => setSelectedRule(null)}
        selectedRule={selectedRule}
        onSuccess={() => {
          setSelectedRule(null);
          void getRules();
        }}
      />
    </div>
  );
};
