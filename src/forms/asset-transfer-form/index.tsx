import { FC, FormEvent, useMemo, useState } from "react";

import { AssetTransferInfoItem } from "@containers";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { useSearch } from "@tanstack/react-router";
import { TAccount } from "@types";
import { Button, Chip, DrawerFooter, DrawerHeader, DrawerTitle, Select, TextField, Typography } from "@ui-kit";
import { formatAmount, formatScientificToFullNumber } from "@utils";
import { isEqual } from "lodash";

import { AssetTransferFormSchema } from "./asset-transfer-form.consts";

interface AssetTransferFormProps {
  accounts: TAccount[];
}

export const AssetTransferForm: FC<AssetTransferFormProps> = ({ accounts }) => {
  const { accountName } = useSearch({ from: "/auth/accounts/$type/$id" });
  const setDrawerOpen = useStore((s) => s.setDrawerOpen);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.assetTransfer);
  const setAssetTransfer = useStore((s) => s.setAssetTransfer);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: AssetTransferFormSchema,
    },
    onSubmit: ({ value }) => {
      if (!notEnoughBalance) {
        setAssetTransfer(value);
        setDrawerOpen(false);
        setDialogs(["confirmTransfer"]);
      }
    },
  });
  const { Field, Subscribe } = form;
  const filteredAccounts = useMemo(
    () => accounts.filter((account: TAccount) => account.type !== form.state.values.from.type),
    [accounts, form.state.values.from.type]
  );

  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const [notEnoughBalance, setNotEnoughBalance] = useState(false);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["unsavedChanges"]);
    else setDrawerOpen(false);
  };

  const handleChange = () => {
    setHasUnsavedChanges(!isEqual(defaultValues, form.state.values));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <form className="h-full" onChange={handleChange} onSubmit={handleSubmit}>
      <DrawerHeader>
        <DrawerTitle>Transfer</DrawerTitle>
      </DrawerHeader>

      <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 p-4">
        <div className="flex flex-col gap-4 border-b border-dashed pb-4">
          <div className="flex gap-4">
            <Field name="asset.name">
              {({ state: { value } }) => (
                <AssetTransferInfoItem
                  label="Token Name"
                  text={
                    <div className="flex items-center gap-2">
                      <img src={`/icons/currencies/${value}.svg`} alt="" className="h-6 w-6" />

                      <Typography variant="heading-3">{value}</Typography>
                    </div>
                  }
                />
              )}
            </Field>

            <Field name="totalBalance">
              {({ state: { value } }) => (
                <AssetTransferInfoItem
                  label="Total Balance"
                  text={`${formatAmount(value.base.amount)} ${value.base.currency}`}
                  subText={`${formatAmount(value.quote.amount)} ${value.quote.currency}`}
                />
              )}
            </Field>
          </div>
        </div>

        <Chip type="title-value" title="From Account:" text={accountName} className="w-full" />

        <Field name="to.type">
          {({ name, state: { value, meta }, handleChange }) => (
            <Select
              value={value}
              name={name}
              label="To"
              placeholder="Type"
              items={filteredAccounts}
              hideDetails
              errorMessage={meta.errors[0] || ""}
              onValueChange={(val) => handleChange(val)}
            />
          )}
        </Field>
        <Field name="amount">
          {({ name, state: { value, meta }, handleChange }) => (
            <TextField
              label="Amount"
              placeholder="Type"
              value={formatScientificToFullNumber(value)}
              name={name}
              type="number"
              hint={form.state.values.asset.name}
              hideDetails
              errorMessage={
                notEnoughBalance ? "You don’t have enough balance to complete this action." : meta.errors[0] || ""
              }
              onChange={({ target: { value } }) => {
                if (+value > form.state.values.totalBalance.base.amount) setNotEnoughBalance(true);
                else setNotEnoughBalance(false);
                handleChange(value ? +value : "");
              }}
            />
          )}
        </Field>
      </div>

      <DrawerFooter>
        <Button type="button" variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[60px]" disabled={!canSubmit}>
              Send
            </Button>
          )}
        </Subscribe>
      </DrawerFooter>
    </form>
  );
};
