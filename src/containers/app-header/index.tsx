import { type ReactNode } from "react";

import { Link } from "@tanstack/react-router";
import { Button, Icon, Typography } from "@ui-kit";
import { arrowLeftIcon, cn } from "@utils";

export interface AppHeaderProps {
  backUrl?: string;
  title?: string;
  description?: string;
  Tabs?: ReactNode;
  AdditionalContent?: ReactNode;
  SecondaryButton?: ReactNode;
  MainButton?: ReactNode;
}

export function AppHeader(props: AppHeaderProps) {
  const { title, backUrl, description, Tabs, AdditionalContent, SecondaryButton, MainButton } = props;

  return (
    <header
      className={cn(
        "flex h-[56px] w-full flex-row items-center justify-between rounded-tl-2xl border-b border-stroke-default bg-background-subtle px-4"
      )}
    >
      <div className={cn("flex items-center gap-2")}>
        <div className={cn("flex items-center gap-2")}>
          {backUrl ? (
            <Link to={backUrl}>
              <Button variant="ghost" size="iconSmall" asChild>
                <Icon name={arrowLeftIcon} className="text-icon-default" />
              </Button>
            </Link>
          ) : null}

          <div className={cn("flex min-w-fit flex-col pr-4", Tabs && "border-r border-stroke-default")}>
            {title ? (
              <Typography variant="heading-3" color="primary">
                {title}
              </Typography>
            ) : null}

            {description ? (
              <Typography variant="body-sm" color="secondary">
                {description}
              </Typography>
            ) : null}
          </div>
        </div>

        {Tabs && Tabs}
      </div>

      <div className={cn("flex items-center gap-4")}>
        {AdditionalContent}
        {SecondaryButton}
        {MainButton}
      </div>
    </header>
  );
}
