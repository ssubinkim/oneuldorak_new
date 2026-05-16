import { useEffect, useState } from 'react'
import dorakRewardImage from './images/dorak10.png'
import votePointImage from './images/community_vote_point.png'
import './VoteCompleteModal.css'

const AUTO_CLOSE_DELAY_MS = 2000

const preloadImage = async (src: string) => {
  if (typeof window === 'undefined') return

  const image = new Image()
  image.decoding = 'async'
  image.src = src

  if (!image.complete) {
    await new Promise<void>((resolve) => {
      image.onload = () => resolve()
      image.onerror = () => resolve()
    })
  }

  if (typeof image.decode === 'function') {
    try {
      await image.decode()
    } catch {
      // decode can fail for cross-browser reasons even when image is usable.
    }
  }
}

const voteModalVisualReadyPromise = Promise.all([
  preloadImage(votePointImage),
  preloadImage(dorakRewardImage),
]).then(() => undefined)

type VoteCompleteModalProps = {
  isOpen: boolean
  question: string
  selectedOption: string
  reward?: string
  onClose: () => void
}

function VoteCompleteModal({
  isOpen,
  question,
  selectedOption,
  reward,
  onClose,
}: VoteCompleteModalProps) {
  const [isVisualReady, setIsVisualReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    void voteModalVisualReadyPromise.then(() => {
      if (isMounted) {
        setIsVisualReady(true)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!isOpen || !isVisualReady) {
      return undefined
    }

    const closeTimer = window.setTimeout(onClose, AUTO_CLOSE_DELAY_MS)

    return () => window.clearTimeout(closeTimer)
  }, [isOpen, isVisualReady, onClose])

  if (!isOpen) {
    return null
  }

  const rewardText = reward?.replace('+', '').replace(/p$/i, 'P') ?? '1P'

  return (
    <div
      className={`vote-complete-modal${isVisualReady ? ' vote-complete-modal--visual-ready' : ''}`}
      role="presentation"
      onClick={onClose}
    >
      <section
        className="vote-complete-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vote-complete-modal-title"
        aria-describedby="vote-complete-modal-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="vote-complete-modal__visual" aria-hidden="true">
          <img
            className="vote-complete-modal__burst"
            src={votePointImage}
            alt=""
            loading="eager"
            decoding="async"
          />
          <div className="vote-complete-modal__sparks">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <img
            className="vote-complete-modal__image"
            src={dorakRewardImage}
            alt=""
            loading="eager"
            decoding="async"
          />
        </div>
        <h2 id="vote-complete-modal-title">{rewardText} 적립 완료!</h2>
        <p id="vote-complete-modal-description">다른 투표도 참여해보세요</p>
        <p className="vote-complete-modal__sr-only">
          {question} 투표에서 {selectedOption} 항목을 선택했습니다.
        </p>
      </section>
    </div>
  )
}

export default VoteCompleteModal
