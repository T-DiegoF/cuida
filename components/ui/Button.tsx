import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-primary text-white
    hover:bg-primary-light
    focus-visible:ring-primary
    disabled:hover:bg-primary
  `,
  secondary: `
    bg-transparent text-primary
    border border-[#D6E8E3]
    hover:border-primary hover:bg-[#E6F4F1]
    focus-visible:ring-primary
  `,
  danger: `
    bg-accent text-white
    hover:bg-[#E8704F]
    focus-visible:ring-accent
    disabled:hover:bg-accent
  `,
  ghost: `
    bg-transparent text-text-muted
    hover:text-text-main hover:bg-surface
    focus-visible:ring-primary
  `,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3.5 text-base rounded-xl gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        {...props}
        className={`
          inline-flex items-center justify-center font-semibold
          transition-all duration-200
          active:scale-[0.97]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
      >
        {loading && <Loader2 size={size === "sm" ? 12 : 15} className="animate-spin flex-shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
