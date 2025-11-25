import { Link } from "@tanstack/react-router";
import { Button } from "@ui-kit";

export const CheckEmailPage = () => {
  return (
    <div className="flex h-screen">
      <div className="w-[calc(100%_/_3)]"></div>
      <div className="flex w-[calc(100%_/_3_*_2)] items-center justify-center bg-background-muted">
        <div className="flex w-[420px] flex-col gap-4">
          <h1 className="text-primary text-4xl font-semibold leading-10">Check your email</h1>
          <p>Your request has been sent to the admin. You will be notified once your request has been processed.</p>

          <Link to="/sign-in" className="h-full w-full">
            <Button className="w-full text-base">Back to login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
