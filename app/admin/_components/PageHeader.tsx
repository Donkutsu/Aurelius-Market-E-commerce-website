import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export function PageHeader({
  title,
  description,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "border-b border-muted pb-4 mb-6",
        className
      )}
      {...props}
    >
      {title && (
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
      )}
      {description && (
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
