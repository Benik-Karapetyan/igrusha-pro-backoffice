import { FC, FormEvent, useEffect, useMemo, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { TReferralAsset } from "@types";
import {
  Button,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Icon,
  TextField,
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Typography,
} from "@ui-kit";
import { formatScientificToFullNumber, getErrorMessage, searchIcon, warningIcon } from "@utils";
import { isEqual } from "lodash";

import { WithdrawalThresholdsFormSchema, WithdrawalThresholdsFormValues } from "./withdrawal-thresholds-form.consts";

interface WithdrawalThresholdsFormProps {
  initialAssets: TReferralAsset[];
  assets: TReferralAsset[];
  onCancel: () => void;
  onSuccess: () => void;
}

export const WithdrawalThresholdsForm: FC<WithdrawalThresholdsFormProps> = ({
  initialAssets,
  assets,
  onCancel,
  onSuccess,
}) => {
  const toast = useToast();
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.withdrawalThresholds);
  const setDefaultValues = useStore((s) => s.setWithdrawalThresholds);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: WithdrawalThresholdsFormSchema,
    },
    onSubmit: ({ value }) => {
      const assets = initialAssets.map((asset) => ({
        name: asset.coin.symbol,
        assetId: asset.id || null,
        amount: value.assets.find((a) => a.name === asset.coin.symbol)?.amount || 0,
      }));

      createWithdrawalThresholds(assets);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);
  const [searchValue, setSearchValue] = useState("");
  const [items, setItems] = useState<WithdrawalThresholdsFormValues["assets"]>([]);
  const filteredItems = useMemo(() => {
    return searchValue ? items.filter((item) => item.name.toLowerCase().includes(searchValue.toLowerCase())) : items;
  }, [searchValue, items]);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["unsavedChanges"]);
    else onCancel();
  };

  const handleChange = () => {
    setHasUnsavedChanges(!isEqual(defaultValues, form.state.values));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const createWithdrawalThresholds = async (requestData: WithdrawalThresholdsFormValues["assets"]) => {
    try {
      setLoading(true);
      await api.post("/bo/api/thresholds/bulk", requestData);
      toast.success(`Withdrawal thresholds has been successfully added!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assets.length) {
      setItems(assets.map((a) => ({ name: a.coin.symbol, assetId: a.id, amount: a.amount })));
    }
  }, [assets, setDefaultValues]);

  useEffect(() => {
    if (filteredItems.length) {
      setDefaultValues({
        assets: filteredItems.map((a) => ({ name: a.name, assetId: a.id || null, amount: a.amount })),
      });
      form.reset();
    }
  }, [searchValue, filteredItems, form, setDefaultValues]);

  return (
    <form className="h-full" onChange={handleChange} onSubmit={handleSubmit}>
      <Field name="assets" mode="array">
        {({ state: { value } }) => (
          <div>
            <DrawerHeader>
              <DrawerTitle>Min Payout</DrawerTitle>
            </DrawerHeader>

            <div className="border-b px-4 py-3">
              <div className="w-[240px]">
                <TextField
                  value={searchValue}
                  placeholder="Search by Assets"
                  hideDetails
                  prependInner={<Icon name={searchIcon} className="mr-2" />}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>

            <div className="flex h-[calc(100vh_-_11.75rem)] flex-col overflow-auto bg-background-alt p-4">
              <div className="flex min-h-9 items-center rounded-md bg-background-surface text-sm font-semibold text-foreground-secondary">
                <div className="w-1/2 pl-3 pr-2">Assets</div>
                <div className="h-5 w-[1px] bg-stroke-divider" />
                <div className="w-1/2 pl-3 pr-2">Min Payout</div>
              </div>

              {value.map((asset, i) => (
                <div key={i} className="flex items-center border-b border-dashed border-stroke-medium py-[9px]">
                  <Typography variant="body-base" className="w-1/2 pl-2 pr-3">
                    {asset.name}
                  </Typography>

                  <Field name={`assets[${i}].amount`}>
                    {({ name, state: { value, meta }, handleChange }) => (
                      <div className="w-1/2 px-3">
                        <TextField
                          value={formatScientificToFullNumber(value)}
                          name={name}
                          type="number"
                          hideDetails
                          dense
                          errorMessage={meta.errors[0] || ""}
                          appendInner={
                            value === 0 ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Icon name={warningIcon} color="icon-warning" />
                                  </TooltipTrigger>
                                  <TooltipContent side="top" align="end">
                                    <TooltipArrow />
                                    <Typography
                                      variant="body-sm"
                                      color="inverse"
                                      className="max-w-[284px] whitespace-normal"
                                    >
                                      The minimum payout threshold is not set. Please ensure it aligns with the minimum
                                      amount users are allowed to claim from referral rewards.
                                    </Typography>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : null
                          }
                          onChange={({ target: { value } }) => handleChange(value ? +value : "")}
                        />
                      </div>
                    )}
                  </Field>
                </div>
              ))}
            </div>
          </div>
        )}
      </Field>

      <DrawerFooter>
        <Button type="button" variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[60px]" disabled={!canSubmit} loading={loading}>
              Save
            </Button>
          )}
        </Subscribe>
      </DrawerFooter>
    </form>
  );
};
