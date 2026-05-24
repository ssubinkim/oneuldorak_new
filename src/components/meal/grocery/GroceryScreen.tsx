import { useEffect, useState } from 'react'
import { readGroceryShoppingItems, saveGroceryShoppingItems } from '../../common/aiDataHub'
import BottomNav from '../../common/layout/BottomNav'
import GroceryHeader from './GroceryHeader'
import GroceryRecommendTab from './GroceryRecommendTab'
import GroceryShoppingTab from './GroceryShoppingTab'
import GroceryStorageTab from './GroceryStorageTab'
import GroceryTabs from './GroceryTabs'
import { INITIAL_ITEMS } from './groceryData'
import type { GroceryTab, ShoppingItem } from './groceryTypes'

type GroceryScreenProps = {
  onBack: () => void
  initialTab?: GroceryTab
}

function GroceryScreen({ onBack, initialTab = 'recommend' }: GroceryScreenProps) {
  const [activeTab, setActiveTab] = useState<GroceryTab>(initialTab)
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => readGroceryShoppingItems(INITIAL_ITEMS))
  const checkedShoppingCount = shoppingItems.length

  useEffect(() => {
    saveGroceryShoppingItems(shoppingItems)
  }, [shoppingItems])

  return (
    <div className="app-shell">
      <div className="app-screen gp-screen">
        <div className="gp-scroll">
          <GroceryHeader onBack={onBack} activeTab={activeTab} />

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
            {activeTab === 'recommend' && (
              <GroceryRecommendTab
                onAddItem={(item) =>
                  setShoppingItems(prev =>
                    prev.some(s => s.name === item.name)
                      ? prev
                      : [...prev, { id: Date.now(), name: item.name, image: item.image, checked: false }]
                  )
                }
              />
            )}
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  )
}

export default GroceryScreen
