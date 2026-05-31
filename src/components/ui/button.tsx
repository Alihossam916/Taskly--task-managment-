import React from "react";

interface ButtonProp {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button({
  children,
  variant = "primary",
  onClick,
}: ButtonProp) {
  const styles = "w-32 px-4 py-2 font-semibold transition-all cursor-pointer";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-container",
    secondary: "bg-background text-primary hover:bg-surface-highest",
    ghost: " text-slate-2",
  };

  return (
    <button onClick={onClick} className={`${styles} ${variants[variant]}`}>
      {children}
    </button>
  );
}
