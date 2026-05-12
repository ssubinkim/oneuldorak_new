import type { InputHTMLAttributes } from 'react'
import FieldLabel from './FieldLabel'
import './WriteFormCommon.css'

type WriteTextFieldProps = {
  label: string
} & InputHTMLAttributes<HTMLInputElement>

function WriteTextField({ label, ...inputProps }: WriteTextFieldProps) {
  return (
    <div className="community-write-field">
      <FieldLabel>{label}</FieldLabel>
      <input type="text" {...inputProps} />
    </div>
  )
}

export default WriteTextField
