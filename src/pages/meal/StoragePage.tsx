import StorageScreen from '../../components/meal/storage/page/StorageScreen'
import '../../styles/Tailwind.css'
import './StoragePage.css'

type Props = { onBack?: () => void }

function StoragePage({ onBack }: Props) {
  const handleBack = onBack ?? (() => { window.location.hash = '#/meal' })

  return <StorageScreen onBack={handleBack} />
}

export default StoragePage
