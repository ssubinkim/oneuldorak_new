import openingVideoWebm from '../images/opening01.webm'
import openingVideoMov from '../images/opening01.mov'
import './StartLunchboxVisual.css'

type StartLunchboxVisualProps = {
  onEnded?: () => void
}

function StartLunchboxVisual({ onEnded }: StartLunchboxVisualProps) {
  return (
    <div className="start-lunchbox-visual" aria-hidden="true">
      <video
        className="start-lunchbox-visual__video"
        autoPlay
        muted
        playsInline
        onEnded={onEnded}
      >
        <source src={openingVideoWebm} type="video/webm" />
        <source src={openingVideoMov} type="video/quicktime" />
      </video>
    </div>
  )
}

export default StartLunchboxVisual
