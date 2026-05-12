import { useState } from 'react'
import './LoginInputField.css'

type LoginInputFieldProps = {
  icon: 'mail' | 'lock'
  label: string
  onChange: (value: string) => void
  type: 'text' | 'password'
  value: string
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.5 6.5h15v11h-15z" />
      <path d="m5 7 7 5.6L19 7" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.5 10.5h11v9h-11z" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M2.8 12s3.4-5.5 9.2-5.5 9.2 5.5 9.2 5.5-3.4 5.5-9.2 5.5S2.8 12 2.8 12Z" />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  )
}

function LoginInputField({ icon, label, onChange, type, value }: LoginInputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && isPasswordVisible ? 'text' : type

  return (
    <label className="login-input-field">
      <span className="login-input-field__icon">{icon === 'mail' ? <MailIcon /> : <LockIcon />}</span>
      <input
        className="login-input-field__input"
        type={inputType}
        placeholder={label}
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {isPassword ? (
        <button
          className="login-input-field__toggle"
          type="button"
          aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
          onClick={() => setIsPasswordVisible((value) => !value)}
        >
          <EyeIcon />
        </button>
      ) : null}
    </label>
  )
}

export default LoginInputField
