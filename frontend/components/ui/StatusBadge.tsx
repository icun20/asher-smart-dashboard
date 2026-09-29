import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export type StatusType = "Aman" | "Waspada" | "Bahaya";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusType;
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  let icon;
  let colorClass = "";

  switch (status) {
    case "Aman":
      icon = <CheckCircle2 className="w-4 h-4 mr-1.5" />;
      colorClass = "bg-safe text-safe-foreground";
      break;
    case "Waspada":
      icon = <AlertTriangle className="w-4 h-4 mr-1.5" />;
      colorClass = "bg-warning text-warning-foreground";
      break;
    case "Bahaya":
      icon = <XCircle className="w-4 h-4 mr-1.5" />;
      colorClass = "bg-danger text-danger-foreground";
      break;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
        colorClass,
        className
      )}
      {...props}
    >
      {icon}
      {status}
    </div>
  );
}
