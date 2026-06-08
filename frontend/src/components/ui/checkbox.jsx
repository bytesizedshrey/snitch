import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "../../lib/utils"

const Checkbox = React.forwardRef(({ className, checked, onChange, ...props }, ref) => (
  <div className="relative flex items-center">
    <input
      type="checkbox"
      ref={ref}
      checked={checked}
      onChange={onChange}
      className={cn(
        "peer appearance-none w-[16px] h-[16px] shrink-0 border border-[#1e1e1e] bg-[#0f0f0f] rounded-[4px] checked:bg-primary checked:border-primary transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#333333] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)" }}
      {...props}
    />
    <Check 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#111111] h-3 w-3 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" 
      strokeWidth={3}
    />
  </div>
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
