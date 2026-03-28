import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Disable the hover lift animation (e.g. for static info cards) */
  noHover?: boolean;
  /** Extra padding preset: "sm" | "md" (default) | "lg" */
  padding?: "sm" | "md" | "lg";
}

const paddingMap = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6 md:p-8",
};

export default function Card({
  children,
  noHover = false,
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={`
        bg-white rounded-2xl
        transition-all duration-200
        ${noHover ? "" : "hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(26,107,90,0.15)]"}
        ${paddingMap[padding]}
        ${className}
      `}
      style={{
        boxShadow: "0 4px 24px rgba(26,107,90,0.08)",
        ...props.style,
      }}
    >
      {children}
    </div>
  );
}
