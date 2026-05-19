import { useEffect, useState } from 'react'
import BottomNav from '../../components/common/layout/BottomNav'
import Header from '../../components/common/layout/Header'
import TodayMenuList from '../../components/meal/dashboard/TodayMenuList'
import WeeklyPlanSection from '../../components/meal/dashboard/WeeklyPlanSection'
import IngredientSection from '../../components/meal/dashboard/IngredientSection'
import MenuAddSheet from '../../components/meal/dashboard/MenuAddSheet'
import MealGoalDonut from '../../components/meal/MealGoalDonut'
import HomeFridgeBanner from '../../components/home/HomeFridgeBanner'
import HomeStories from '../../components/home/HomeStories'
import HomeRecipeSection from '../../components/home/HomeRecipeSection'
import type { DayMenu } from '../../components/meal/mealData'
import logoImg from '../../assets/logos/logo.svg'
import bellIcon from '../../assets/icons/bell_icon.svg'
import '../../styles/Tailwind.css'
import './Meal.css'


function Meal() {
  const [plannedMenus, setPlannedMenus] = useState<Record<number, DayMenu>>({})
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [goal] = useState({ current: 72000, target: 100000 })
  const pct = Math.round((goal.current / goal.target) * 100)
  const [goalBarPct, setGoalBarPct] = useState(0)

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setGoalBarPct(pct)
    })

    return () => window.cancelAnimationFrame(animationFrame)
  }, [pct])

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

        <Header />

        <div className="meal-scroll">
          <div className="meal-grad">

            <div className="meal-hero-inner">
              <div className="meal-hero-top">
                <div className="meal-brand">
                  <img src={logoImg} alt="오늘도락" className="meal-brand-logo" />
                </div>
                <button className="meal-bell-btn" aria-label="알림" disabled>
                  <img src={bellIcon} alt="" width="22" height="22" />
                </button>
              </div>
              <div className="meal-hero-body">
                <div className="meal-tagline">
                  <p className="meal-tagline-name"><strong>도시락러버</strong> 님</p>
                  <p className="meal-tagline-sub">오늘도 맛있는<br />절약을 시작해보세요</p>
                </div>
                <MealGoalDonut pct={pct} goalBarPct={goalBarPct} />
              </div>
            </div>

            <div className="meal-dashboard">
              <div className="dash-today-wrap">
                <TodayMenuList selectedDay={1} onAddClick={() => setIsSheetOpen(true)} />
              </div>
              <IngredientSection />
              <WeeklyPlanSection plannedMenus={plannedMenus} onAddClick={() => setIsSheetOpen(true)} />
              <HomeFridgeBanner />
              <HomeStories />
              <HomeRecipeSection />
            </div>

          </div>
        </div>

        <BottomNav />
        <MenuAddSheet open={isSheetOpen} onClose={() => setIsSheetOpen(false)} onMenuAdd={handleMenuAdd} />
      </div>
    </div>
  )
}

export default Meal
