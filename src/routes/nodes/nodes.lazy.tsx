import { NodesPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/nodes")({
  component: NodesPage,
});
