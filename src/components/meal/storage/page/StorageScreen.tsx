import { useState } from 'react'
import BottomNav from '../../../common/layout/BottomNav'
import StorageFridgeStatusCard from './StorageFridgeStatusCard'
import StorageHeader from './StorageHeader'
import StorageIngredientGrid from './StorageIngredientGrid'
import {
  FRIDGE_ITEMS,
  FRIDGE_TOTAL,
  MENU_COUNT,
  MODERATE_COUNT,
  PLENTY_COUNT,
  URGENT_COUNT,
} from './storageData'
import type { Category } from './storageData'

type StorageScreenProps = {
  onBack: () => void
}

function StorageScreen({ onBack }: StorageScreenProps) {
  const [activeFilter, setActiveFilter] = useState<Category>('전체')

  const filteredItems = activeFilter === '전체'
    ? FRIDGE_ITEMS
    : FRIDGE_ITEMS.filter((item) => item.category === activeFilter)

  return (
    <div className="app-shell">
      <div className="app-screen sp-screen">
        <div className="sp-scroll">
          <StorageHeader onBack={onBack} />
          <StorageFridgeStatusCard
            total={FRIDGE_TOTAL}
            urgentCount={URGENT_COUNT}
            moderateCount={MODERATE_COUNT}
            plentyCount={PLENTY_COUNT}
            menuCount={MENU_COUNT}
          />
          <StorageIngredientGrid
            items={filteredItems}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        <BottomNav />
      </div>
    </div>
  )
}

export default StorageScreen
