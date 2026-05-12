import onboardingSymbolImage from '../images/onboarding_symbol.png'
import './StartLunchboxVisual.css'

type StartLunchboxVisualProps = {
  isOpen?: boolean
}

function StartLunchboxVisual({ isOpen = false }: StartLunchboxVisualProps) {
  return (
    <div
      className={`start-lunchbox-visual${isOpen ? ' start-lunchbox-visual--open' : ''}`}
      aria-hidden="true"
    >
      <img className="start-lunchbox-visual__image" src={onboardingSymbolImage} alt="" />
    </div>
  )
}

export default StartLunchboxVisual
