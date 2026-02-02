import { ChangeEvent, FC, FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { CategoryFormValues } from "@forms";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import {
  Autocomplete,
  Button,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Icon,
  Select,
  Textarea,
  TextField,
  Typography,
} from "@ui-kit";
import { cn, getErrorMessage, uploadIcon } from "@utils";
import axios from "axios";
import { isEqual, omit } from "lodash";

import { genderOptions, ProductFormSchema, ProductFormValues } from "./product-form.consts";
import { RelatedProducts } from "./related-products";
import { VariantOfProducts } from "./variant-of-products";

interface ProductFormProps {
  onSuccess: () => void;
}

export const ProductForm: FC<ProductFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const dialogMode = useStore((s) => s.dialogMode);
  const setDrawerType = useStore((s) => s.setDrawerType);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.product);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: ProductFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createProduct(value);
      else updateProduct(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);
  const [uploadedImages, setUploadedImages] = useState<{ url: string; key: string; file: File }[]>([]);
  const canFetch = useRef(true);
  const [categories, setCategories] = useState([]);

  const handleBrowseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, setValue: (value: string[]) => void) => {
    const file = e.target.files?.[0];

    if (file) {
      setValue(form.state.values.gallery.concat(URL.createObjectURL(file)));

      const { data } = await api.post("/uploads/get-presigned-url", {
        filename: file.name,
        contentType: file.type,
      });

      setUploadedImages((prev) => [...prev, { url: data.url, key: data.key, file }]);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["unsavedChanges"]);
    else setDrawerType(null);
  };

  const handleChange = () => {
    setHasUnsavedChanges(!isEqual(defaultValues, form.state.values));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const createProduct = async (requestData: ProductFormValues) => {
    try {
      setLoading(true);

      const gallery: string[] = [];

      if (uploadedImages.length) {
        for (const image of uploadedImages) {
          await axios.put(image.url, image.file, {
            headers: { "Content-Type": image.file.type },
          });
          gallery.push(image.key);
        }
      }

      await api.post("/products", {
        ...requestData,
        gallery,
        discount: requestData.discount ? requestData.discount : 0,
        ageRange: omit(requestData.ageRange, !requestData.ageRange.to ? "to" : ""),
        size: omit(
          requestData.size,
          !requestData.size?.length ? "length" : "",
          !requestData.size?.width ? "width" : "",
          !requestData.size?.height ? "height" : ""
        ),
        boxSize: omit(
          requestData.boxSize,
          !requestData.boxSize?.length ? "length" : "",
          !requestData.boxSize?.width ? "width" : "",
          !requestData.boxSize?.height ? "height" : ""
        ),
      });

      setDrawerType(null);
      toast.success(`Product has been successfully created!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (requestData: ProductFormValues) => {
    try {
      setLoading(true);

      let gallery: string[] = [];

      if (uploadedImages.length) {
        await api.put(`/uploads/delete-images`, {
          gallery: requestData.gallery.map((image) => new URL(image).pathname.slice(1)),
        });

        for (const image of uploadedImages) {
          await axios.put(image.url, image.file, {
            headers: { "Content-Type": image.file.type },
          });
          gallery.push(image.key);
        }
      } else {
        gallery = requestData.gallery.map((image) => `uploads/${image.split("/").pop()}`);
      }

      await api.put(`/products/${defaultValues._id}`, {
        ...omit(requestData, "_id", "productNumber", "updatedAt", "variants"),
        gallery,
        discount: requestData.discount ? requestData.discount : 0,
        ageRange: omit(requestData.ageRange, !requestData.ageRange.to ? "to" : ""),
        size: omit(
          requestData.size,
          !requestData.size?.length ? "length" : "",
          !requestData.size?.width ? "width" : "",
          !requestData.size?.height ? "height" : ""
        ),
        boxSize: omit(
          requestData.boxSize,
          !requestData.boxSize?.length ? "length" : "",
          !requestData.boxSize?.width ? "width" : "",
          !requestData.boxSize?.height ? "height" : ""
        ),
      });

      setDrawerType(null);
      toast.success(`Product has been successfully updated!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getCategories = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/categories", { params: { page: 1, pageSize: 1000 } });

      setCategories(data.items.map((category: CategoryFormValues) => ({ name: category.name.en, id: category._id })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getCategories();
    }
  }, [getCategories]);

  return (
    <form className="h-full" onChange={handleChange} onSubmit={handleSubmit}>
      <DrawerHeader>
        <DrawerTitle>{dialogMode === "create" ? "Create Product" : "Update Product"}</DrawerTitle>
      </DrawerHeader>

      <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4 pb-80">
        <Field name="gallery" mode="array">
          {({ state: { value, meta }, handleChange }) => (
            <div className="flex flex-col gap-1.5">
              <Typography variant="heading-5" color="secondary">
                Image Gallery
              </Typography>

              <div className="flex gap-4">
                {!!value.length && (
                  <div className="flex flex-wrap gap-4">
                    {value.map((image, i) => (
                      <img key={i} src={image} alt="" className="h-[376px] w-[376px] rounded-md border object-cover" />
                    ))}
                  </div>
                )}

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

        <div className="w-[calc(100%_/_3_-_0.68rem)]">
          <Field name="categories">
            {({ state: { value, meta }, handleChange }) => (
              <Autocomplete
                label="Categories"
                placeholder="Select categories"
                selectedItems={value}
                items={categories}
                errorMessage={meta.errors[0] || ""}
                onChange={handleChange}
              />
            )}
          </Field>
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

        <div className="flex gap-4">
          <div className="w-[calc(100%_/_3_-_0.68rem)]">
            <Field name="cost">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Cost"
                  placeholder="Enter cost"
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
            <Field name="discount">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Discount"
                  placeholder="Enter discount"
                  type="number"
                  name={name}
                  value={value}
                  hint="%"
                  errorMessage={meta.errors[0] || ""}
                  onChange={({ target: { value } }) => handleChange(value ? +value : "")}
                />
              )}
            </Field>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-[calc(100%_/_3_-_0.68rem)]">
            <Field name="numberInStock">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Number in stock"
                  placeholder="Enter number in stock"
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
            <Field name="sectionName">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Section name"
                  placeholder="Enter section name"
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
          <div className="flex w-[calc(100%_/_3_-_0.68rem)] flex-col gap-2">
            <Typography variant="heading-4" color="secondary">
              Age Range
            </Typography>

            <div className="flex gap-4">
              <Field name="ageRange.from">
                {({ name, state: { value, meta }, handleChange }) => (
                  <TextField
                    label="From"
                    placeholder="Enter from"
                    type="number"
                    name={name}
                    value={value}
                    errorMessage={meta.errors[0] || ""}
                    onChange={({ target: { value } }) => handleChange(value ? +value : "")}
                  />
                )}
              </Field>

              <Field name="ageRange.to">
                {({ name, state: { value, meta }, handleChange }) => (
                  <TextField
                    label="To"
                    placeholder="Enter to"
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

          <div className="w-[calc(100%_/_3_-_0.68rem)] pt-7">
            <Field name="gender">
              {({ name, state: { value, meta }, handleChange }) => (
                <Select
                  label="Gender"
                  placeholder="Select gender"
                  name={name}
                  value={value}
                  items={genderOptions}
                  hideDetails
                  errorMessage={meta.errors[0] || ""}
                  onValueChange={(value) => handleChange(value as "unisex" | "boy" | "girl")}
                />
              )}
            </Field>
          </div>

          <div className="w-[calc(100%_/_3_-_0.68rem)] pt-7">
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
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <Typography variant="heading-4" color="secondary">
              Size
            </Typography>

            <div className="flex gap-4">
              <Field name="size.length">
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

              <Field name="size.width">
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

              <Field name="size.height">
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

          <div className="flex flex-col gap-2">
            <Typography variant="heading-4" color="secondary">
              Box Size
            </Typography>

            <div className="flex gap-4">
              <Field name="boxSize.length">
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

              <Field name="boxSize.width">
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

              <Field name="boxSize.height">
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

        <Field name="isVariantOf">
          {({ name, state: { value, meta }, handleChange }) => (
            <VariantOfProducts
              name={name}
              value={value}
              headersLength={1}
              errorMessage={meta.errors[0] || ""}
              handleChange={handleChange}
            />
          )}
        </Field>

        <Field name="relatedProducts">
          {({ name, state: { value, meta }, handleChange }) => (
            <RelatedProducts
              name={name}
              value={value || []}
              headersLength={1}
              errorMessage={meta.errors[0] || ""}
              handleChange={handleChange}
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
            <Button type="submit" className="w-[60px]" disabled={!canSubmit} loading={loading}>
              Save
            </Button>
          )}
        </Subscribe>
      </DrawerFooter>
    </form>
  );
};
