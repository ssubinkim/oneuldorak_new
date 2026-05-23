import StorageScreen from '../../components/meal/storage/page/StorageScreen'
import '../../styles/Tailwind.css'
import './StoragePage.css'

type Props = { onBack?: () => void }

function StoragePage({ onBack }: Props) {
  const fromHome = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('from') === 'home'
  const handleBack = onBack ?? (() => { window.location.hash = fromHome ? '#/home' : '#/meal' })

  return <StorageScreen onBack={handleBack} />
}

export default StoragePage
