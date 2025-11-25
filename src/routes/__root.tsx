import { NotFoundComponent } from "@containers";
import { createRootRouteWithContext, ErrorComponent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const rootRoute = createRootRouteWithContext<{ auth: boolean }>()({
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
});
