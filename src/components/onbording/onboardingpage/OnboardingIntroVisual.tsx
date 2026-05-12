import customInfoImage from '../images/custom_info.png'
import './OnboardingIntroVisual.css'

function OnboardingIntroVisual() {
  return (
    <div className="onboarding-intro-visual" aria-hidden="true">
      <img src={customInfoImage} alt="" />
    </div>
  )
}

export default OnboardingIntroVisual
