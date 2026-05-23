import GroceryScreen from '../../components/meal/grocery/GroceryScreen'
import '../../styles/Tailwind.css'
import './GroceryPage.css'

type Props = { onBack?: () => void }

function GroceryPage({ onBack }: Props) {
  const fromHome = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('from') === 'home'
  const handleBack = onBack ?? (() => { window.location.hash = fromHome ? '#/home' : '#/meal' })

  return <GroceryScreen onBack={handleBack} />
}

export default GroceryPage
