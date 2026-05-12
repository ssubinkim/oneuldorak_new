import BottomNav from '../../components/common/layout/BottomNav'
import Header from '../../components/common/layout/Header'
import TodayMenuList from '../../components/meal/dashboard/TodayMenuList'
import WeeklyPlanSection from '../../components/meal/dashboard/WeeklyPlanSection'
import IngredientSection from '../../components/meal/dashboard/IngredientSection'
import RecipeCarousel from '../../components/meal/dashboard/RecipeCarousel'
import ChatBotbtn from '../../components/chatbot/ChatBotbtn'
import mydorakLogo from '../../components/meal/images/mydorak_logo.svg'
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

        <Header />

        <div className="meal-scroll">
          <div className="meal-grad">

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

            <div className="meal-dashboard">
              <div className="dash-today-wrap">
                <TodayMenuList selectedDay={1} />
              </div>
              <WeeklyPlanSection onMore={() => { window.location.hash = '#/meal-weekly-plan' }} />
              <IngredientSection
                onAddIngredient={() => { window.location.hash = '#/meal-grocery' }}
                onShowAll={() => { window.location.hash = '#/meal-storage' }}
              />
              <RecipeCarousel />
            </div>

          </div>
        </div>

        <ChatBotbtn />
        <BottomNav />
      </div>
    </div>
  )
}

export default Meal
