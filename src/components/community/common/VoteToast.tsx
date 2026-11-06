import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './VoteToast.css'

const REMOVE_DELAY_MS = 2000

type VoteToastProps = {
  message: string | null
  onDismiss: () => void
}

function VoteToast({ message, onDismiss }: VoteToastProps) {
  useEffect(() => {
    if (!message) return
    const removeTimer = window.setTimeout(onDismiss, REMOVE_DELAY_MS)

    return () => {
      window.clearTimeout(removeTimer)
    }
  }, [message, onDismiss])

  if (!message) {
    return null
  }

  const screen = document.querySelector('.app-screen')
  if (!screen) return null

  return createPortal(
    <div key={message} className="vote-toast" role="status" aria-live="polite">
      {message}
    </div>,
    screen
  )
}

export default VoteToast
