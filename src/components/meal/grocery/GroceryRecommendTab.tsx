import { useRef, useState } from 'react'
import dorakcrewBannerImg from '../images/dorak_happy.svg'
import { RECOMMEND_ITEMS } from './groceryData'
import type { RecommendItem } from './groceryTypes'

type Props = {
  onAddItem: (item: RecommendItem) => void
}

type Bubble = {
  id: number
  image: string
  sx: number
  sy: number
  ex: number
  ey: number
  flying: boolean
}

let nextId = 0

function GroceryRecommendTab({ onAddItem }: Props) {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const addedIds = useRef<Set<number>>(new Set())

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>, item: RecommendItem) => {
    const btnRect = e.currentTarget.getBoundingClientRect()
    const tabEl = document.querySelector('[data-tab="shopping"]')
    if (!tabEl) { onAddItem(item); return }
    const tabRect = tabEl.getBoundingClientRect()

    const id = ++nextId
    const bubble: Bubble = {
      id,
      image: item.image,
      sx: btnRect.left + btnRect.width / 2,
      sy: btnRect.top + btnRect.height / 2,
      ex: tabRect.left + tabRect.width / 2,
      ey: tabRect.top + tabRect.height / 2,
      flying: false,
    }

    setBubbles(prev => [...prev, bubble])

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setBubbles(prev => prev.map(b => b.id === id ? { ...b, flying: true } : b))
      })
    })

    setTimeout(() => {
      if (!addedIds.current.has(id)) {
        addedIds.current.add(id)
        onAddItem(item)
      }
      setBubbles(prev => prev.filter(b => b.id !== id))
    }, 600)
  }

  return (
    <div className="gp-tab-content">
      <div className="gp-rec-banner">
        <img src={dorakcrewBannerImg} alt="" className="gp-rec-banner-img" />
        <p className="gp-rec-banner-text">
          저장한 레시피에 필요한 재료예요
        </p>
      </div>

      <div className="gp-rec-list">
        {RECOMMEND_ITEMS.map((item) => (
          <div key={item.id} className="gp-rec-item">
            <img src={item.image} alt={item.name} className="gp-rec-img" />
            <div className="gp-rec-info">
              <span className="gp-rec-name">{item.name}</span>
              <span className="gp-rec-recipes">{item.recipes}</span>
            </div>
            <button className="gp-rec-add-btn" onClick={(e) => handleAdd(e, item)}>
              <svg width="30" height="30" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 13.5C10.5899 13.5 13.5 10.5899 13.5 7C13.5 3.41015 10.5899 0.5 7 0.5C3.41015 0.5 0.5 3.41015 0.5 7C0.5 10.5899 3.41015 13.5 7 13.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 4V10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 7H10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {bubbles.map(b => (
        <div
          key={b.id}
          className={`gp-fly-bubble${b.flying ? ' gp-fly-bubble--flying' : ''}`}
          style={{
            '--sx': `${b.sx}px`,
            '--sy': `${b.sy}px`,
            '--ex': `${b.ex}px`,
            '--ey': `${b.ey}px`,
          } as React.CSSProperties}
        >
          <img src={b.image} alt="" />
        </div>
      ))}
    </div>
  )
}

export default GroceryRecommendTab
