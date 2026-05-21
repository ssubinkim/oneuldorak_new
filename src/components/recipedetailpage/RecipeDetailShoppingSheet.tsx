import { useEffect, useState } from 'react'
import bascatIcon from '../recipe/images/bascat.svg'
import './RecipeDetailShoppingSheet.css'

export type ShoppingSheetItem = {
  id: string
  name: string
  icon: string
}

type Props = {
  isOpen: boolean
  items: ShoppingSheetItem[]
  onClose: () => void
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.4 5.3h2.1l1.8 9.1a1.8 1.8 0 0 0 1.8 1.5h6.7a1.8 1.8 0 0 0 1.7-1.3l1.2-5.4H7.3" />
      <circle cx="10.4" cy="19.3" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17.2" cy="19.3" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function RecipeDetailShoppingSheet({ isOpen, items, onClose }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (isOpen) setSelectedIds(new Set(items.map((i) => i.id)))
  }, [isOpen, items])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const selectedCount = selectedIds.size
  const isAllSelected = items.length > 0 && selectedCount === items.length

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    setSelectedIds(isAllSelected ? new Set() : new Set(items.map((i) => i.id)))
  }

  const deleteSelected = () => {
    setSelectedIds(new Set())
  }

  return (
    <div className="rd-sheet" role="presentation" onClick={onClose}>
      <section
        className="rd-sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-label="장보기 체크리스트"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rd-sheet__tabs">
          <button type="button" className="rd-sheet__tab is-active">
            장보기
            <span className="rd-sheet__tab-badge">{items.length}</span>
          </button>
        </div>

        <div className="rd-sheet__title">
          <CartIcon />
          <h2>장보기 체크리스트</h2>
        </div>

        <div className="rd-sheet__toolbar">
          <button type="button" className="rd-sheet__select-all" onClick={toggleAll}>
            <span className={`rd-sheet__checkbox${isAllSelected ? ' is-checked' : ''}`}>
              {isAllSelected && <CheckIcon />}
            </span>
            전체선택 ({selectedCount}/{items.length})
          </button>
          <button type="button" className="rd-sheet__delete" onClick={deleteSelected}>
            상품삭제
          </button>
        </div>

        <ul className="rd-sheet__list">
          {items.map((item) => {
            const isSelected = selectedIds.has(item.id)
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`rd-sheet__item${isSelected ? ' is-checked' : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => toggleItem(item.id)}
                >
                  <span className={`rd-sheet__checkbox${isSelected ? ' is-checked' : ''}`}>
                    {isSelected && <CheckIcon />}
                  </span>
                  <span className="rd-sheet__item-name">{item.name}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <button type="button" className="rd-sheet__confirm" onClick={onClose}>
          <img src={bascatIcon} alt="" aria-hidden="true" className="rd-sheet__confirm-icon" />
          장바구니에 담기 ({selectedCount})
        </button>
      </section>
    </div>
  )
}

export default RecipeDetailShoppingSheet
