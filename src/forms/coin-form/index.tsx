import { FC, FormEvent, useEffect, useRef, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, DialogFooter, Select, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import { CoinFormSchema, CoinFormValues } from "./CoinForm.consts";

interface CoinFormProps {
  onSuccess: () => void;
}

export const CoinForm: FC<CoinFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.coin);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: CoinFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createCoin(value);
      else updateCoin(value);
    },
  });
  const { Field, Subscribe } = form;
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["coin", "unsavedChanges"]);
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

  const createCoin = async (requestData: CoinFormValues) => {
    try {
      setLoading(true);
      await api.post("/bo/api/coins", requestData);
      setDialogs([]);
      toast.success(`${requestData.name} has been added`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateCoin = async (requestData: CoinFormValues) => {
    try {
      setLoading(true);
      await api.put(`/bo/api/coins/${requestData.id}`, requestData);
      setDialogs([]);
      toast.success(`${requestData.name} has been updated`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getNodes = async () => {
    try {
      const { data } = await api.get("/bo/api/nodes/all?page=1&pageSize=10000");
      setNodes(data.items);
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
    getNodes();
  }, []);

  return (
    <form onChange={handleChange} onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_15rem)] flex-wrap gap-x-5 gap-y-1 overflow-auto px-6 py-3">
        <div className="w-[calc(50%_-_10px)]">
          <Field name="name">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                ref={firstInputRef}
                label="Name"
                name={name}
                value={value}
                autoFocus
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="symbol">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Symbol"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="derivePath">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Derive Path"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="nodeId">
            {({ name, state: { value, meta }, handleChange }) => (
              <Select
                label="Node"
                name={name}
                value={String(value)}
                items={nodes}
                errorMessage={meta.errors[0] || ""}
                onValueChange={(value) => handleChange(+value)}
              />
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
              {dialogMode === "create" ? "Add Coin" : "Update Coin"}
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
