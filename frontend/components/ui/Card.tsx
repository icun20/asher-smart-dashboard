import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6 md:p-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: CardProps) {
  return (
    <h3
      className={cn(
        "text-xl font-bold leading-none tracking-tight font-heading",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("p-6 md:p-8 pt-0 md:pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardDescription({ className, children, ...props }: CardProps) {
  return (
    <p
      className={cn("text-sm text-slate-500", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn("flex items-center p-6 md:p-8 pt-0 md:pt-0", className)}
      {...props}
    >
      {children}
    </div>
  );
}
