import type { ComponentProps } from "react";
import * as React from "react";

import { mdiDotsHorizontal } from "@mdi/js";
import { chevronIcon, cn } from "@utils";
import { cva } from "class-variance-authority";

import { Button } from "../button";
import { Icon } from "../icon";

const paginationButtonVariants = cva(
  "flex items-center gap-2 cursor-pointer outline-none min-w-fit relative rounded-md disabled:pointer-events-none",
  {
    variants: {
      variant: {
        active:
          "bg-primary hover:bg-primary-hover focus:bg-primary-dark disabled:bg-primary-disabled text-foreground-inverse px-3 py-1",
        default:
          "bg-background-default hover:bg-background-subtle focus:bg-background-surface text-foreground-primary px-3 py-1",
      },
    },
    defaultVariants: { variant: "active" },
  }
);

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("flex justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("flex flex-row items-center gap-1", className)} {...props} />;
}

function PaginationItem({ ...props }: ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  isArrow?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({ className, isArrow, isActive, ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        paginationButtonVariants({ variant: !isArrow && isActive ? "active" : "default" }),
        isArrow && "text-icon-disabled",
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({ className, isActive, ...props }: ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      isArrow
      aria-label="Go to previous page"
      size="small"
      className={cn("bg-none px-0.5 hover:bg-background-default", !isActive && "pointer-events-none", className)}
      {...props}
    >
      <Icon name={chevronIcon} />
    </PaginationLink>
  );
}

function PaginationNext({ className, isActive, ...props }: ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      isArrow
      aria-label="Go to next page"
      size="small"
      className={cn("gap-1 px-2.5 sm:pr-2.5", !isActive && "pointer-events-none", className)}
      {...props}
    >
      <Icon name={chevronIcon} className="rotate-180" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <Icon name={mdiDotsHorizontal} className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
