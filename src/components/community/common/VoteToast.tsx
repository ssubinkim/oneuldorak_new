import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './VoteToast.css'

const HIDE_DELAY_MS = 1800
const REMOVE_DELAY_MS = 2000

type VoteToastProps = {
  message: string | null
  onDismiss: () => void
}

function VoteToast({ message, onDismiss }: VoteToastProps) {
  const [isHiding, setIsHiding] = useState(false)

  useEffect(() => {
    if (!message) {
      setIsHiding(false)
      return
    }

    const hideTimer = window.setTimeout(() => setIsHiding(true), HIDE_DELAY_MS)
    const removeTimer = window.setTimeout(onDismiss, REMOVE_DELAY_MS)

    return () => {
      window.clearTimeout(hideTimer)
      window.clearTimeout(removeTimer)
    }
  }, [message, onDismiss])

  if (!message) {
    return null
  }

  return createPortal(
    <div className={`vote-toast${isHiding ? ' vote-toast--hiding' : ''}`} role="status" aria-live="polite">
      {message}
    </div>,
    document.body
  )
}

export default VoteToast
