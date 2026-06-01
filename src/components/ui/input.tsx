import React, { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "primary" | "error";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "primary", className, ...props }, ref) => {
    const styles =
      "w-full px-4 py-4 sm:py-2 font-medium rounded-xl sm:rounded-sm transition-all outline-none";
    const variants = {
      primary:
        "bg-[#D7E2FF] text-[#6B7280] focus:ring-2 focus:ring-primary-container",
      error: "bg-[#FFDAD6] text-[#93000A] focus:ring-2 focus:ring-error",
    };

    return (
      <input
        ref={ref}
        className={`${styles} ${variants[variant]} placeholder:text-[#6B7280] ${className || ""}`}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
export default Input;
