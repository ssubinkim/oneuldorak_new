import { useState } from 'react'
import BottomNav from '../../components/common/BottomNav'
import Header from '../../components/common/Header'
import TopTabBar from '../../components/meal/TopTabBar'
import WeekDaySelector from '../../components/meal/WeekDaySelector'
import MenuTabSwitch from '../../components/meal/MenuTabSwitch'
import TodayMenuList from '../../components/meal/TodayMenuList'
import WeeklyMenuList from '../../components/meal/WeeklyMenuList'
import AiChatFab from '../../components/meal/AiChatFab'
import MealPage from './MealPage'
import '../../styles/Tailwind.css'
import './Meal.css'

function Meal() {
  const [topTab, setTopTab] = useState<'week' | 'storage'>('week')
  const [menuTab, setMenuTab] = useState<'today' | 'weekly'>('today')
  const [selectedDay, setSelectedDay] = useState(7)
  const [calOpen, setCalOpen] = useState(false)
  const [fabOpen, setFabOpen] = useState(false)

  return (
    <div className="app-shell">
      <div className="app-screen">
        <Header />

        <div className="page-scroll">
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
                {menuTab === 'today' ? <TodayMenuList /> : <WeeklyMenuList />}
              </div>
            </>
          ) : (
            <MealPage />
          )}
        </div>

        <AiChatFab fabOpen={fabOpen} setFabOpen={setFabOpen} />
        <BottomNav />
      </div>
    </div>
  )
}

export default Meal
