import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizes = {
    sm: 16,
    md: 32,
    lg: 48,
    xl: 64,
  }

  const strokeWidth = {
    sm: 2,
    md: 2.5,
    lg: 3,
    xl: 4,
  }

  const currentSize = sizes[size]
  const currentStroke = strokeWidth[size]

  return (
    <div className={cn("inline-block", className)} role="status" aria-label="Loading">
      <svg
        width={currentSize}
        height={currentSize}
        viewBox={`0 0 ${currentSize} ${currentSize}`}
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin-linear"
        style={{ color: "var(--primary)" }}
      >
        {/* Background circle */}
        <circle
          cx={currentSize / 2}
          cy={currentSize / 2}
          r={(currentSize - currentStroke) / 2}
          fill="none"
          stroke="currentColor"
          strokeWidth={currentStroke}
          opacity="0.2"
        />
        {/* Spinning arc */}
        <circle
          cx={currentSize / 2}
          cy={currentSize / 2}
          r={(currentSize - currentStroke) / 2}
          fill="none"
          stroke="currentColor"
          strokeWidth={currentStroke}
          strokeDasharray={`${((currentSize - currentStroke) * Math.PI) / 3} ${(currentSize - currentStroke) * Math.PI}`}
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export function SpinnerDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" style={{ animationDelay: "0ms" }} />
      <div className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" style={{ animationDelay: "150ms" }} />
      <div className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" style={{ animationDelay: "300ms" }} />
    </div>
  )
}
