import customInfoImage from '../images/custom_info.png'
import './OnboardingIntroVisual.css'

function OnboardingIntroVisual() {
  return (
    <div className="onboarding-intro-visual" aria-hidden="true">
      <img src={customInfoImage} alt="" loading="eager" decoding="async" />
    </div>
  )
}

export default OnboardingIntroVisual
