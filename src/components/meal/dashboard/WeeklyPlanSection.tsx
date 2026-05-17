import { weeklyMenuData } from '../mealData'
import type { DayMenu } from '../mealData'
import './WeeklyPlanSection.css'

const TODAY_DATE = 1

type Props = {
  plannedMenus?: Record<number, DayMenu>
}

function WeeklyPlanSection({ plannedMenus = {} }: Props) {
  return (
    <section className="wps-section">
      <div className="wps-scroll">
        {weeklyMenuData.map((menu, index) => {
          const isToday = menu.date === TODAY_DATE
          const planned = plannedMenus[index]
          return (
            <div
              key={menu.day}
              className={`wps-card${isToday ? ' wps-card--today' : ''}`}
            >
              <span className="wps-card-date">
                {menu.month}/{menu.date} {menu.day}
              </span>

              {planned ? (
                <>
                  <img
                    src={planned.image!}
                    alt={planned.name}
                    className="wps-card-menu-img"
                  />
                  <span className="wps-card-name wps-card-name--planned">{planned.name}</span>
                </>
              ) : (
                <>
                  <span className="wps-card-name">메뉴 추가</span>
                  <button className="wps-card-add-btn" aria-label="메뉴 추가">
                    <span className="wps-card-add">+</span>
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default WeeklyPlanSection
