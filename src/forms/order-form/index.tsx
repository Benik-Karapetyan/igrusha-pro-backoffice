import { FC, FormEvent, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { ENUM_ORDER_PAYMENT_METHOD } from "@types";
import { Button, Calendar, DrawerFooter, DrawerHeader, DrawerTitle, Select, Textarea, TextField } from "@ui-kit";
import { calculateDiscountPercentage, getErrorMessage } from "@utils";
import { isEqual, omit } from "lodash";

import { OrderFormSchema, OrderFormValues, paymentMethods } from "./order-form.consts";

interface OrderFormProps {
  onSuccess: () => void;
}

export const OrderForm: FC<OrderFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const dialogMode = useStore((s) => s.dialogMode);
  const setDrawerType = useStore((s) => s.setDrawerType);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.order);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: OrderFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createOrder(value);
      else updateOrder(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

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

  const createOrder = async (requestData: OrderFormValues) => {
    try {
      setLoading(true);

      const mappedRequestData = {
        ...omit(
          requestData,
          requestData.orderInstructions ? "" : "orderInstructions",
          requestData.createdAt ? "" : "createdAt"
        ),
        items: requestData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          discount: item.finalPrice ? calculateDiscountPercentage(item.finalPrice, item.price) : item.discount || 0,
        })),
      };

      await api.post("/orders/admin", mappedRequestData);

      setDrawerType(null);
      toast.success(`Order has been successfully created!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (requestData: OrderFormValues) => {
    try {
      setLoading(true);

      const mappedRequestData = {
        ...omit(
          requestData,
          "_id",
          requestData.orderInstructions ? "" : "orderInstructions",
          requestData.createdAt ? "" : "createdAt"
        ),
        items: requestData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          discount: item.finalPrice ? calculateDiscountPercentage(item.finalPrice, item.price) : item.discount || 0,
        })),
      };

      await api.put(`/orders/${defaultValues._id}/admin`, {
        ...mappedRequestData,
      });

      setDrawerType(null);
      toast.success(`Order has been successfully updated!`);
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
        <DrawerTitle>{dialogMode === "create" ? "Create Order" : "Update Order"}</DrawerTitle>
      </DrawerHeader>

      <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4">
        <Field name="paymentMethod">
          {({ name, state: { value, meta }, handleChange }) => (
            <Select
              label="Payment Method"
              placeholder="Select payment method"
              name={name}
              value={value}
              items={paymentMethods}
              errorMessage={meta.errors[0] || ""}
              onValueChange={(value) => handleChange(value as ENUM_ORDER_PAYMENT_METHOD)}
            />
          )}
        </Field>

        <Field name="orderInstructions">
          {({ name, state: { value, meta }, handleChange }) => (
            <Textarea
              label="Order Instructions"
              placeholder="Enter order instructions"
              name={name}
              value={value}
              errorMessage={meta.errors[0] || ""}
              onChange={(e) => handleChange(e.target.value)}
            />
          )}
        </Field>

        <Field name="shippingFee">
          {({ name, state: { value, meta }, handleChange }) => (
            <TextField
              label="Shipping Fee"
              placeholder="Enter shipping fee"
              type="number"
              name={name}
              value={value}
              errorMessage={meta.errors[0] || ""}
              onChange={({ target: { value } }) => handleChange(value ? +value : "")}
            />
          )}
        </Field>

        <Field name="items" mode="array">
          {({ state: { value } }) => (
            <div>
              {value.map((item, index) => (
                <div key={item.productId} className="flex gap-2">
                  <img src={item.image} alt={item.productId} width={120} height={120} />

                  <Field name={`items[${index}].quantity`}>
                    {({ state: { value, meta }, handleChange }) => (
                      <TextField
                        label="Quantity"
                        type="number"
                        value={value}
                        errorMessage={meta.errors[0] || ""}
                        onChange={({ target: { value } }) => handleChange(value ? +value : "")}
                      />
                    )}
                  </Field>
                  <Field name={`items[${index}].discount`}>
                    {({ state: { value, meta }, handleChange }) => (
                      <TextField
                        label="Discount"
                        type="number"
                        value={value}
                        errorMessage={meta.errors[0] || ""}
                        onChange={({ target: { value } }) => handleChange(value ? +value : "")}
                      />
                    )}
                  </Field>

                  <Field name={`items[${index}].finalPrice`}>
                    {({ state: { value: finalPriceValue, meta }, handleChange }) => (
                      <TextField
                        label="Final Price"
                        type="number"
                        value={finalPriceValue}
                        errorMessage={meta.errors[0] || ""}
                        onChange={({ target }) => {
                          calculateDiscountPercentage(+target.value, value[index].price);
                          handleChange(target.value ? +target.value : "");
                        }}
                      />
                    )}
                  </Field>
                </div>
              ))}
            </div>
          )}
        </Field>

        <Field name="createdAt">
          {({ state: { value }, handleChange }) => (
            <Calendar
              label="Created At"
              className="mx-auto"
              value={value}
              onChange={(value) => handleChange(value as string)}
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
