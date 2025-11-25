import { FormEvent, useState } from "react";

import { useToast } from "@hooks";
import { mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js";
import { api } from "@services";
import { useForm } from "@tanstack/react-form";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Button, Icon, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { z } from "zod";

const SetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .refine((val) => /[A-Z]/.test(val), { message: "Password must contain at least one uppercase letter" })
      .refine((val) => /\d/.test(val), { message: "Password must contain at least one number" })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "Password must contain at least one special character",
      }),
    repeatPassword: z.string(),
  })
  .superRefine(({ password, repeatPassword }, ctx) => {
    if (password !== repeatPassword) {
      ctx.addIssue({
        path: ["repeatPassword"],
        message: "Passwords do not match",
        code: "custom",
      });
    }
  });

type SetPasswordFormValues = z.infer<typeof SetPasswordFormSchema>;

export const SetPasswordPage = () => {
  const navigate = useNavigate();
  const { token, user } = useSearch({ from: "/set-password" });
  const toast = useToast();
  const form = useForm({
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
    validators: {
      onSubmit: SetPasswordFormSchema,
    },
    onSubmit: ({ value }) => {
      setPassword({ password: value.password });
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const setPassword = async (requestData: Omit<SetPasswordFormValues, "repeatPassword">) => {
    try {
      setLoading(true);

      await api.post("/bo/api/auth/set-password", {
        ...requestData,
        token,
        username: user,
      });

      toast.success("Password has been successfully set");
      navigate({ to: "/sign-in", search: { from: "set-password" }, replace: true });
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
          <h1 className="text-4xl font-semibold leading-10 text-primary">Set Password</h1>
          <p>Create a password to secure your account and protect your personal information.</p>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Field name="password">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  appendInner={
                    <Icon
                      name={showPassword ? mdiEyeOutline : mdiEyeOffOutline}
                      className="cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  }
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>

            <Field name="repeatPassword">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Repeat Password"
                  type={showRepeatPassword ? "text" : "password"}
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  appendInner={
                    <Icon
                      name={showRepeatPassword ? mdiEyeOutline : mdiEyeOffOutline}
                      className="cursor-pointer"
                      onClick={() => setShowRepeatPassword((prev) => !prev)}
                    />
                  }
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>

            <Subscribe selector={({ canSubmit, isSubmitting }) => [canSubmit, isSubmitting]}>
              {([canSubmit]) => (
                <Button type="submit" className="text-base" disabled={!canSubmit} loading={loading}>
                  Set Password
                </Button>
              )}
            </Subscribe>
          </form>
        </div>
      </div>
    </div>
  );
};
