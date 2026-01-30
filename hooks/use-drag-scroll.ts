"use client"

import { useRef, useState, useEffect, useCallback } from "react"

export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!ref.current) return
    setIsDragging(true)
    setStartX(e.pageX - ref.current.offsetLeft)
    setScrollLeft(ref.current.scrollLeft)
    ref.current.style.cursor = "grabbing"
    ref.current.style.userSelect = "none"
  }, [])

  const handleMouseUp = useCallback(() => {
    if (!ref.current) return
    setIsDragging(false)
    ref.current.style.cursor = "grab"
    ref.current.style.removeProperty("user-select")
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !ref.current) return
    e.preventDefault()
    const x = e.pageX - ref.current.offsetLeft
    const walk = (x - startX) * 1.5 // Velocidade do scroll
    ref.current.scrollLeft = scrollLeft - walk
  }, [isDragging, startX, scrollLeft])

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return
    setIsDragging(false)
    ref.current.style.cursor = "grab"
    ref.current.style.removeProperty("user-select")
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Define cursor inicial
    element.style.cursor = "grab"

    element.addEventListener("mousedown", handleMouseDown)
    element.addEventListener("mouseup", handleMouseUp)
    element.addEventListener("mousemove", handleMouseMove)
    element.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      element.removeEventListener("mousedown", handleMouseDown)
      element.removeEventListener("mouseup", handleMouseUp)
      element.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [handleMouseDown, handleMouseUp, handleMouseMove, handleMouseLeave])

  return { ref, isDragging }
}
