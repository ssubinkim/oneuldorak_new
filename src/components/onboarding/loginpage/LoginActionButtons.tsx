import { useEffect, useRef, useState } from 'react'
import './LoginActionButtons.css'

function LoginActionButtons() {
  const [isSignupPressed, setIsSignupPressed] = useState(false)
  const navigateTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (navigateTimerRef.current !== null) {
        window.clearTimeout(navigateTimerRef.current)
      }
    }
  }, [])

  const handleSignupClick = () => {
    setIsSignupPressed(true)

    if (navigateTimerRef.current !== null) {
      window.clearTimeout(navigateTimerRef.current)
    }

    navigateTimerRef.current = window.setTimeout(() => {
      window.location.hash = '#/signup'
    }, 90)
  }

  return (
    <div className="login-action-buttons">
      <button className="login-action-buttons__button login-action-buttons__button--primary" type="submit">
        로그인
      </button>
      <button
        className={`login-action-buttons__button login-action-buttons__button--secondary${isSignupPressed ? ' is-pressed' : ''}`}
        type="button"
        onPointerDown={() => setIsSignupPressed(true)}
        onPointerUp={() => setIsSignupPressed(false)}
        onPointerCancel={() => setIsSignupPressed(false)}
        onPointerLeave={() => setIsSignupPressed(false)}
        onClick={handleSignupClick}
      >
        회원가입
      </button>
    </div>
  )
}

export default LoginActionButtons
