import { useEffect, useState } from 'react'
import openingGif from '../images/opening05.gif'
import './StartLunchboxVisual.css'

const OPENING_DURATION = 3500

type StartLunchboxVisualProps = {
  onEnded?: () => void
}

function StartLunchboxVisual({ onEnded }: StartLunchboxVisualProps) {
  const [isGifReady, setIsGifReady] = useState(false)

  useEffect(() => {
    if (!onEnded || !isGifReady) return
    const timer = window.setTimeout(onEnded, OPENING_DURATION)
    return () => clearTimeout(timer)
  }, [isGifReady, onEnded])

  return (
    <div className="start-lunchbox-visual" aria-hidden="true">
      <img
        className="start-lunchbox-visual__video"
        src={openingGif}
        alt=""
        loading="eager"
        decoding="sync"
        onLoad={() => setIsGifReady(true)}
        onError={() => setIsGifReady(true)}
      />
    </div>
  )
}

export default StartLunchboxVisual
