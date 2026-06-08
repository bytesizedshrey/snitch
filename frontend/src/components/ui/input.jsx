import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-[44px] w-full rounded-[6px] border border-[#1e1e1e] bg-[#0f0f0f] px-[14px] text-sm text-primary font-normal placeholder:text-[#444444] focus:border-[#333333] focus:outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)", ...props.style }}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
