"use client"
import * as React from "react"

interface InputProps {
  type?: string
  id?: string
  name?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
}


export function Input({
  type = "text",
  id,
  name,
  placeholder,
  required = false,
  disabled = false,
  className = "",
  value,
  onChange,
  onBlur,
  onFocus,
  ...props
}: InputProps) {
  const baseClassName = "mb-4 border-[1.5px] rounded-sm border-neutral-600 p-[4px] bg-neutral-50"
  const combinedClassName = className ? `${baseClassName} ${className}` : baseClassName

  return (
    <input 
      className={combinedClassName}
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      {...props}
    />
  )
}