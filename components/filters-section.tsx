"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FiltersSectionProps {
  children: React.ReactNode
  defaultOpen?: boolean
  title?: string
}

export function FiltersSection({ children, defaultOpen = false, title = "Filtros" }: FiltersSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors rounded-t-lg">
            <span className="font-semibold text-sm">{title}</span>
            <ChevronDown className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
