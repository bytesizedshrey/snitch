import * as React from "react"
import { cn } from "../../lib/utils"

const GoogleButton = React.forwardRef(({ className, href, children, ...props }, ref) => {
  return (
    <a
      href={href || "/api/auth/google"}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-[6px] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#333333] disabled:pointer-events-none disabled:opacity-50",
        "w-full h-[44px] border border-[#1e1e1e] bg-[#0f0f0f] text-[#888888] hover:text-white hover:border-[#333333] hover:bg-[#121212]",
        className
      )}
      style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)", ...props.style }}
      ref={ref}
      {...props}
    >
      <svg className="w-[16px] h-[16px] mr-2.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
      </svg>
      {children || "Continue with Google"}
    </a>
  )
})
GoogleButton.displayName = "GoogleButton"

export { GoogleButton }
