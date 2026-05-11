import BottomNav from '../../components/common/layout/BottomNav'
import Header from '../../components/common/layout/Header'
import TodayMenuList from '../../components/meal/TodayMenuList'
import WeeklyPlanSection from '../../components/meal/WeeklyPlanSection'
import IngredientSection from '../../components/meal/IngredientSection'
import RecipeCarousel from '../../components/meal/RecipeCarousel'
import ChatBotbtn from '../chatbot/ChatBotbtn'
import mydorakLogo from './images/mydorak_logo.svg'
import '../../styles/Tailwind.css'
import './Meal.css'

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function Meal() {
  return (
    <div className="app-shell">
      <div className="app-screen meal-screen">

        {/* ── 옐로우 히어로 헤더 ── */}
        <div className="meal-hero">
          <Header />
          <div className="meal-hero-inner">
            <div className="meal-hero-top">
              <div className="meal-brand">
                <img src={mydorakLogo} alt="마이도락 로고" className="meal-brand-logo" />
                <span className="meal-brand-name">마이도락</span>
              </div>
              <button className="meal-bell-btn" aria-label="알림">
                <BellIcon />
              </button>
            </div>
            <p className="meal-tagline">
              냉장고 재료로<br />맛있는 메뉴를 추천해드려요 !
            </p>
          </div>
        </div>

        {/* ── 대시보드 스크롤 영역 ── */}
        <div className="meal-dashboard">

          {/* 1. 오늘의 메뉴 — 타이틀은 카드 내부에 포함 */}
          <div className="dash-today-wrap">
            <TodayMenuList selectedDay={1} />
          </div>

          {/* 2. 이번주 도시락 계획 */}
          <WeeklyPlanSection />

          {/* 3. 냉장고 재료 모아보기 */}
          <IngredientSection />

          {/* 4. 내 재료로 만들 수 있는 메뉴 */}
          <RecipeCarousel />

        </div>

        <ChatBotbtn />
        <BottomNav />
      </div>
    </div>
  )
}

export default Meal
