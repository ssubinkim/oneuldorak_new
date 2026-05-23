import BottomNav from '../../../common/layout/BottomNav'
import StorageFridgeStatusCard from './StorageFridgeStatusCard'
import StorageHeader from './StorageHeader'
import StorageIngredientGrid from './StorageIngredientGrid'
import {
  FRIDGE_TOTAL,
  MENU_COUNT,
} from './storageData'

type StorageScreenProps = {
  onBack: () => void
}

function StorageScreen({ onBack }: StorageScreenProps) {
  return (
    <div className="app-shell sp-app-shell">
      <div className="app-screen sp-screen">
        <div className="sp-scroll">
          <StorageHeader onBack={onBack} />
          <StorageFridgeStatusCard
            total={FRIDGE_TOTAL}
            menuCount={MENU_COUNT}
          />
          <StorageIngredientGrid />
        </div>

        <BottomNav />
      </div>
    </div>
  )
}

export default StorageScreen
