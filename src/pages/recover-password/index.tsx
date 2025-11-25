import { FormEvent, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { z } from "zod";

const RecoverPasswordFormSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
});

type RecoverPasswordFormValues = z.infer<typeof RecoverPasswordFormSchema>;

export const RecoverPasswordPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: RecoverPasswordFormSchema,
    },
    onSubmit: ({ value }) => {
      resetPassword(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);

  const resetPassword = async (requestData: RecoverPasswordFormValues) => {
    try {
      setLoading(true);
      await api.post("/bo/api/auth/reset-password-request", requestData);
      navigate({ to: "/check-email" });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <div className="flex h-screen">
      <div className="w-[calc(100%_/_3)]"></div>
      <div className="flex w-[calc(100%_/_3_*_2)] items-center justify-center bg-background-muted">
        <div className="flex w-[420px] flex-col gap-4">
          <h1 className="text-4xl font-semibold leading-10 text-primary">Forgot your password?</h1>
          <p>
            Please enter the email address for which you need to reset the password. An admin will review your request
            and contact you. If your request is approved, the admin will send a password reset link to your email.
          </p>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Field name="email">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Enter Your Email"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>

            <Subscribe selector={({ canSubmit, isSubmitting }) => [canSubmit, isSubmitting]}>
              {([canSubmit]) => (
                <Button type="submit" className="text-base" disabled={!canSubmit} loading={loading}>
                  Reset Password
                </Button>
              )}
            </Subscribe>

            <Link to="/sign-in" className="h-full w-full">
              <Button type="button" variant="outline" className="w-full text-base">
                Go back
              </Button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};
