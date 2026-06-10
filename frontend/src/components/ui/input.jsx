import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-[44px] w-full rounded-[6px] border border-bento-border-light bg-bento-card-sunken px-[14px] text-sm text-bento-text font-normal placeholder:text-bento-text-muted focus:border-bento-text-muted focus:outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 shadow-bento-sunken",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
