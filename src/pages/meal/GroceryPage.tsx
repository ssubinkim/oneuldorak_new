import GroceryScreen from '../../components/meal/grocery/GroceryScreen'
import '../../styles/Tailwind.css'
import './GroceryPage.css'

type Props = { onBack?: () => void }

function GroceryPage({ onBack }: Props) {
  const handleBack = onBack ?? (() => { window.location.hash = '#/meal' })

  return <GroceryScreen onBack={handleBack} />
}

export default GroceryPage
