import dorakCompleteImage from '../images/dorak8.png'
import './OnboardingCompleteScreen.css'

function OnboardingCompleteScreen() {
  return (
    <section className="onboarding-complete-screen" aria-label="온보딩 완료">
      <div className="onboarding-complete-screen__content">
        <img src={dorakCompleteImage} alt="도시락과 함께 웃고 있는 도락 캐릭터들" />
        <h1>
          준비 끝!
          <br />
          오늘의 도시락을 만나볼까요?
        </h1>
      </div>
    </section>
  )
}

export default OnboardingCompleteScreen
