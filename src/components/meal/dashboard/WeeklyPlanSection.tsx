import { weeklyMenuData } from '../mealData'
import './WeeklyPlanSection.css'

const TODAY_DATE = 1


function WeeklyPlanSection() {
  return (
    <section className="wps-section">
      <div className="wps-scroll">
        {weeklyMenuData.map((menu) => {
          const isToday = menu.date === TODAY_DATE
          return (
            <div
              key={menu.day}
              className={`wps-card${isToday ? ' wps-card--today' : ''}`}
            >
              <span className="wps-card-date">
                {menu.month}/{menu.date} {menu.day}
              </span>

              <span className="wps-card-name">메뉴 추가</span>

              <button className="wps-card-add-btn" aria-label="메뉴 추가">
                <span className="wps-card-add">+</span>
              </button>

            </div>
          )
        })}
      </div>
    </section>
  )
}

export default WeeklyPlanSection
