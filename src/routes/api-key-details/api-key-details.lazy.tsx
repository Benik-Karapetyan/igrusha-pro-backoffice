import { ApiKeyDetailsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/api-keys/$id")({
  component: ApiKeyDetailsPage,
});
