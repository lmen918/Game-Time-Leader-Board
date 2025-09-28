import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-game-primary disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-game-primary hover:bg-game-secondary text-black":
              variant === "primary",
            "bg-gray-800 hover:bg-gray-700 text-game-primary border border-gray-700":
              variant === "secondary",
            "bg-red-600 hover:bg-red-700 text-white": variant === "danger",
            "hover:bg-gray-800 text-gray-300 hover:text-white":
              variant === "ghost",
          },
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4": size === "md",
            "h-12 px-6 text-lg": size === "lg",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
