import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AuthProvider } from "@providers";
import { Toaster } from "sonner";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />

      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          actionButtonStyle: {
            background: "inherit",
            padding: 0,
            margin: 0,
          },
          className:
            "w-[max-content] !bg-background-subtle py-1.5 pl-1 pr-1.5 !shadow-black-16 rounded-md text-sm !text-foreground-primary",
          classNames: {
            icon: "m-0 w-auto h-auto",
          },
        }}
      />
    </AuthProvider>
  </StrictMode>
);
