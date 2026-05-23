import { useRef, useState, useCallback, type PointerEvent } from 'react'
import { getIngredientIconClassName } from '../../mealData'
import { STATUS_INDEX, FRIDGE_ITEMS } from './storageData'
import type { FridgeItem } from './storageData'
import twoAddImg from '../../../../assets/food_mascot/two_add.png'

const SECTIONS = [
  { status: 'urgent',   label: '임박 재료 !', bg: '#FFF0EE' },
  { status: 'moderate', label: '소진 추천',   bg: '#FFFBEA' },
  { status: 'plenty',   label: '여유 있음',   bg: '#F0F7EC' },
] as const

const ITEMS_PER_PAGE = 4

type SectionStatus = 'urgent' | 'moderate' | 'plenty'

type SectionRowProps = {
  title: string
  items: FridgeItem[]
  bg: string
  status: SectionStatus
}

function StorageSectionRow({ title, items, bg, status }: SectionRowProps) {
  const pageCount = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE))
  const [activeDot, setActiveDot] = useState(0)
  const rowRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ isDragging: false, startX: 0, scrollLeft: 0 })

  const handleScroll = useCallback(() => {
    const el = rowRef.current
    if (!el) return
    const page = Math.round(el.scrollLeft / el.clientWidth)
    setActiveDot(Math.min(page, pageCount - 1))
  }, [pageCount])

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = rowRef.current
    if (!el) return
    dragRef.current = { isDragging: true, startX: e.clientX, scrollLeft: el.scrollLeft }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDragging) return
    const el = rowRef.current
    if (!el) return
    el.scrollLeft = dragRef.current.scrollLeft - (e.clientX - dragRef.current.startX)
  }

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    dragRef.current.isDragging = false
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  const pages = Array.from({ length: pageCount }, (_, i) =>
    items.slice(i * ITEMS_PER_PAGE, i * ITEMS_PER_PAGE + ITEMS_PER_PAGE)
  )

  return (
    <div className={`sp-section sp-section--${status}`} style={{ background: bg }}>
      <div className="sp-section-header">
        <span className="sp-section-title">{title}</span>
        <span className="sp-section-count">{items.length}개 있음</span>
      </div>

      <div
        className="sp-section-row"
        ref={rowRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {pages.map((page, pageIdx) => (
          <div key={pageIdx} className="sp-section-page">
            {page.map((item) => (
              <StorageSectionCard key={item.id} item={item} />
            ))}
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="sp-section-dots">
          {Array.from({ length: pageCount }).map((_, i) => (
            <span
              key={i}
              className={`sp-section-dot${i === activeDot ? ' sp-section-dot--active' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

type StorageSectionCardProps = {
  item: FridgeItem
}

function StorageSectionCard({ item }: StorageSectionCardProps) {
  const daysLabel = item.days !== null ? `${item.days}일 남음` : '넉넉해요'
  const indexImg = STATUS_INDEX[item.status]

  return (
    <div className="sp-section-card">
      <img src={indexImg} alt="" className="sp-fridge-index" />
      <div className="sp-section-card__img-wrap">
        {item.isEmoji ? (
          <span className="sp-section-card__emoji">{item.image}</span>
        ) : (
          <img
            src={item.image}
            alt={item.name}
            className={`sp-section-card__img ${getIngredientIconClassName(item.image)}`}
          />
        )}
      </div>
      <span className="sp-section-card__name">{item.name}</span>
      <span className="sp-section-card__days">{daysLabel}</span>
    </div>
  )
}

function StorageIngredientGrid() {
  return (
    <>
      <div className="sp-add-section">
        <button className="sp-add-btn" aria-label="재료 추가">
          <img src={twoAddImg} alt="재료 추가" className="sp-add-btn__img" />
        </button>
      </div>
      <div className="sp-sections">
        {SECTIONS.map((section) => {
          const items = FRIDGE_ITEMS.filter((item) => item.status === section.status)
          return (
            <StorageSectionRow
              key={section.status}
              status={section.status}
              title={section.label}
              items={items}
              bg={section.bg}
            />
          )
        })}
      </div>
    </>
  )
}

export default StorageIngredientGrid
