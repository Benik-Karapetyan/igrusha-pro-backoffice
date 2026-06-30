import { ChangeEvent, FC, FormEvent, useRef, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, DrawerFooter, DrawerHeader, DrawerTitle, Icon, Textarea, TextField, Typography } from "@ui-kit";
import { cn, getErrorMessage, uploadIcon } from "@utils";
import axios from "axios";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";

import { BrandFormSchema, BrandFormValues } from "./brand-form.consts";

interface BrandFormProps {
  onSuccess: () => void;
}

export const BrandForm: FC<BrandFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const dialogMode = useStore((s) => s.dialogMode);
  const setDrawerType = useStore((s) => s.setDrawerType);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.brand);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: BrandFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createBrand(value);
      else updateBrand(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);
  const [uploadedImage, setUploadedImage] = useState<{ url: string; key: string; file: File } | null>(null);
  const [uploadedCoverImage, setUploadedCoverImage] = useState<{ url: string; key: string; file: File } | null>(null);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["unsavedChanges"]);
    else setDrawerType(null);
  };

  const handleBrowseFile = () => {
    fileInputRef.current?.click();
  };

  const handleBrowseCoverFile = () => {
    coverFileInputRef.current?.click();
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

  const handleCoverFileChange = async (e: ChangeEvent<HTMLInputElement>, setValue: (value: string) => void) => {
    const file = e.target.files?.[0];

    if (file) {
      setValue(URL.createObjectURL(file));

      const { data } = await api.post("/uploads/get-presigned-url", {
        filename: file.name,
        contentType: file.type,
      });

      setUploadedCoverImage({ url: data.url, key: data.key, file });
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

  const createBrand = async (requestData: BrandFormValues) => {
    try {
      setLoading(true);

      let image: string = "";

      if (uploadedImage) {
        await axios.put(uploadedImage.url, uploadedImage.file, {
          headers: { "Content-Type": uploadedImage.file.type },
        });
        image = uploadedImage.key;
      }

      let coverImage: string = "";

      if (uploadedCoverImage) {
        await axios.put(uploadedCoverImage.url, uploadedCoverImage.file, {
          headers: { "Content-Type": uploadedCoverImage.file.type },
        });
        coverImage = uploadedCoverImage.key;
      }

      await api.post("/brands", { ...requestData, image, coverImage });

      setDrawerType(null);
      toast.success("Brand has been successfully created!");
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateBrand = async (requestData: BrandFormValues) => {
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

      let coverImage: string = "";

      if (uploadedCoverImage) {
        await api.put(`/uploads/delete-images`, {
          gallery: [new URL(requestData.coverImage).pathname.slice(1)],
        });

        await axios.put(uploadedCoverImage.url, uploadedCoverImage.file, {
          headers: { "Content-Type": uploadedCoverImage.file.type },
        });
        coverImage = uploadedCoverImage.key;
      } else {
        coverImage = `uploads/${requestData.coverImage.split("/").pop()}`;
      }

      await api.put(`/brands/${defaultValues._id}`, { ...omit(requestData, "_id"), image, coverImage });

      setDrawerType(null);
      toast.success("Brand has been successfully updated!");
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
        <DrawerTitle>{dialogMode === "create" ? "Create Brand" : "Update Brand"}</DrawerTitle>
      </DrawerHeader>

      <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4 pb-80">
        <Field name="image">
          {({ state: { value, meta }, handleChange }) => (
            <div className="flex flex-col gap-1.5">
              <Typography variant="heading-5" color="secondary">
                Image
              </Typography>

              <div className="flex gap-4">
                {!!value && <img src={value} alt="" className="h-[376px] w-[376px] rounded-md border object-cover" />}

                <div>
                  <div
                    className={cn(
                      "flex h-[376px] w-[376px] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-2 py-4",
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

        <Field name="coverImage">
          {({ state: { value, meta }, handleChange }) => (
            <div className="flex flex-col gap-1.5">
              <Typography variant="heading-5" color="secondary">
                Cover Image
              </Typography>

              <div className="flex flex-wrap gap-4">
                {!!value && <img src={value} alt="" className="h-auto w-[1161px] rounded-md border object-cover" />}

                <div>
                  <div
                    className={cn(
                      "flex h-[376px] w-[376px] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-2 py-4",
                      meta.errors[0] && "border-error-primary"
                    )}
                    onClick={handleBrowseCoverFile}
                  >
                    <Icon name={uploadIcon} />

                    <div className="flex items-center gap-1">
                      <Typography variant="heading-2" color="link">
                        Upload Cover Image
                      </Typography>
                    </div>

                    <input
                      ref={coverFileInputRef}
                      type="file"
                      className="hidden"
                      accept=".webp,.jpg,.png,.pdf,.mp4"
                      onChange={(e) => handleCoverFileChange(e, handleChange)}
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

        <div className="flex gap-4">
          <div className="w-[calc(100%_/_3_-_0.68rem)]">
            <Field name="urlName">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="URL Name"
                  placeholder="Enter URL name"
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
          <div className="grow">
            <Field name="name.am">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Name (Armenian)"
                  placeholder="Enter name"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="grow">
            <Field name="name.ru">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Name (Russian)"
                  placeholder="Enter name"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="grow">
            <Field name="name.en">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Name (English)"
                  placeholder="Enter name"
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
          <div className="grow">
            <Field name="title.am">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Title (Armenian)"
                  placeholder="Enter title"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="grow">
            <Field name="title.ru">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Title (Russian)"
                  placeholder="Enter title"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="grow">
            <Field name="title.en">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Title (English)"
                  placeholder="Enter title"
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
          <div className="grow">
            <Field name="metaDescription.am">
              {({ name, state: { value, meta }, handleChange }) => (
                <Textarea
                  label="Meta Description (Armenian)"
                  placeholder="Enter description"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="grow">
            <Field name="metaDescription.ru">
              {({ name, state: { value, meta }, handleChange }) => (
                <Textarea
                  label="Meta Description (Russian)"
                  placeholder="Enter description"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="grow">
            <Field name="metaDescription.en">
              {({ name, state: { value, meta }, handleChange }) => (
                <Textarea
                  label="Meta Description (English)"
                  placeholder="Enter description"
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
          <div className="grow">
            <Field name="description.am">
              {({ name, state: { value, meta }, handleChange }) => (
                <Textarea
                  label="Description (Armenian)"
                  placeholder="Enter description"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="grow">
            <Field name="description.ru">
              {({ name, state: { value, meta }, handleChange }) => (
                <Textarea
                  label="Description (Russian)"
                  placeholder="Enter description"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="grow">
            <Field name="description.en">
              {({ name, state: { value, meta }, handleChange }) => (
                <Textarea
                  label="Description (English)"
                  placeholder="Enter description"
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
