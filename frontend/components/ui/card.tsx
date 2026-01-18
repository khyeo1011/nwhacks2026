import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Pixel RPG Bulletin Board Card
 * Applied Fonts: 
 * - Heading: Jacquard 12 (--font-heading)
 * - Body: Jersey 10 (--font-body)
 */

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "relative bg-[#f4dcb3] text-[#3e2723] flex flex-col overflow-visible",
        "border-[4px] border-black",
        "shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)]",
        "data-[size=default]:gap-4 data-[size=default]:py-6",
        "data-[size=sm]:gap-2 data-[size=sm]:py-4",
        className
      )}
      style={{ 
        imageRendering: "pixelated",
        boxShadow: "6px 6px 0px 0px rgba(0,0,0,0.4), inset -4px -4px 0px 0px rgba(0,0,0,0.1)"
      }}
      {...props}
    >
      {/* Visual Pushpin Decor */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#d32f2f] border-[3px] border-black z-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]" />
      
      {/* Paper Corner Fold */}
      <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#d7ba8d] border-l-[4px] border-t-[4px] border-black" />
      
      {props.children}
    </div>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "px-6 group-data-[size=sm]/card:px-4 grid gap-1 relative",
        "border-b-[4px] border-black/10 pb-4 mb-2",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-4xl leading-none tracking-wide group-data-[size=sm]/card:text-2xl",
        className
      )}
      style={{ fontFamily: "var(--font-heading)" }}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-xl leading-none opacity-90", className)}
      style={{ fontFamily: "var(--font-body)" }}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        "bg-[#5d4037] text-[#f4dcb3] p-2 border-[3px] border-black active:translate-y-1 active:shadow-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
        className
      )}
      style={{ fontFamily: "var(--font-body)" }}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-6 group-data-[size=sm]/card:px-4 text-2xl leading-tight",
        className
      )}
      style={{ fontFamily: "var(--font-body)" }}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "mt-auto px-6 py-2 group-data-[size=sm]/card:px-4 flex items-center justify-between text-lg",
        className
      )}
      style={{ fontFamily: "var(--font-body)" }}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}