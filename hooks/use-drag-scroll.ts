"use client"

import { useRef, useState, useCallback, useEffect } from "react"

export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // Usar refs para valores que mudam durante o drag para evitar stale closures
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  const handleMouseDown = useCallback((e: React.MouseEvent<T>) => {
    if (!ref.current) return
    
    // Ignorar se clicar em elementos interativos
    const target = e.target as HTMLElement
    if (
      target.tagName === "BUTTON" ||
      target.tagName === "A" ||
      target.tagName === "INPUT" ||
      target.tagName === "SELECT" ||
      target.closest("button") ||
      target.closest("a") ||
      target.closest("[role='menuitem']") ||
      target.closest("[data-radix-collection-item]")
    ) {
      return
    }

    isDraggingRef.current = true
    setIsDragging(true)
    startXRef.current = e.pageX - ref.current.offsetLeft
    scrollLeftRef.current = ref.current.scrollLeft
    ref.current.style.cursor = "grabbing"
    ref.current.style.userSelect = "none"
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<T>) => {
    if (!isDraggingRef.current || !ref.current) return
    e.preventDefault()
    const x = e.pageX - ref.current.offsetLeft
    const walk = (x - startXRef.current) * 1.5 // Multiplicador para velocidade do scroll
    ref.current.scrollLeft = scrollLeftRef.current - walk
  }, [])

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false
    setIsDragging(false)
    if (ref.current) {
      ref.current.style.cursor = "grab"
      ref.current.style.userSelect = ""
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false
      setIsDragging(false)
      if (ref.current) {
        ref.current.style.cursor = "grab"
        ref.current.style.userSelect = ""
      }
    }
  }, [])

  // Configurar cursor inicial
  useEffect(() => {
    if (ref.current) {
      ref.current.style.cursor = "grab"
    }
  }, [])

  return {
    ref,
    isDragging,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
    },
  }
}
