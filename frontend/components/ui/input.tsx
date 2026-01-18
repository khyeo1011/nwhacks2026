import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "bg-[#e6ccb2] border-[4px] border-black text-[#3e2723]",
        "placeholder:text-[#3e2723]/50",
        "shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.1)]",
        "focus:bg-[#f4dcb3] focus:outline-none focus:ring-0",
        "h-12 w-full px-3 text-2xl transition-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      style={{ fontFamily: "var(--font-body)", imageRendering: "pixelated" }}
      {...props}
    />
  )
}

export { Input }