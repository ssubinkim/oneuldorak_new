import type { InputHTMLAttributes } from 'react'
import './SearchBar.css'

type SearchBarProps = {
  id: string
  className?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'>

function SearchBar({
  id,
  className = '',
  placeholder = '검색',
  ...inputProps
}: SearchBarProps) {
  const searchBarClassName = ['search-bar', className].filter(Boolean).join(' ')

  return (
    <label className={searchBarClassName} htmlFor={id}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="6" />
        <path d="M16.2 16.2 20 20" />
      </svg>
      <input id={id} type="text" placeholder={placeholder} {...inputProps} />
    </label>
  )
}

export default SearchBar
