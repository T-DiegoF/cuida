"use client";

interface LogoProps {
  iconOnly?: boolean;
  light?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { icon: 28, text: 18 },
  md: { icon: 36, text: 22 },
  lg: { icon: 52, text: 32 },
};

export default function Logo({
  iconOnly = false,
  light = false,
  size = "md",
  className = "",
}: LogoProps) {
  const { icon: iconSize, text: textSize } = sizeMap[size];
  const primaryColor = light ? "#FFFFFF" : "#1A6B5A";
  const accentColor = light ? "#FFFFFF" : "#F4845F";
  const textColor = light ? "#FFFFFF" : "#1C2B27";

  return (
    <span
      className={`inline-flex items-center gap-2 group ${className}`}
      aria-label="Cuida"
    >
      {/* Icon: two hands cupping upward forming a heart, with pulse line */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="group-hover:animate-pulse-heart transition-transform duration-200"
        aria-hidden="true"
      >
        {/* Left hand / left side of heart */}
        <path
          d="M10 30 C8 26, 6 20, 10 16 C12.5 13 16 13.5 18 16 C19 17.5 19.5 19 19.5 21"
          stroke={primaryColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Right hand / right side of heart */}
        <path
          d="M38 30 C40 26, 42 20, 38 16 C35.5 13 32 13.5 30 16 C29 17.5 28.5 19 28.5 21"
          stroke={primaryColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Heart body — hands cupping upward */}
        <path
          d="M10 30 C10 34, 13 37, 17 39.5 C20 41.5 22.5 42.5 24 43 C25.5 42.5 28 41.5 31 39.5 C35 37 38 34 38 30 L28.5 21 C27.5 23.5 26 25.5 24 27 C22 25.5 20.5 23.5 19.5 21 Z"
          fill={primaryColor}
          opacity="0.12"
          stroke={primaryColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Pulse / heartbeat line transitioning into a gentle curve inside */}
        <path
          d="M15 26 L18.5 26 L20.5 21.5 L23 29.5 L25.5 23 L27 26 L33 26"
          stroke={accentColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Small teal dot accent at top center (replaces i-dot personality) */}
        <circle cx="24" cy="10" r="3" fill={accentColor} opacity="0.9" />
        {/* Subtle connecting line from dot to heart top */}
        <path
          d="M24 13 C24 15, 24 17, 24 18"
          stroke={primaryColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>

      {/* Wordmark */}
      {!iconOnly && (
        <span
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: textSize,
            letterSpacing: "-0.02em",
            color: textColor,
            fontWeight: 600,
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          cuida
        </span>
      )}
    </span>
  );
}
