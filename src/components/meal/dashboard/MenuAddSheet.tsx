import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { readGroceryShoppingItems, saveGroceryShoppingItems } from '../../common/aiDataHub'
import { INITIAL_ITEMS } from '../grocery/groceryData'
import type { ShoppingItem } from '../grocery/groceryTypes'
import { weeklyMenuData } from '../mealData'
import type { DayMenu, MenuIngredient } from '../mealData'
import carrotMascotImg from './images/addmenu_1.svg'
import submitMascotImg from './images/addmenu_2.svg'
import './MenuAddSheet.css'

const menuItems = weeklyMenuData.filter(m => m.image !== null)

type FlyingItem = {
  image: string
  startX: number
  startY: number
  dx: number
  dy: number
  animating: boolean
  ingredient: MenuIngredient
}

type Props = {
  open: boolean
  onClose: () => void
  onMenuAdd?: (dayIndices: number[], menu: DayMenu) => void
}

export default function MenuAddSheet({ open, onClose, onMenuAdd }: Props) {
  const [selectedMenuIndex, setSelectedMenuIndex] = useState<number | null>(null)
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() =>
    readGroceryShoppingItems(INITIAL_ITEMS)
  )
  const [flyingItem, setFlyingItem] = useState<FlyingItem | null>(null)
  const groceryLinkRef = useRef<HTMLButtonElement>(null)
  const [portalTarget, setPortalTarget] = useState<Element>(document.body)

  useEffect(() => {
    const el = document.querySelector('.app-screen')
    if (el) setPortalTarget(el)
  }, [])

  useEffect(() => {
    if (!flyingItem || flyingItem.animating) return
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFlyingItem(prev => prev ? { ...prev, animating: true } : null)
      })
    })
    return () => cancelAnimationFrame(id)
  }, [flyingItem])

  const isInShoppingList = (name: string) =>
    shoppingItems.some(item => item.name === name)

  const addToShoppingList = (ingredient: MenuIngredient) => {
    if (isInShoppingList(ingredient.name)) return
    const newId = shoppingItems.reduce((max, item) => Math.max(max, item.id), 0) + 1
    const newItem: ShoppingItem = {
      id: newId,
      name: ingredient.name,
      image: ingredient.image,
      checked: false,
    }
    const updated = [...shoppingItems, newItem]
    setShoppingItems(updated)
    saveGroceryShoppingItems(updated)
  }

  const handleIngredientAdd = (ingredient: MenuIngredient, e: React.MouseEvent<HTMLButtonElement>) => {
    const btnRect = e.currentTarget.getBoundingClientRect()
    const linkRect = groceryLinkRef.current?.getBoundingClientRect()
    const container = document.querySelector('.app-screen') ?? document.body
    const containerRect = container.getBoundingClientRect()

    if (!linkRect) {
      addToShoppingList(ingredient)
      return
    }

    const startX = btnRect.left - containerRect.left + btnRect.width / 2
    const startY = btnRect.top - containerRect.top + btnRect.height / 2
    const endX = linkRect.left - containerRect.left + linkRect.width / 2
    const endY = linkRect.top - containerRect.top + linkRect.height / 2

    setFlyingItem({
      image: ingredient.image,
      startX,
      startY,
      dx: endX - startX,
      dy: endY - startY,
      animating: false,
      ingredient,
    })
  }

  const handleFlyEnd = (e: React.TransitionEvent) => {
    if (e.propertyName !== 'opacity') return
    if (flyingItem) {
      addToShoppingList(flyingItem.ingredient)
      setFlyingItem(null)
    }
  }

  const toggleDay = (index: number) => {
    setSelectedDays(prev =>
      prev.includes(index) ? prev.filter(d => d !== index) : [...prev, index]
    )
  }

  const handleAdd = () => {
    if (selectedMenuIndex !== null) {
      onMenuAdd?.(selectedDays, menuItems[selectedMenuIndex])
    }
    onClose()
    setSelectedMenuIndex(null)
    setSelectedDays([])
  }

  return createPortal(
    <>
      <div className={`menu-add-overlay${open ? ' open' : ''}`} onClick={onClose} />
      <div className={`menu-add-sheet${open ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="메뉴 추가하기">
        <div className="menu-add-sheet__header">
          <img className="menu-add-sheet__mascot" src={carrotMascotImg} alt="" aria-hidden="true" />
          <span className="menu-add-sheet__title">메뉴선택하기</span>
          <button className="menu-add-sheet__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <section className="menu-add-section menu-add-section--menu">
          <h3 className="menu-add-label">메뉴</h3>
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

        {selectedMenuIndex !== null && menuItems[selectedMenuIndex].ingredients.length > 0 && (
          <section className="menu-add-section">
            <div className="menu-add-label-row">
              <h3 className="menu-add-label">필요한 재료</h3>
              <button
                ref={groceryLinkRef}
                className="menu-add-grocery-link"
                onClick={() => { window.location.hash = '#/meal-grocery' }}
              >
                <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                장보기 리스트
              </button>
            </div>
            <div className="menu-add-ingredients">
              {menuItems[selectedMenuIndex].ingredients.map((ingredient, i) => {
                const added = isInShoppingList(ingredient.name)
                return (
                  <div key={i} className="menu-add-ingredient">
                    <div className={`menu-add-ingredient__circle${added ? ' no-border' : ''}`}>
                      <img src={ingredient.image} alt={ingredient.name} className="menu-add-ingredient__img" />
                      {!added && (
                        <button
                          className="menu-add-ingredient__plus"
                          onClick={(e) => handleIngredientAdd(ingredient, e)}
                          aria-label={`${ingredient.name} 장보기에 추가`}
                        >
                          +
                        </button>
                      )}
                    </div>
                    <span className="menu-add-ingredient__name">{ingredient.name}</span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

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

      {flyingItem && (
        <div
          className={`menu-add-flying-item${flyingItem.animating ? ' animating' : ''}`}
          style={{
            left: flyingItem.startX,
            top: flyingItem.startY,
            '--dx': `${flyingItem.dx}px`,
            '--dy': `${flyingItem.dy}px`,
          } as React.CSSProperties}
          onTransitionEnd={handleFlyEnd}
        >
          <img src={flyingItem.image} alt="" />
        </div>
      )}
    </>,
    portalTarget
  )
}
