import dorakcrewImg from '../images/dorak_walk.svg'
import { BackIcon } from './GroceryIcons'
import type { GroceryTab } from './groceryTypes'

type GroceryHeaderProps = {
  onBack: () => void
  activeTab: GroceryTab
}

function GroceryHeader({ onBack, activeTab }: GroceryHeaderProps) {
  return (
    <div className="gp-header">
      <button className="gp-back-btn" onClick={onBack} aria-label="뒤로가기">
        <BackIcon />
      </button>
      {activeTab !== 'recommend' && (
        <img src={dorakcrewImg} alt="" className="gp-header-crew" />
      )}
    </div>
  )
}

export default GroceryHeader
