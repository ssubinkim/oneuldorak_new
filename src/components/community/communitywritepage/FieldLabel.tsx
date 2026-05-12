import type { ReactNode } from 'react'
import './FieldLabel.css'

type FieldLabelProps = {
  children: ReactNode
}

function FieldLabel({ children }: FieldLabelProps) {
  return <label className="community-write-label">{children}</label>
}

export default FieldLabel
