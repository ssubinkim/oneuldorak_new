import { useState } from 'react'
import BottomNav from '../../components/common/layout/BottomNav'
import MenuAddSheet from '../../components/meal/dashboard/MenuAddSheet'
import BudgetCard from '../../components/home/BudgetCard'
import PlannerSection from '../../components/home/PlannerSection'
import TodayRecipeSection from '../../components/home/TodayRecipeSection'
import FridgeSection from '../../components/home/FridgeSection'
import type { DayMenu } from '../../components/meal/mealData'
import logoImg from '../../assets/logos/logo.svg'
import bellIcon from '../../assets/icons/bell_icon.svg'
import mascotGroupImg from '../../assets/food_mascot_all/dorak19.svg'
import '../../styles/Tailwind.css'
import './Meal.css'

const BUDGET = { current: 72000, target: 100000, saved: 54400 }

function Meal() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [, setPlannedMenus] = useState<Record<number, DayMenu>>({})

  const handleMenuAdd = (dayIndices: number[], menu: DayMenu) => {
    setPlannedMenus(prev => {
      const next = { ...prev }
      dayIndices.forEach(i => { next[i] = menu })
      return next
    })
  }

  return (
    <div className="app-shell">
      <div className="app-screen meal-screen">
        <div className="meal-scroll">

          {/* ── 히어로 (노란 배경) ─────────────────── */}
          <div className="meal-hero">
            <div className="meal-hero__top">
              <img src={logoImg} alt="오늘도락" className="meal-hero__logo" />
              <button className="meal-hero__bell" aria-label="알림" disabled>
                <img src={bellIcon} alt="" width="22" height="22" />
              </button>
            </div>

            <div className="meal-hero__body">
              <div className="meal-hero__greeting">
                <p className="meal-hero__name"><strong>도시락러버</strong> 님</p>
                <p className="meal-hero__sub">오늘도 맛있는 절약을 시작해보세요</p>
              </div>
              <img
                src={mascotGroupImg}
                alt=""
                className="meal-hero__mascot"
                aria-hidden="true"
              />
            </div>

            <BudgetCard
              current={BUDGET.current}
              target={BUDGET.target}
              savedAmount={BUDGET.saved}
            />
          </div>

          {/* ── 콘텐츠 영역 (흰 배경) ──────────────── */}
          <div className="meal-content">
            <PlannerSection onDirectSelect={() => setIsSheetOpen(true)} />
            <TodayRecipeSection />
            <FridgeSection />
          </div>

        </div>

        <BottomNav />
        <MenuAddSheet
          open={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          onMenuAdd={handleMenuAdd}
        />
      </div>
    </div>
  )
}

export default Meal
