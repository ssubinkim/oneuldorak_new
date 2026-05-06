import type { ButtonHTMLAttributes } from 'react'
import './CommunityWriteButton.css'

type CommunityWriteButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

function CommunityWriteButton({
  className = '',
  type = 'button',
  'aria-label': ariaLabel = '글쓰기',
  ...buttonProps
}: CommunityWriteButtonProps) {
  const buttonClassName = ['community-write-button', className].filter(Boolean).join(' ')

  return (
    <button
      className={buttonClassName}
      type={type}
      aria-label={ariaLabel}
      {...buttonProps}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 19.5h4.2L19 9.1l-4.2-4.2L4.5 15.3v4.2Z" />
        <path d="M12.8 6.9 17 11.1" />
      </svg>
    </button>
  )
}

export default CommunityWriteButton
