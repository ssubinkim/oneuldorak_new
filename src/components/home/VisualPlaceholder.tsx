import { LunchIcon } from './LunchIcon'

export function VisualPlaceholder({ large = false }: { large?: boolean }) {
  return (
    <div className={large ? 'visual-placeholder visual-placeholder--large' : 'visual-placeholder'}>
      <LunchIcon />
    </div>
  )
}
