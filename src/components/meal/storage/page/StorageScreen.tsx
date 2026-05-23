import BottomNav from '../../../common/layout/BottomNav'
import StorageHeader from './StorageHeader'
import StorageIngredientGrid from './StorageIngredientGrid'

type StorageScreenProps = {
  onBack: () => void
}

function StorageScreen({ onBack }: StorageScreenProps) {
  return (
    <div className="app-shell sp-app-shell">
      <div className="app-screen sp-screen">
        <div className="sp-scroll">
          <StorageHeader onBack={onBack} />
          <StorageIngredientGrid />
        </div>

        <BottomNav />
      </div>
    </div>
  )
}

export default StorageScreen
