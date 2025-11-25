import { FormEvent, useEffect, useState } from "react";

import { useToast } from "@hooks";
import { mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js";
import { api } from "@services";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Button, Icon, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";

interface ILoginModel {
  username: string;
  password: string;
}

export const SignInPage = () => {
  const { from } = useSearch({ from: "/sign-in" });
  const navigate = useNavigate();
  const toast = useToast();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signInData, setSignInData] = useState<ILoginModel>({
    username: "",
    password: "",
  });

  const signIn = async () => {
    try {
      setLoading(true);

      const { data } = await api.post("/bo/api/auth/login", signInData);

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        location.reload();
      }

      navigate({
        to: "/customers",
        replace: true,
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signIn();
  };

  useEffect(() => {
    if (!mounted) {
      setMounted(true);

      if (from === "reset-password") {
        toast.success("Password has been successfully reset");
      } else if (from === "set-password") {
        toast.success("Password has been successfully set");
      }
    }
  }, [from, toast, mounted]);

  return (
    <div className="flex h-screen">
      <div className="w-[calc(100%_/_3)]" />
      <div className="flex w-[calc(100%_/_3_*_2)] items-center justify-center bg-background-muted">
        <div className="flex w-[420px] flex-col gap-4">
          <h1 className="text-4xl font-semibold leading-10 text-primary">Log in</h1>
          <p>Welcome to the Freedx Admin Panel</p>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <TextField
                label="Username"
                value={signInData.username}
                onChange={(e) => setSignInData({ ...signInData, username: e.target.value })}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={signInData.password}
                appendInner={
                  <Icon
                    name={showPassword ? mdiEyeOutline : mdiEyeOffOutline}
                    className="cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                }
                onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-end">
              {/* <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="cursor-pointer select-none text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Keep me signed in on this device
                </label>
              </div> */}

              <Link to="/recover-password" className="text-sm font-semibold text-primary">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="text-base" loading={loading}>
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
