import type { InputHTMLAttributes } from 'react'
import WriteTopIcon from './WriteTopIcon'
import './WriteFormCommon.css'

type WriteInlineInputRowProps = {
  label: string
  addLabel: string
  onAdd?: () => void
} & InputHTMLAttributes<HTMLInputElement>

function WriteInlineInputRow({ label, addLabel, onAdd, ...inputProps }: WriteInlineInputRowProps) {
  return (
    <div className="community-write-inline-row">
      <span>{label}</span>
      <input type="text" {...inputProps} />
      <button type="button" aria-label={addLabel} onClick={onAdd}>
        <WriteTopIcon kind="plus" />
      </button>
    </div>
  )
}

export default WriteInlineInputRow
