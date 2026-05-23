import GroceryScreen from '../../components/meal/grocery/GroceryScreen'
import type { GroceryTab } from '../../components/meal/grocery/groceryTypes'
import '../../styles/Tailwind.css'
import './GroceryPage.css'

type Props = { onBack?: () => void }

function GroceryPage({ onBack }: Props) {
  const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const fromHome = params.get('from') === 'home'
  const initialTab = (params.get('tab') as GroceryTab) || 'recommend'
  const handleBack = onBack ?? (() => { window.location.hash = fromHome ? '#/home' : '#/meal' })

  return <GroceryScreen onBack={handleBack} initialTab={initialTab} />
}

export default GroceryPage
