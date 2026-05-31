import React from "react";

interface InputProps {
  variant?: "primary" | "error";
  type: React.HTMLInputTypeAttribute;
  placeholder: string;
  value?: string;
  onChange?: React.ChangeEventHandler;
}

export default function Input({
  variant = "primary",
  type,
  placeholder,
  value,
  onChange,
}: InputProps) {
  const styles = "w-full px-4 py-2 font-medium rounded-sm transition-all outline-none";
  const variants = {
    primary: "bg-[#D7E2FF] text-[#6B7280] focus:ring-2 focus:ring-primary-container",
    error: "bg-[#FFDAD6] text-[#93000A] focus:ring-2 focus:ring-error",
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${styles} ${variants[variant]} placeholder:text-[#6B7280]`}
    />
  );
}
