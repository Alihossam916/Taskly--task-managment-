import React, { forwardRef, TextareaHTMLAttributes } from "react";

interface TextareaProp extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "primary" | "secondary" | "error";
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProp>(
  ({ variant = "primary", className, ...props }, ref) => {
    const styles = "h-37.5 p-4 rounded-sm transition-all outline-none";
    const variants = {
      primary:
        "bg-[#D7E2FF] text-black focus:ring-2 focus:ring-primary-container",
      secondary:
        "bg-none text-slate-2 focus:border-b border-slate-2",

      error: "bg-[#FFDAD6] text-[#93000A] focus:ring-2 focus:ring-error",
    };

    return (
      <textarea
        ref={ref}
        className={`${styles} ${variants[variant]} placeholder:text-[#6B7280] ${className || ""}`}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
