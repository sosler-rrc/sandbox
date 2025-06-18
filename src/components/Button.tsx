"use client";
import * as React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "green" | "red" | "blue" | "gray" | "yellow";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLButtonElement>) => void;
}

export function Button({
  children,
  variant = "green",
  type = "button",
  disabled = false,
  className = "",
  onClick,
  onFocus,
  onBlur,
  ...props
}: ButtonProps) {
  const baseClassName =
    "p-[4px] mb-2 rounded-sm text-neutral-100 cursor-pointer";

  const variantClasses = {
    green: "bg-green-600 hover:bg-green-800",
    red: "bg-red-600 hover:bg-red-800",
    blue: "bg-blue-600 hover:bg-blue-800",
    gray: "bg-gray-600 hover:bg-gray-800",
    yellow: "bg-yellow-600 hover:bg-yellow-800",
  };

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed hover:bg-current"
    : "";

  const combinedClassName = [
    baseClassName,
    variantClasses[variant],
    disabledClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={combinedClassName}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      {...props}
    >
      {children}
    </button>
  );
}
