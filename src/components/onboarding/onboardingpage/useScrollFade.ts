import { useLayoutEffect, useRef } from 'react'
import './scrollFade.css'

export function useScrollFade(itemCount: number) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    const update = () => {
      const scrollable = getComputedStyle(element).overflowY === 'auto'
      const remaining = element.scrollHeight - element.clientHeight - element.scrollTop
      element.style.setProperty('--scroll-fade-top', scrollable && element.scrollTop > 1 ? '16px' : '0px')
      element.style.setProperty('--scroll-fade-bottom', scrollable && remaining > 2 ? '16px' : '0px')
    }

    update()
    element.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(element)
    for (const child of element.children) observer.observe(child)
    return () => {
      element.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [itemCount])

  return ref
}
