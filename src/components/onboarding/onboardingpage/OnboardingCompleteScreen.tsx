import dorakCompleteImage from '../images/dorak8.png'
import './OnboardingCompleteScreen.css'

function OnboardingCompleteScreen() {
  return (
    <section className="onboarding-complete-screen" aria-label="온보딩 완료">
      <div className="onboarding-complete-screen__content">
        <img src={dorakCompleteImage} alt="도시락과 함께 웃고 있는 도락 캐릭터들" loading="eager" decoding="async" />
      </div>
    </section>
  )
}

export default OnboardingCompleteScreen
