import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
  fixed?: boolean; // new prop for fixed width/height
  loading?: boolean; // loading state
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  fixed = false,
  loading = false,
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500",
    secondary: "bg-dark-700 hover:bg-dark-600 text-white focus:ring-dark-500",
    outline:
      "border border-dark-600 hover:bg-dark-800 text-white focus:ring-dark-500",
    ghost:
      "hover:bg-dark-800 text-gray-300 hover:text-white focus:ring-dark-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "w-8 h-8 p-0", // for pagination and icon buttons
  };

  // If fixed, always use w-10 h-10 for perfect square
  const fixedClasses = fixed ? "w-8 h-8 p-0" : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fixedClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      <span className="flex items-center justify-center w-full h-full">
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </span>
    </button>
  );
};
