import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition";

  const variants = {
    primary: "bg-[#CF8750] text-white hover:opacity-90",
    secondary: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}