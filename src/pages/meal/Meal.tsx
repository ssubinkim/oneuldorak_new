import { useState } from 'react'
import BottomNav from '../../components/common/layout/BottomNav'
import Header from '../../components/common/layout/Header'
import TopTabBar from '../../components/meal/common/TopTabBar'
import WeekDaySelector from '../../components/meal/WeekDaySelector'
import MenuTabSwitch from '../../components/meal/MenuTabSwitch'
import TodayMenuList from '../../components/meal/TodayMenuList'
import WeeklyMenuList from '../../components/meal/WeeklyMenuList'
import ChatBotbtn from '../chatbot/ChatBotbtn'
import MealPage from './MealPage'
import mydorakLogo from './images/mydorak_logo.svg'
import '../../styles/Tailwind.css'
import './Meal.css'

function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function Meal() {
  const [topTab, setTopTab] = useState<'week' | 'storage'>('week')
  const [menuTab, setMenuTab] = useState<'today' | 'weekly'>('today')
  const [selectedDay, setSelectedDay] = useState(1)
  const [calOpen, setCalOpen] = useState(false)

  return (
    <div className="app-shell">
      <div className="app-screen meal-screen">
        <div className="meal-hero">
          <Header />
          <div className="meal-hero-inner">
            <div className="meal-hero-top">
              <div className="meal-brand">
                <img src={mydorakLogo} alt="마이도락 로고" className="meal-brand-logo" />
                <span className="meal-brand-name">마이도락</span>
              </div>
              <button className="meal-bell-btn">
                <BellIcon />
              </button>
            </div>
            <p className="meal-tagline">
              세아님, 냉장고 재료로<br />이런 메뉴를 만들 수 있어요 !
            </p>
          </div>
        </div>

        <div className="meal-content">
          <TopTabBar topTab={topTab} setTopTab={setTopTab} />

          {topTab === 'week' ? (
            <>
              <WeekDaySelector
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                calOpen={calOpen}
                setCalOpen={setCalOpen}
              />
              <MenuTabSwitch menuTab={menuTab} setMenuTab={setMenuTab} />
              <div className="menu-list-container">
                {menuTab === 'today'
                  ? <TodayMenuList selectedDay={selectedDay} />
                  : <WeeklyMenuList selectedDay={selectedDay} />
                }
              </div>
            </>
          ) : (
            <MealPage />
          )}
        </div>

        <ChatBotbtn />
        <BottomNav />
      </div>
    </div>
  )
}

export default Meal
