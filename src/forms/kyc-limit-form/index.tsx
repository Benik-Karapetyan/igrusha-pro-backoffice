import { FC, FormEvent, useEffect, useRef, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, Checkbox, DialogFooter, Select, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import { KycLimitFormSchema, KycLimitFormValues } from "./KycLimitForm.consts";

interface KycLimitFormProps {
  onSuccess: () => void;
}

export const KycLimitForm: FC<KycLimitFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.kycLimit);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: KycLimitFormSchema,
    },
    onSubmit: ({ value }) => {
      const dataToSend = {
        ...value,
        dailyLimit: value.dailyLimit === "unlimited" ? -1 : value.dailyLimit,
      };

      if (dialogMode === "create") void createKycLimit(dataToSend);
      else void updateKycLimit(dataToSend);
    },
  });
  const { Field, Subscribe } = form;
  const [regions, setRegions] = useState([]);
  const [kycLevels, setKycLevels] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["kycLimit", "unsavedChanges"]);
    else setDialogs([]);
  };

  const handleChange = () => {
    setHasUnsavedChanges(!isEqual(defaultValues, form.state.values));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const createKycLimit = async (requestData: KycLimitFormValues) => {
    try {
      setLoading(true);
      await api.post("/bo/api/accountFeatures", {
        ...requestData,
        dailyLimit: requestData.dailyLimit === "unlimited" ? -1 : requestData.dailyLimit,
      });
      setDialogs([]);
      toast.success(`KYC Limit has been added`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateKycLimit = async (requestData: KycLimitFormValues) => {
    try {
      setLoading(true);
      await api.put(`/bo/api/accountFeatures/${requestData.id}`, requestData);
      setDialogs([]);
      toast.success(`KYC Limit has been updated`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getRegions = async () => {
    try {
      const { data } = await api.get("/bo/api/locations/all?page=1&pageSize=10000");
      setRegions(
        data.items.reduce(
          (
            acc: { status: number; countryName: string; name: string }[],
            item: { status: number; countryName: string }
          ) => {
            if (item.status === 1) {
              acc.push({ ...item, name: item.countryName });
            }
            return acc;
          },
          []
        )
      );
    } catch (err) {
      console.error("Error", err);
    }
  };

  const getKycLevels = async () => {
    try {
      const { data } = await api.get("/bo/api/kycLevels/all?page=1&pageSize=10000");
      setKycLevels(data.items);
    } catch (err) {
      console.error("Error", err);
    }
  };

  const getProducts = async () => {
    try {
      const { data } = await api.get("/bo/api/products/all?page=1&pageSize=10000");
      setProducts(data.items.filter((item: { status: number }) => item.status === 1));
    } catch (err) {
      console.error("Error", err);
    }
  };

  useEffect(() => {
    if (firstInputRef.current) {
      const input = firstInputRef.current;
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, []);

  useEffect(() => {
    getRegions();
    getKycLevels();
    getProducts();
  }, []);

  return (
    <form className="flex flex-col gap-4" onChange={handleChange} onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_15rem)] flex-wrap gap-x-5 gap-y-1 overflow-auto p-6 pt-3">
        <div className="w-[calc(50%_-_10px)]">
          <Field name="locationId">
            {({ name, state: { value, meta }, handleChange }) => (
              <Select
                label="Country"
                name={name}
                value={String(value)}
                items={regions}
                readOnly={dialogMode === "update"}
                errorMessage={meta.errors[0] || ""}
                onValueChange={(value) => handleChange(+value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="kycLevelId">
            {({ name, state: { value, meta }, handleChange }) => (
              <Select
                label="KYC Level"
                name={name}
                value={String(value)}
                items={kycLevels}
                readOnly={dialogMode === "update"}
                errorMessage={meta.errors[0] || ""}
                onValueChange={(value) => handleChange(+value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="productId">
            {({ name, state: { value, meta }, handleChange }) => (
              <Select
                label="Product"
                name={name}
                value={String(value)}
                items={products}
                readOnly={dialogMode === "update"}
                errorMessage={meta.errors[0] || ""}
                onValueChange={(value) => handleChange(+value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="dailyLimit">
            {({ name, state: { value, meta }, handleChange }) => (
              <>
                <TextField
                  label="Daily Limit, USD"
                  type={value === "unlimited" ? "text" : "number"}
                  name={name}
                  value={value}
                  readOnly={value === "unlimited"}
                  errorMessage={meta.errors[0] || ""}
                  onChange={({ target: { value } }) => handleChange(value ? +value : "")}
                />

                <Checkbox
                  label="Unlimited"
                  name={name}
                  checked={value === "unlimited"}
                  onCheckedChange={(checked) => {
                    if (checked && value !== "unlimited") {
                      handleChange("unlimited");
                    } else if (!checked && value === "unlimited") {
                      handleChange("");
                    }
                  }}
                />
              </>
            )}
          </Field>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" className="w-[160px]" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[160px]" disabled={!canSubmit} loading={loading}>
              {dialogMode === "create" ? "Add KYC Limit" : "Update KYC Limit"}
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
