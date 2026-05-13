import { useEffect, useState } from 'react'
import { readGroceryShoppingItems, saveGroceryShoppingItems } from '../../common/aiDataHub'
import BottomNav from '../../common/layout/BottomNav'
import GroceryHeader from './GroceryHeader'
import GroceryRecommendTab from './GroceryRecommendTab'
import GroceryShoppingTab from './GroceryShoppingTab'
import GroceryStorageTab from './GroceryStorageTab'
import GroceryTabs from './GroceryTabs'
import { INITIAL_ITEMS, TAB_TITLES } from './groceryData'
import type { GroceryTab, ShoppingItem } from './groceryTypes'

type GroceryScreenProps = {
  onBack: () => void
}

function GroceryScreen({ onBack }: GroceryScreenProps) {
  const [activeTab, setActiveTab] = useState<GroceryTab>('shopping')
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => readGroceryShoppingItems(INITIAL_ITEMS))
  const checkedShoppingCount = shoppingItems.filter((item) => item.checked).length

  useEffect(() => {
    saveGroceryShoppingItems(shoppingItems)
  }, [shoppingItems])

  return (
    <div className="app-shell">
      <div className="app-screen gp-screen">
        <div className="gp-scroll">
          <GroceryHeader title={TAB_TITLES[activeTab]} onBack={onBack} />

          <div className="gp-content">
            <GroceryTabs
              activeTab={activeTab}
              checkedShoppingCount={checkedShoppingCount}
              onTabChange={setActiveTab}
            />

            {activeTab === 'shopping' && (
              <GroceryShoppingTab items={shoppingItems} setItems={setShoppingItems} />
            )}
            {activeTab === 'storage' && <GroceryStorageTab />}
            {activeTab === 'recommend' && <GroceryRecommendTab />}
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  )
}

export default GroceryScreen
