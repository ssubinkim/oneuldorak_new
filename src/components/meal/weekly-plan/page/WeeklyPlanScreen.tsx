import { useState } from 'react'
import BottomNav from '../../../common/layout/BottomNav'
import { weeklyMenuData } from '../../mealData'
import WeeklyPlanCalendarModal from './WeeklyPlanCalendarModal'
import WeeklyPlanDaySelector from './WeeklyPlanDaySelector'
import WeeklyPlanHeader from './WeeklyPlanHeader'
import WeeklyPlanMenuList from './WeeklyPlanMenuList'
import WeeklyPlanMonthRow from './WeeklyPlanMonthRow'
import { MONTH, TODAY_DATE, YEAR } from './weeklyPlanConstants'

type WeeklyPlanScreenProps = {
  onBack: () => void
}

function WeeklyPlanScreen({ onBack }: WeeklyPlanScreenProps) {
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState(TODAY_DATE)

  return (
    <div className="app-shell">
      <div className="app-screen wpp-screen">
        <WeeklyPlanHeader onBack={onBack} />

        <div className="wpp-content">
          <WeeklyPlanMonthRow
            year={YEAR}
            month={MONTH}
            onOpenCalendar={() => setShowCalendar(true)}
          />
          <WeeklyPlanDaySelector menus={weeklyMenuData} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          <WeeklyPlanMenuList month={MONTH} selectedDate={selectedDate} menus={weeklyMenuData} />
        </div>

        {showCalendar && (
          <WeeklyPlanCalendarModal
            year={YEAR}
            month={MONTH}
            todayDate={TODAY_DATE}
            onClose={() => setShowCalendar(false)}
          />
        )}

        <BottomNav />
      </div>
    </div>
  )
}

export default WeeklyPlanScreen
