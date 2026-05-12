import dorakcrewImg from '../../images/dorak_walk.svg'
import { BackIcon } from './WeeklyPlanIcons'

type WeeklyPlanHeaderProps = {
  onBack: () => void
}

function WeeklyPlanHeader({ onBack }: WeeklyPlanHeaderProps) {
  return (
    <div className="wpp-header">
      <button className="wpp-back-btn" onClick={onBack} aria-label="뒤로가기">
        <BackIcon />
      </button>
      <span className="wpp-header-title">이번주 도시락 계획</span>
      <img src={dorakcrewImg} alt="" className="wpp-header-crew" />
    </div>
  )
}

export default WeeklyPlanHeader
