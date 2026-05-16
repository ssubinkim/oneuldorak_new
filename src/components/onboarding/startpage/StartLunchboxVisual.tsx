import { useEffect, useState } from 'react'
import openingGif from '../images/opening04.gif'
import openingWebm from '../images/opening01.webm'
import './StartLunchboxVisual.css'

const OPENING_DURATION = 3910

type StartLunchboxVisualProps = {
  onEnded?: () => void
}

function StartLunchboxVisual({ onEnded }: StartLunchboxVisualProps) {
  const [useGifFallback, setUseGifFallback] = useState(false)
  const [isGifReady, setIsGifReady] = useState(false)

  useEffect(() => {
    if (!onEnded || !useGifFallback || !isGifReady) return
    const timer = window.setTimeout(onEnded, OPENING_DURATION)
    return () => clearTimeout(timer)
  }, [isGifReady, onEnded, useGifFallback])

  return (
    <div className="start-lunchbox-visual" aria-hidden="true">
      {useGifFallback ? (
        <img
          className="start-lunchbox-visual__video"
          src={openingGif}
          alt=""
          loading="eager"
          decoding="sync"
          onLoad={() => setIsGifReady(true)}
          onError={() => setIsGifReady(true)}
        />
      ) : (
        <video
          className="start-lunchbox-visual__video"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={() => onEnded?.()}
          onError={() => setUseGifFallback(true)}
        >
          <source src={openingWebm} type="video/webm" />
        </video>
      )}
    </div>
  )
}

export default StartLunchboxVisual
