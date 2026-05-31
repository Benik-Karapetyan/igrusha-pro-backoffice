import { NotFoundComponent } from "@containers";
import { createRootRouteWithContext, ErrorComponent, Outlet } from "@tanstack/react-router";

export const rootRoute = createRootRouteWithContext<{ auth: boolean }>()({
  component: Outlet,
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
});
