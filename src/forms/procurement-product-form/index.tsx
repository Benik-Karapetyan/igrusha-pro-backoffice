import { ChangeEvent, FC, FormEvent, useRef, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, DrawerFooter, DrawerHeader, DrawerTitle, Icon, TextField, Typography } from "@ui-kit";
import { cn, getErrorMessage, uploadIcon } from "@utils";
import axios from "axios";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";

import {
  emptyProcurementProduct,
  ProcurementProductFormSchema,
  ProcurementProductFormValues,
} from "./procurement-product-form.consts";

interface ProcurementProductFormProps {
  onSuccess: () => void;
}

export const ProcurementProductForm: FC<ProcurementProductFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.procurementProduct) || emptyProcurementProduct;
  const mode = defaultValues._id ? "update" : "create";
  const setProcurementProduct = useStore((s) => s.setProcurementProduct);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: ProcurementProductFormSchema,
    },
    onSubmit: ({ value }) => {
      if (mode === "create") createProduct(value);
      else updateProduct(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);
  const [uploadedImage, setUploadedImage] = useState<{ url: string; key: string; file: File } | null>(null);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["unsavedChanges"]);
    else setProcurementProduct(null);
  };

  const handleBrowseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, setValue: (value: string) => void) => {
    const file = e.target.files?.[0];

    if (file) {
      setValue(URL.createObjectURL(file));

      const { data } = await api.post("/uploads/get-presigned-url", {
        filename: file.name,
        contentType: file.type,
      });

      setUploadedImage({ url: data.url, key: data.key, file });
    }
  };

  const handleChange = () => {
    setHasUnsavedChanges(!isEqual(defaultValues, form.state.values));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const createProduct = async (requestData: ProcurementProductFormValues) => {
    try {
      setLoading(true);

      let image: string = "";

      if (uploadedImage) {
        await axios.put(uploadedImage.url, uploadedImage.file, {
          headers: { "Content-Type": uploadedImage.file.type },
        });
        image = uploadedImage.key;
      }

      await api.post("/procurement-products", {
        ...omit(requestData, "paymentFee", "trackingNumber"),
        image,
        ...(typeof requestData.paymentFee === "number" ? { paymentFee: requestData.paymentFee } : {}),
        ...(typeof requestData.trackingNumber === "string" ? { trackingNumber: requestData.trackingNumber } : {}),
      });

      setProcurementProduct(null);
      toast.success(`Procurement product has been successfully created!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (requestData: ProcurementProductFormValues) => {
    try {
      setLoading(true);

      let image: string = "";

      if (uploadedImage) {
        await api.put(`/uploads/delete-images`, {
          gallery: [new URL(requestData.image).pathname.slice(1)],
        });

        await axios.put(uploadedImage.url, uploadedImage.file, {
          headers: { "Content-Type": uploadedImage.file.type },
        });
        image = uploadedImage.key;
      } else {
        image = `uploads/${requestData.image.split("/").pop()}`;
      }

      await api.put(`/procurement-products/${defaultValues?._id}`, {
        ...omit(requestData, "_id", "paymentFee", "trackingNumber"),
        image,
        ...(typeof requestData.paymentFee === "number" ? { paymentFee: requestData.paymentFee } : {}),
        ...(typeof requestData.trackingNumber === "string" ? { trackingNumber: requestData.trackingNumber } : {}),
      });

      setProcurementProduct(null);
      toast.success(`Procurement product has been successfully updated!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="h-full" onChange={handleChange} onSubmit={handleSubmit}>
      <DrawerHeader>
        <DrawerTitle>{mode === "create" ? "Create Procurement Product" : "Update Procurement Product"}</DrawerTitle>
      </DrawerHeader>

      <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4 pb-80">
        <Field name="image">
          {({ state: { value, meta }, handleChange }) => (
            <div className="flex flex-col gap-1.5">
              <Typography variant="heading-5" color="secondary">
                Image
              </Typography>

              <div className="flex gap-4">
                {!!value && (
                  <img src={value} alt="" className="h-[322.5px] w-[322.5px] rounded-md border object-cover" />
                )}

                <div>
                  <div
                    className={cn(
                      "flex h-[322.5px] w-[322.5px] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-2 py-4",
                      meta.errors[0] && "border-error-primary"
                    )}
                    onClick={handleBrowseFile}
                  >
                    <Icon name={uploadIcon} />

                    <div className="flex items-center gap-1">
                      <Typography variant="heading-2" color="link">
                        Upload Image
                      </Typography>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".webp,.jpg,.png,.pdf,.mp4"
                      onChange={(e) => handleFileChange(e, handleChange)}
                    />

                    <Typography variant="body-sm" color="secondary">
                      JPEG, PNG, PDF, and MP4 formats, up to 50 MB.
                    </Typography>
                  </div>

                  {meta.errors[0] && <span className="text-xs text-error-primary">{meta.errors[0]}</span>}
                </div>
              </div>
            </div>
          )}
        </Field>

        <div>
          <Field name="url">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="URL"
                placeholder="Enter URL"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="flex gap-4">
          <div className="w-[calc(100%_/_3_-_0.68rem)]">
            <Field name="price">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Price"
                  placeholder="Enter price"
                  type="number"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={({ target: { value } }) => handleChange(value ? +value : "")}
                />
              )}
            </Field>
          </div>

          <div className="w-[calc(100%_/_3_-_0.68rem)]">
            <Field name="cartonQuantity">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Carton Quantity"
                  placeholder="Enter carton quantity"
                  type="number"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={({ target: { value } }) => handleChange(value ? +value : "")}
                />
              )}
            </Field>
          </div>

          <div className="w-[calc(100%_/_3_-_0.68rem)]">
            <Field name="cartonWeight">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Carton Weight"
                  placeholder="Enter carton weight"
                  type="number"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={({ target: { value } }) => handleChange(value ? +value : "")}
                />
              )}
            </Field>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Typography variant="heading-4" color="secondary">
            Carton Size
          </Typography>

          <div className="flex w-full grow gap-4">
            <div className="w-[calc(100%_/_3_-_0.68rem)]">
              <Field name="cartonSize.length">
                {({ name, state: { value, meta }, handleChange }) => (
                  <TextField
                    label="Length"
                    placeholder="Enter length"
                    type="number"
                    name={name}
                    value={value}
                    errorMessage={meta.errors[0] || ""}
                    onChange={({ target: { value } }) => handleChange(value ? +value : "")}
                  />
                )}
              </Field>
            </div>

            <div className="w-[calc(100%_/_3_-_0.68rem)]">
              <Field name="cartonSize.width">
                {({ name, state: { value, meta }, handleChange }) => (
                  <TextField
                    label="Width"
                    placeholder="Enter width"
                    type="number"
                    name={name}
                    value={value}
                    errorMessage={meta.errors[0] || ""}
                    onChange={({ target: { value } }) => handleChange(value ? +value : "")}
                  />
                )}
              </Field>
            </div>

            <div className="w-[calc(100%_/_3_-_0.68rem)]">
              <Field name="cartonSize.height">
                {({ name, state: { value, meta }, handleChange }) => (
                  <TextField
                    label="Height"
                    placeholder="Enter height"
                    type="number"
                    name={name}
                    value={value}
                    errorMessage={meta.errors[0] || ""}
                    onChange={({ target: { value } }) => handleChange(value ? +value : "")}
                  />
                )}
              </Field>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-[calc(100%_/_3_-_0.68rem)]">
            <Field name="quantity">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Quantity"
                  placeholder="Enter quantity"
                  type="number"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={({ target: { value } }) => handleChange(value ? +value : "")}
                />
              )}
            </Field>
          </div>

          <div className="w-[calc(100%_/_3_-_0.68rem)]">
            <Field name="deliveryInsideCost">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Delivery Inside Cost"
                  placeholder="Enter delivery inside cost"
                  type="number"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={({ target: { value } }) => handleChange(value ? +value : "")}
                />
              )}
            </Field>
          </div>

          <div className="w-[calc(100%_/_3_-_0.68rem)]">
            <Field name="deliveryInsideDuration">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Delivery Inside Duration"
                  placeholder="Enter delivery inside duration"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-[calc(100%_/_3_-_0.68rem)]">
            <Field name="paymentFee">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Payment Fee"
                  placeholder="Enter payment fee"
                  type="number"
                  step="any"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={({ target: { value } }) => handleChange(value ? +value : "")}
                />
              )}
            </Field>
          </div>

          <div className="w-[calc(100%_/_3_-_0.68rem)]">
            <Field name="brand">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Brand"
                  placeholder="Enter brand name"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="w-[calc(100%_/_3_-_0.68rem)]">
            <Field name="seller">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Seller"
                  placeholder="Enter seller name"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-[calc(100%_/_3_-_0.68rem)]">
            <Field name="trackingNumber">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Tracking Number"
                  placeholder="Enter tracking number"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>
        </div>
      </div>

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
