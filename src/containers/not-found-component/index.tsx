import type { FC } from "react";

import type { NotFoundRouteProps } from "@tanstack/react-router";

export const NotFoundComponent: FC<NotFoundRouteProps> = () => {
  return <h1>Not Found</h1>;
};
