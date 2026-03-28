"use client";

import { useEffect, useRef, useState } from "react";

interface ProgressBarProps {
  value: number; // 0–100
  label?: string;
  showPercent?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export default function ProgressBar({
  value,
  label,
  showPercent = true,
  size = "md",
  className = "",
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const trackHeight = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div ref={ref} className={`flex flex-col gap-1.5 ${className}`}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="text-text-muted font-medium">{label}</span>}
          {showPercent && (
            <span className="text-text-main font-semibold ml-auto">
              {clampedValue}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${trackHeight} rounded-full bg-[#D6E8E3] overflow-hidden`}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full relative overflow-hidden transition-[width] duration-[1200ms] ease-out"
          style={{
            width: animated ? `${clampedValue}%` : "0%",
            background:
              "linear-gradient(90deg, #1A6B5A 0%, #2D9E87 85%, #F4845F 100%)",
          }}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
