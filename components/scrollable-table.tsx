"use client"

import { useDragScroll } from "@/hooks/use-drag-scroll"
import { cn } from "@/lib/utils"

interface ScrollableTableProps {
  children: React.ReactNode
  className?: string
}

export function ScrollableTable({ children, className }: ScrollableTableProps) {
  const { ref, isDragging } = useDragScroll<HTMLDivElement>()

  return (
    <div 
      ref={ref}
      className={cn(
        "overflow-x-auto",
        isDragging && "cursor-grabbing select-none",
        !isDragging && "cursor-grab",
        className
      )}
    >
      {children}
    </div>
  )
}
