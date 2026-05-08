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
import dorakcrewImg from './images/dorakcrew.svg'
import '../../styles/Tailwind.css'
import './Meal.css'

function Meal() {
  const [topTab, setTopTab] = useState<'week' | 'storage'>('week')
  const [menuTab, setMenuTab] = useState<'today' | 'weekly'>('today')
  const [selectedDay, setSelectedDay] = useState(1)
  const [calOpen, setCalOpen] = useState(false)

  return (
    <div className="app-shell">
      <div className="app-screen">
        <Header />

        <div className="page-scroll meal-bg">
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

              <div
                className="chatbot-banner"
                onClick={() => { window.location.hash = '#/chatbot' }}
              >
                <div className="chatbot-banner-text">
                  <p className="chatbot-banner-title">도락이에게 물어봐요!</p>
                  <p className="chatbot-banner-sub">AI 챗봇으로 메뉴 추천받기 →</p>
                </div>
                <img className="chatbot-banner-img" src={dorakcrewImg} alt="도락크루" />
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
