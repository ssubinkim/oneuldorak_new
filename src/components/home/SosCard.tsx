import { MealOptionIcon } from './MealOptionIcon'

export function SosCard({ label }: { label: string }) {
  return (
    <button type="button" className="sos-card">
      <MealOptionIcon />
      <span>{label}</span>
    </button>
  )
}
