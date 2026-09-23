import { ReactNode } from "react";

export interface BadgeProps {
  variant?: "success" | "warning" | "error" | "info" | "default" | "danger";
  children: ReactNode;
  className?: string;
}

export function Badge({
  variant = "info",
  className = "",
  children,
}: BadgeProps) {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  const variantClasses = {
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-slate-100 text-slate-800",
    default: "bg-slate-100 text-slate-800",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant] || variantClasses.info} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;