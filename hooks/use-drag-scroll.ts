"use client"

import { useRef, useState, useEffect } from "react"

export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // Usar refs para valores mutaveis para evitar stale closures
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseDown = (e: MouseEvent) => {
      // Ignorar se clicar em botoes ou elementos interativos
      const target = e.target as HTMLElement
      if (target.closest('button, a, input, select, [role="button"]')) {
        return
      }
      
      isDraggingRef.current = true
      setIsDragging(true)
      startXRef.current = e.pageX - element.offsetLeft
      scrollLeftRef.current = element.scrollLeft
      element.style.cursor = "grabbing"
      element.style.userSelect = "none"
    }

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      setIsDragging(false)
      element.style.cursor = "grab"
      element.style.removeProperty("user-select")
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      e.preventDefault()
      const x = e.pageX - element.offsetLeft
      const walk = (x - startXRef.current) * 1.5
      element.scrollLeft = scrollLeftRef.current - walk
    }

    const handleMouseLeave = () => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      setIsDragging(false)
      element.style.cursor = "grab"
      element.style.removeProperty("user-select")
    }

    // Define cursor inicial
    element.style.cursor = "grab"

    element.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mousemove", handleMouseMove)
    element.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      element.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return { ref, isDragging }
}
