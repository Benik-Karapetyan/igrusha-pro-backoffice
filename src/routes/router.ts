import { createRouter } from "@tanstack/react-router";

import { rootRoute } from "./__root";
import { authRoute } from "./auth";
import { checkEmailRoute } from "./check-email";
import { mainRoute } from "./main";
import { ordersRoute } from "./orders";
import { productsRoute } from "./products";
import { profileRoute } from "./profile";
import { recoverPasswordRoute } from "./recover-password";
import { resetPasswordRoute } from "./reset-password";
import { setPasswordRoute } from "./set-password";
import { signInRoute } from "./sign-in";
import { usersRoute } from "./users";

const routeTree = rootRoute.addChildren([
  authRoute.addChildren([mainRoute, profileRoute, usersRoute, productsRoute, ordersRoute]),
  signInRoute,
  recoverPasswordRoute,
  checkEmailRoute,
  setPasswordRoute,
  resetPasswordRoute,
]);

export const router = createRouter({
  routeTree,
  context: { auth: undefined! },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
