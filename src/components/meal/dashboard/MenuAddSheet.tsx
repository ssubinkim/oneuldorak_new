import { useState } from 'react'
import { createPortal } from 'react-dom'
import { weeklyMenuData } from '../mealData'
import carrotMascotImg from './images/addmenu_1.svg'
import submitMascotImg from './images/addmenu_2.svg'
import './MenuAddSheet.css'

const menuItems = weeklyMenuData.filter(m => m.image !== null)

type Props = {
  open: boolean
  onClose: () => void
}

export default function MenuAddSheet({ open, onClose }: Props) {
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number | null>(null)
  const [selectedDays, setSelectedDays] = useState<number[]>([])

  const toggleDay = (index: number) => {
    setSelectedDays(prev =>
      prev.includes(index) ? prev.filter(d => d !== index) : [...prev, index]
    )
  }

  const handleAdd = () => {
    onClose()
    setSelectedMenuIndex(null)
    setSelectedDays([])
  }

  const target = document.querySelector('.app-screen') ?? document.body

  return createPortal(
    <>
      <div className={`menu-add-overlay${open ? ' open' : ''}`} onClick={onClose} />
      <div className={`menu-add-sheet${open ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="메뉴 추가하기">
        <div className="menu-add-sheet__header">
          <img className="menu-add-sheet__mascot" src={carrotMascotImg} alt="" aria-hidden="true" />
          <span className="menu-add-sheet__title">메뉴선택하기</span>
          <button className="menu-add-sheet__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <section className="menu-add-section">
          <h3 className="menu-add-label">메뉴선택</h3>
          <div className="menu-add-scroll">
            {menuItems.map((menu, i) => (
              <button
                key={i}
                className={`menu-add-card${selectedMenuIndex === i ? ' selected' : ''}`}
                onClick={() => setSelectedMenuIndex(prev => prev === i ? null : i)}
                aria-label={menu.name}
                aria-pressed={selectedMenuIndex === i}
              >
                <img className="menu-add-card__img" src={menu.image!} alt="" />
                <span className="menu-add-card__name">{menu.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="menu-add-section">
          <h3 className="menu-add-label">
            요일 선택하기 <span className="menu-add-label__sub">(중복 선택 가능)</span>
          </h3>
          <div className="menu-add-days">
            {weeklyMenuData.map((d, i) => {
              const isSelected = selectedDays.includes(i)
              const isRegistered = false
              return (
                <button
                  key={i}
                  className="menu-add-day"
                  onClick={() => toggleDay(i)}
                  aria-pressed={isSelected}
                  aria-label={`${d.day}요일 ${isRegistered ? '등록됨' : '비어있음'}`}
                >
                  <span className={`menu-add-day__circle${isSelected ? ' selected' : isRegistered ? ' registered' : ''}`}>
                    {d.day}
                    {(isSelected || isRegistered) && <span className="menu-add-day__check">✓</span>}
                  </span>
                  <span className="menu-add-day__label">
                    {isRegistered ? '등록됨' : '비어있음'}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <button
          className="menu-add-submit"
          onClick={handleAdd}
          disabled={selectedMenuIndex === null || selectedDays.length === 0}
        >
          <img className="menu-add-submit__mascot" src={submitMascotImg} alt="" aria-hidden="true" />
          메뉴 추가하기{selectedDays.length > 0 ? ` (${selectedDays.length})` : ''}
        </button>
      </div>
    </>,
    target
  )
}
