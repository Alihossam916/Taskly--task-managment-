import React, { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "primary" | "error" | "secondary";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = "primary", className, ...props }, ref) => {
    const styles =
      "w-full px-4 py-4 sm:py-3 font-medium rounded-xl sm:rounded-sm transition-all outline-none";
    const variants = {
      primary:
        "bg-[#D7E2FF] text-black focus:ring-2 focus:ring-primary-container",
      secondary: "bg-none text-slate-3 focus:border-b border-slate-2",
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
