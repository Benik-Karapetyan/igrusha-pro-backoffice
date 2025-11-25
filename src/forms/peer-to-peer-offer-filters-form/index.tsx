import { FC, FormEvent, useState } from "react";

import { RangePickerDialog } from "@containers";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Autocomplete, Button, DrawerFooter, Icon, Select, TextField } from "@ui-kit";
import { calendarIcon } from "@utils";

import {
  emptyPeerToPeerOfferFilters,
  peerToPeerOfferCryptos,
  peerToPeerOfferFiats,
  PeerToPeerOfferFiltersFormValues,
  peerToPeerOfferPaymentMethods,
  peerToPeerOfferStatuses,
  peerToPeerOfferTypes,
} from "./peer-to-peer-offer-filters-form.consts";

interface PeerToPeerOfferFiltersFormProps {
  filters: PeerToPeerOfferFiltersFormValues;
  onFilter: (value: PeerToPeerOfferFiltersFormValues) => void;
}

export const PeerToPeerOfferFiltersForm: FC<PeerToPeerOfferFiltersFormProps> = ({ filters, onFilter }) => {
  const setDialogs = useStore((s) => s.setDialogs);
  const [defaultValues, setDefaultValues] = useState(filters);
  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => {
      onFilter(value);
      setDialogs([]);
    },
  });
  const { Field } = form;
  const [dateOpen, setDateOpen] = useState(false);

  const handleReset = () => setDefaultValues(emptyPeerToPeerOfferFilters);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <form className="flex h-full flex-col" onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4">
        <Field name="offerStatus">
          {({ state: { value }, handleChange }) => (
            <Autocomplete
              label="Offer Status"
              placeholder="Select"
              selectedItems={value}
              items={peerToPeerOfferStatuses}
              onChange={(value) => handleChange(value)}
            />
          )}
        </Field>

        <Field name="type">
          {({ name, state: { value }, handleChange }) => (
            <Select
              label="Offer Type"
              placeholder="Select"
              name={name}
              value={String(value)}
              items={peerToPeerOfferTypes}
              hideDetails
              onValueChange={(value) => handleChange(value)}
            />
          )}
        </Field>

        <Field name="fiat">
          {({ state: { value }, handleChange }) => (
            <Autocomplete
              label="Fiat"
              placeholder="Select"
              selectedItems={value}
              items={peerToPeerOfferFiats}
              onChange={(value) => handleChange(value)}
            />
          )}
        </Field>

        <Field name="crypto">
          {({ state: { value }, handleChange }) => (
            <Autocomplete
              label="Crypto"
              placeholder="Select"
              selectedItems={value}
              items={peerToPeerOfferCryptos}
              onChange={(value) => handleChange(value)}
            />
          )}
        </Field>

        <Field name="paymentMethod">
          {({ state: { value }, handleChange }) => (
            <Autocomplete
              label="Payment Methods"
              placeholder="Select"
              selectedItems={value}
              items={peerToPeerOfferPaymentMethods}
              onChange={(value) => handleChange(value)}
            />
          )}
        </Field>

        <Field name="date">
          {({ state: { value }, handleChange }) => (
            <>
              <TextField
                label="Creation Time"
                placeholder="DD-MM-YYYY  DD-MM-YYYY"
                value={value.length ? `${value[0]} - ${value[1]}` : ""}
                readOnly
                hideDetails
                appendInner={<Icon name={calendarIcon} />}
                onClick={() => setDateOpen(true)}
              />

              <RangePickerDialog
                title="Creation Time"
                open={dateOpen}
                onOpenChange={setDateOpen}
                value={value}
                onConfirm={(val) => {
                  if (Array.isArray(val)) {
                    handleChange(val);
                    setDateOpen(false);
                  }
                }}
              />
            </>
          )}
        </Field>
      </div>

      <DrawerFooter>
        <Button type="button" variant="ghost" onClick={() => setDialogs([])}>
          Cancel
        </Button>

        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>

        <Button type="submit">Apply</Button>
      </DrawerFooter>
    </form>
  );
};
