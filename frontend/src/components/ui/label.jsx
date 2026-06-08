import * as React from "react"
import { cn } from "../../lib/utils"

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant select-none",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
