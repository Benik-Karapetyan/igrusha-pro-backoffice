import { RootLayout } from "@layouts";
import { createRoute, redirect } from "@tanstack/react-router";

import { rootRoute } from "../__root";

export const authRoute = createRoute({
  id: "auth",
  getParentRoute: () => rootRoute,
  component: RootLayout,
  beforeLoad: ({ context: { auth }, location }) => {
    if (!auth) {
      throw redirect({
        to: "/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
