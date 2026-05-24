import GroceryScreen from '../../components/meal/grocery/GroceryScreen'
import type { GroceryTab } from '../../components/meal/grocery/groceryTypes'
import '../../styles/Tailwind.css'
import './GroceryPage.css'

type Props = { onBack?: () => void }

function GroceryPage({ onBack }: Props) {
  const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const from = params.get('from')
  const initialTab = (params.get('tab') as GroceryTab) || 'recommend'
  const handleBack = onBack ?? (() => {
    if (from === 'home') window.location.hash = '#/home'
    else if (from === 'recipe') window.location.hash = '#/recipe'
    else window.location.hash = '#/meal'
  })

  return <GroceryScreen onBack={handleBack} initialTab={initialTab} />
}

export default GroceryPage
