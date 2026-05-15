import onboardingSymbolImage from '../images/onboarding_symbol.png'
import './LoginWelcome.css'

function LoginWelcome() {
  return (
    <div className="login-welcome">
      <h1 className="login-welcome__title">
        <strong>오늘도락</strong>에 오신 것을
        <br />
        환영합니다
      </h1>

      <img className="login-welcome__image" src={onboardingSymbolImage} alt="오늘도락 캐릭터 도시락" />
    </div>
  )
}

export default LoginWelcome
