"use client";
import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "green" | "red" | "blue" | "gray" | "yellow";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = "green",
  disabled = false,
  className = "",

  ...props
}: ButtonProps) {
  const baseClassName = "p-2 rounded-sm text-neutral-100 cursor-pointer";

  const variantClasses = {
    green: "bg-emerald-600 hover:bg-emerald-800",
    red: "bg-red-600 hover:bg-red-800",
    blue: "bg-blue-600 hover:bg-blue-800",
    gray: "bg-gray-500 hover:bg-gray-700",
    yellow: "bg-yellow-600 hover:bg-yellow-800",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed hover:bg-current" : "";

  const combinedClassName = [baseClassName, variantClasses[variant], disabledClasses, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={combinedClassName}
      disabled={disabled}
      {...props}>
      {children}
    </button>
  );
}
