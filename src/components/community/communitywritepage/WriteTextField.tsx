import type { InputHTMLAttributes } from 'react'
import FieldLabel from './FieldLabel'
import './WriteFormCommon.css'

type WriteTextFieldProps = {
  label: string
} & InputHTMLAttributes<HTMLInputElement>

function WriteTextField({ label, ...inputProps }: WriteTextFieldProps) {
  const maxLength = typeof inputProps.maxLength === 'number' ? inputProps.maxLength : undefined
  const valueLength = getFieldValueLength(inputProps.value ?? inputProps.defaultValue)

  return (
    <div className="community-write-field">
      <FieldLabel>{label}</FieldLabel>
      <input type="text" {...inputProps} />
      {maxLength ? (
        <span className="community-write-counter">
          {valueLength} / {maxLength}
        </span>
      ) : null}
    </div>
  )
}

function getFieldValueLength(value: unknown) {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value).length
  }

  if (Array.isArray(value)) {
    return value.join('').length
  }

  return 0
}

export default WriteTextField
