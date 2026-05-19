import { useEffect, useState } from 'react'
import bananaIcon from '../../../assets/images/food_icon/banana.png'
import beefIcon from '../../../assets/images/food_icon/beef.png'
import broccoliIcon from '../../../assets/images/food_icon/broccoli.png'
import chiliPepperIcon from '../../../assets/images/food_icon/chili_pepper.png'
import daikonRadishIcon from '../../../assets/images/food_icon/daikon_radish.png'
import eggIcon from '../../../assets/images/food_icon/egg.png'
import pepperIcon from '../../../assets/images/food_icon/pepper.png'
import './ShoppingChecklistBottomSheet.css'

export type ShoppingChecklistItem = {
  id: string
  name: string
  icon: string
}

export type ShoppingChecklistTab = {
  id: string
  label: string
  count?: number
}

type ShoppingChecklistBottomSheetProps = {
  isOpen: boolean
  items?: ShoppingChecklistItem[]
  tabs?: ShoppingChecklistTab[]
  title?: string
  initialSelectedIds?: string[]
  onClose: () => void
  onConfirm?: (selectedItems: ShoppingChecklistItem[]) => void
  onTabChange?: (tabId: string) => void
}

const defaultItems: ShoppingChecklistItem[] = [
  { id: 'chili', name: '고추', icon: chiliPepperIcon },
  { id: 'banana', name: '바나나', icon: bananaIcon },
  { id: 'beef', name: '소고기', icon: beefIcon },
  { id: 'pepper', name: '파프리카', icon: pepperIcon },
  { id: 'radish', name: '무', icon: daikonRadishIcon },
  { id: 'broccoli', name: '브로콜리', icon: broccoliIcon },
  { id: 'egg', name: '계란', icon: eggIcon },
]

const defaultTabs: ShoppingChecklistTab[] = [
  { id: 'shopping', label: '장보기', count: 5 },
  { id: 'storage', label: '보관함' },
  { id: 'recommend', label: '추천재료' },
]

const defaultSelectedIds = ['banana', 'beef', 'egg']

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.4 5.3h2.1l1.8 9.1a1.8 1.8 0 0 0 1.8 1.5h6.7a1.8 1.8 0 0 0 1.7-1.3l1.2-5.4H7.3" />
      <circle cx="10.4" cy="19.3" r="1.2" />
      <circle cx="17.2" cy="19.3" r="1.2" />
    </svg>
  )
}

function ShoppingChecklistBottomSheet({
  isOpen,
  items = defaultItems,
  tabs = defaultTabs,
  title = '장보기 체크리스트',
  initialSelectedIds = defaultSelectedIds,
  onClose,
  onConfirm,
  onTabChange,
}: ShoppingChecklistBottomSheetProps) {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? 'shopping')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(initialSelectedIds))

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const selectedCount = selectedIds.size
  const isAllSelected = selectedCount === items.length

  const toggleItem = (itemId: string) => {
    setSelectedIds((prevSelectedIds) => {
      const nextSelectedIds = new Set(prevSelectedIds)

      if (nextSelectedIds.has(itemId)) {
        nextSelectedIds.delete(itemId)
      } else {
        nextSelectedIds.add(itemId)
      }

      return nextSelectedIds
    })
  }

  const toggleAll = () => {
    setSelectedIds(isAllSelected ? new Set() : new Set(items.map((item) => item.id)))
  }

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId)
    onTabChange?.(tabId)
  }

  const handleConfirm = () => {
    onConfirm?.(items.filter((item) => selectedIds.has(item.id)))
    onClose()
  }

  return (
    <div className="shopping-checklist-sheet" role="presentation" onClick={onClose}>
      <section
        className="shopping-checklist-sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shopping-checklist-sheet-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shopping-checklist-sheet__tabs" role="tablist" aria-label="장보기 메뉴">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId

            return (
              <button
                type="button"
                className={isActive ? 'is-active' : undefined}
                role="tab"
                aria-selected={isActive}
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
                {typeof tab.count === 'number' && <span>{tab.count}</span>}
              </button>
            )
          })}
        </div>

        <div className="shopping-checklist-sheet__title">
          <CartIcon />
          <h2 id="shopping-checklist-sheet-title">{title}</h2>
        </div>

        <div className="shopping-checklist-sheet__toolbar">
          <button
            type="button"
            className="shopping-checklist-sheet__select-all"
            aria-pressed={isAllSelected}
            onClick={toggleAll}
          >
            <span className={isAllSelected ? 'is-selected' : undefined}>
              {isAllSelected && (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m6.3 12.3 3.5 3.5 7.9-8" />
                </svg>
              )}
            </span>
            전체선택 ({selectedCount}/{items.length})
          </button>
          <button type="button" className="shopping-checklist-sheet__delete">
            상품삭제
          </button>
        </div>

        <ul className="shopping-checklist-sheet__checklist">
          {items.map((item) => {
            const isSelected = selectedIds.has(item.id)

            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`shopping-checklist-sheet__item${isSelected ? ' is-selected' : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => toggleItem(item.id)}
                >
                  <span className="shopping-checklist-sheet__checkbox">
                    {isSelected && (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m6.3 12.3 3.5 3.5 7.9-8" />
                      </svg>
                    )}
                  </span>
                  <img src={item.icon} alt="" aria-hidden="true" />
                  <span className="shopping-checklist-sheet__item-name">{item.name}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <button type="button" className="shopping-checklist-sheet__cart-button" onClick={handleConfirm}>
          <CartIcon />
          장바구니에 담기 ({selectedCount})
        </button>
      </section>
    </div>
  )
}

export default ShoppingChecklistBottomSheet
