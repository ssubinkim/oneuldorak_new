import type { ButtonHTMLAttributes } from 'react'
import plusIcon from '../../../assets/icons/plus.svg'
import arrowUpIcon from '../../../assets/icons/arrow_up.svg'
import './CommunityWriteButton.css'

type ScrollButtonState = 'full' | 'compact' | 'top'

type CommunityWriteButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  scrollState?: ScrollButtonState
}

function CommunityWriteButton({
  className = '',
  type = 'button',
  scrollState = 'full',
  'aria-label': ariaLabel,
  ...buttonProps
}: CommunityWriteButtonProps) {
  const buttonClassName = ['community-write-button', `is-${scrollState}`, className].filter(Boolean).join(' ')
  const label = ariaLabel ?? (scrollState === 'top' ? '맨 위로' : '글쓰기')

  return (
    <button className={buttonClassName} type={type} aria-label={label} {...buttonProps}>
      {scrollState === 'full' && (
        <span className="community-write-button__label">
          <img src={plusIcon} alt="" aria-hidden="true" className="community-write-button__icon" />
          글쓰기
        </span>
      )}
      {scrollState === 'compact' && (
        <img src={plusIcon} alt="" aria-hidden="true" className="community-write-button__icon" />
      )}
      {scrollState === 'top' && (
        <img src={arrowUpIcon} alt="" aria-hidden="true" className="community-write-button__icon" />
      )}
    </button>
  )
}

export default CommunityWriteButton
