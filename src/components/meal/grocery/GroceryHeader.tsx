import dorakcrewImg from '../images/dorak_walk.svg'
import { BackIcon } from './GroceryIcons'

type GroceryHeaderProps = {
  title: string
  onBack: () => void
}

function GroceryHeader({ title, onBack }: GroceryHeaderProps) {
  return (
    <div className="gp-header">
      <button className="gp-back-btn" onClick={onBack} aria-label="뒤로가기">
        <BackIcon />
      </button>
      <span className="gp-header-title">{title}</span>
      <img src={dorakcrewImg} alt="" className="gp-header-crew" />
    </div>
  )
}

export default GroceryHeader
