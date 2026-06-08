import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-[6px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#333333] disabled:pointer-events-none disabled:opacity-50",
        // Default variant styling for Monolith Dark
        "bg-primary text-[#111111] hover:bg-[#f0f0f0]",
        // Default size styling for Monolith Dark
        "h-[44px] px-[14px] py-2",
        className
      )}
      style={{ boxShadow: "0 2px 8px rgba(255,255,255,0.08)", ...props.style }}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
