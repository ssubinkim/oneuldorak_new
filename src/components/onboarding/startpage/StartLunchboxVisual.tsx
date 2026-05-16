import { useEffect } from 'react'
import openingGif from '../images/opening04.gif'
import './StartLunchboxVisual.css'

const OPENING_DURATION = 3910

type StartLunchboxVisualProps = {
  onEnded?: () => void
}

function StartLunchboxVisual({ onEnded }: StartLunchboxVisualProps) {
  useEffect(() => {
    if (!onEnded) return
    const timer = setTimeout(onEnded, OPENING_DURATION)
    return () => clearTimeout(timer)
  }, [onEnded])

  return (
    <div className="start-lunchbox-visual" aria-hidden="true">
      <img
        className="start-lunchbox-visual__video"
        src={openingGif}
        alt=""
      />
    </div>
  )
}

export default StartLunchboxVisual
