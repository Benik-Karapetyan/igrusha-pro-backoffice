import { FC, FormEvent, useEffect, useRef, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, Checkbox, DialogFooter, Select, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import { NodeFormSchema, NodeFormValues } from "./NodeForm.consts";

interface NodeFormProps {
  onSuccess: () => void;
}

export const NodeForm: FC<NodeFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.node);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: NodeFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createNode(value);
      else updateNode(value);
    },
  });
  const { Field, Subscribe } = form;
  const [scanners, setScanners] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["product", "unsavedChanges"]);
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

  const createNode = async (requestData: NodeFormValues) => {
    try {
      setLoading(true);
      await api.post("/bo/api/nodes", requestData);
      setDialogs([]);
      toast.success(`${requestData.name} has been added`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateNode = async (requestData: NodeFormValues) => {
    try {
      setLoading(true);
      await api.put(`/bo/api/nodes/${requestData.id}`, requestData);
      setDialogs([]);
      toast.success(`${requestData.name} has been updated`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getScanners = async () => {
    try {
      const { data } = await api.get("/bo/api/scanners/all?page=1&pageSize=10000");
      setScanners(data.items);
    } catch (err) {
      console.error("Error", err);
    }
  };

  const getNetworks = async () => {
    try {
      const { data } = await api.get("/bo/api/networks/all?page=1&pageSize=10000");
      setNetworks(data);
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
    getScanners();
    getNetworks();
  }, []);

  return (
    <form onChange={handleChange} onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_15rem)] flex-wrap gap-x-5 gap-y-1 overflow-auto p-6 pt-3">
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
          <Field name="rpc">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="RPC"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="username">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Username"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="password">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Password"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="withdrawAddress">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Withdraw Address"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="stack">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Stack"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="keypass">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Keypass"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="keystore">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Keystore"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="chain">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Chain"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="scannerId">
            {({ name, state: { value, meta }, handleChange }) => (
              <Select
                label="Market Coin"
                name={name}
                value={String(value)}
                items={scanners}
                errorMessage={meta.errors[0] || ""}
                onValueChange={(value) => handleChange(+value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="networkId">
            {({ name, state: { value, meta }, handleChange }) => (
              <Select
                label="Network"
                name={name}
                value={String(value)}
                items={networks}
                errorMessage={meta.errors[0] || ""}
                onValueChange={(value) => handleChange(+value)}
              />
            )}
          </Field>
        </div>

        <Field name="status">
          {({ name, state: { value }, handleChange }) => (
            <Checkbox
              label="Status"
              name={name}
              checked={value === 1}
              onCheckedChange={(checked) => {
                if (checked && value !== 1) handleChange(1);
                else if (!checked && value !== 2) handleChange(2);
              }}
            />
          )}
        </Field>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" className="w-[160px]" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[160px]" disabled={!canSubmit} loading={loading}>
              {dialogMode === "create" ? "Add Node" : "Update Node"}
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
