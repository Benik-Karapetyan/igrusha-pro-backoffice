import { FC, FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { MultiSelectDialog } from "@containers";
import { useToast } from "@hooks";
import { mdiMinus, mdiPlus } from "@mdi/js";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { ISelectItem } from "@types";
import { Button, Checkbox, DialogFooter, Icon, MultiSelect, Select, TextField } from "@ui-kit";
import { cn, getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import { emptyVault, emptyVaultAsset, VaultFormSchema, VaultFormValues, vaultTypes } from "./VaultForm.consts";

interface VaultFormProps {
  onSuccess: () => void;
}

export const VaultForm: FC<VaultFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.vault);
  const setDefaultValues = useStore((s) => s.setVault);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: VaultFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createVault(value);
      else updateVault(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);
  const [assets, setAssets] = useState<ISelectItem[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [nodesOpen, setNodesOpen] = useState(false);
  const [selectedVaultAssetIndex, setSelectedVaultAssetIndex] = useState<number>();
  const [assetNodes, setAssetNodes] = useState<ISelectItem[][]>([[]]);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["vault", "unsavedChanges"]);
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

  const createVault = async (requestData: VaultFormValues) => {
    try {
      setLoading(true);
      await api.post("/bo/api/vaults", requestData);
      setDialogs([]);
      toast.success(`${requestData.name} has been added`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateVault = async (requestData: VaultFormValues) => {
    try {
      setLoading(true);
      await api.put(`/bo/api/vaults/${requestData.id}`, requestData);
      setDialogs([]);
      toast.success(`${requestData.name} has been updated`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getAssets = useCallback(async () => {
    try {
      const { data } = await api.get("/bo/api/assets/all?pageSize=10000");
      setAssets(data.items);
    } catch (err) {
      console.error("Error", err);
    }
  }, []);

  const getNodesByAssetId = useCallback(
    async (assetId: number, index: number) => {
      try {
        const { data } = await api.get(`/bo/api/nodes/by-asset/${assetId}`);
        const newAssetNodes = [...assetNodes];
        newAssetNodes[index] = data;
        setAssetNodes(newAssetNodes);
      } catch (err) {
        console.error("Error", err);
      }
    },
    [assetNodes, setAssetNodes]
  );

  useEffect(() => {
    if (firstInputRef.current) {
      const input = firstInputRef.current;
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, []);

  useEffect(() => {
    if (assets.length && dialogMode === "create" && !initialized) {
      setInitialized(true);
      setDefaultValues({ ...emptyVault, vaultAssets: [{ assetId: +assets[0].id, nodeIds: [] }] });
      getNodesByAssetId(+assets[0].id, 0);
      form.reset();
    }
  }, [form, assets, dialogMode, initialized, setDefaultValues, getNodesByAssetId]);

  useEffect(() => {
    getAssets();
  }, [getAssets]);

  return (
    <form className="flex flex-col gap-4" onChange={handleChange} onSubmit={handleSubmit}>
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
          <Field name="key">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Key"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="type">
            {({ name, state: { value, meta }, handleChange }) => (
              <Select
                label="Type"
                name={name}
                value={String(value)}
                items={vaultTypes}
                errorMessage={meta.errors[0] || ""}
                onValueChange={(value) => handleChange(+value)}
              />
            )}
          </Field>
        </div>

        <Field name="vaultAssets" mode="array">
          {({ state: { value }, removeValue }) => (
            <div className="flex w-full flex-col gap-y-1 pb-4">
              {value.map((_, i) => (
                <div key={i} className="flex w-full flex-wrap items-center gap-x-5 gap-y-1">
                  <div className={cn(value.length > 1 ? "w-[calc(50%_-_38px)]" : "w-[calc(50%_-_10px)]")}>
                    <Field name={`vaultAssets[${i}].assetId`}>
                      {({ name, state: { value, meta }, handleChange }) => (
                        <Select
                          label="Asset"
                          name={name}
                          value={String(value)}
                          items={assets}
                          errorMessage={meta.errors[0] || ""}
                          onValueChange={(value) => {
                            handleChange(+value);
                            getNodesByAssetId(+value, i);
                          }}
                        />
                      )}
                    </Field>
                  </div>

                  <div className={cn(value.length > 1 ? "w-[calc(50%_-_38px)]" : "w-[calc(50%_-_10px)]")}>
                    <Field name={`vaultAssets[${i}].nodeIds`}>
                      {({ state: { value, meta }, handleChange }) => (
                        <>
                          <MultiSelect
                            label="Node(s)"
                            value={value}
                            items={assetNodes[i]}
                            errorMessage={meta.errors[0] || ""}
                            onClick={() => {
                              if (assetNodes[i].length) {
                                setSelectedVaultAssetIndex(i);
                                setNodesOpen(true);
                              }
                            }}
                          />

                          <MultiSelectDialog
                            title="Node(s)"
                            open={nodesOpen && i === selectedVaultAssetIndex}
                            onOpenChange={setNodesOpen}
                            items={assetNodes[i]}
                            selectedItems={value}
                            onSubmit={(nodeIds) => {
                              setHasUnsavedChanges(!isEqual(defaultValues.vaultAssets[i].nodeIds, nodeIds));
                              handleChange(nodeIds);
                              setNodesOpen(false);
                            }}
                          />
                        </>
                      )}
                    </Field>
                  </div>

                  {value.length > 1 && (
                    <Button type="button" variant="icon" size="icon" onClick={() => removeValue(i)}>
                      <Icon name={mdiMinus} />
                    </Button>
                  )}
                </div>
              ))}

              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="icon"
                  size="icon"
                  onClick={() => {
                    setAssetNodes((prev) => [...prev, []]);
                    setDefaultValues({
                      ...form.state.values,
                      vaultAssets: [...form.state.values.vaultAssets, emptyVaultAsset],
                    });
                    form.reset();
                  }}
                >
                  <Icon name={mdiPlus} />
                </Button>
              </div>
            </div>
          )}
        </Field>

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
              {dialogMode === "create" ? "Add Vault" : "Update Vault"}
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
