import { useEffect, useRef, useState } from 'react'
import WriteTopIcon from './WriteTopIcon'
import './WriteFormCommon.css'
import './WriteSelectRow.css'

type WriteSelectRowProps = {
  label: string
  value: string
  options: string[]
  placeholder?: string
  onChange: (value: string) => void
}

function WriteSelectRow({ label, value, options, placeholder = '선택해주세요.', onChange }: WriteSelectRowProps) {
  const [isOpen, setIsOpen] = useState(false)
  const rowRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rowRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  useEffect(() => {
    if (!isOpen || !rowRef.current) return

    const el = rowRef.current
    window.setTimeout(() => {
      const scrollable = el.closest('.page-scroll') ?? document.documentElement
      const elBottom = el.getBoundingClientRect().bottom
      const containerBottom = scrollable === document.documentElement
        ? window.innerHeight
        : scrollable.getBoundingClientRect().bottom
      const gap = containerBottom - elBottom - 16
      if (gap < 200) {
        scrollable.scrollBy({ top: 200 - gap, behavior: 'smooth' })
      }
    }, 50)
  }, [isOpen])

  const handleSelect = (option: string) => {
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div className="community-write-select-row" ref={rowRef}>
      <span>{label}</span>
      <div className="community-write-select-field">
        <button
          type="button"
          className={`community-write-select-control${isOpen ? ' is-open' : ''}${value ? '' : ' is-placeholder'}`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onClick={() => setIsOpen((prevOpen) => !prevOpen)}
        >
          <span>{value || placeholder}</span>
          <WriteTopIcon kind="chevron" />
        </button>

        {isOpen && (
          <div className="community-write-select-menu" role="listbox">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                className={value === option ? 'is-selected' : undefined}
                role="option"
                aria-selected={value === option}
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WriteSelectRow
