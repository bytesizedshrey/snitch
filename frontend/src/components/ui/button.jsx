import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-[8px] text-[13px] font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#333333] disabled:pointer-events-none disabled:opacity-50",
        // Base dimensions
        "h-[44px] px-[18px] py-2",
        // Theme adaptive skeuomorphic styling
        variant === "ghost" ? [
          "bg-transparent text-bento-text hover:bg-bento-card-hover",
        ] : [
          "bg-bento-card text-bento-text hover:bg-bento-card-hover border border-bento-border",
          "shadow-bento-btn",
          "active:translate-y-[2px] active:shadow-bento-btn-active"
        ],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
