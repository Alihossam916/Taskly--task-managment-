import React, { forwardRef, TextareaHTMLAttributes } from "react";

interface TextareaProp extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "primary" | "error";
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProp>(
  ({ variant = "primary", className, ...props }, ref) => {
    const styles = "h-37.5 p-4 rounded-sm transition-all outline-none";
    const variants = {
      primary:
        "bg-[#D7E2FF] text-[#6B7280] focus:ring-2 focus:ring-primary-container",
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
