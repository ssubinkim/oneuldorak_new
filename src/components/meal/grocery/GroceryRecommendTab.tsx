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
        <p className="gp-rec-banner-text">
          저장한 레시피 기반으로<br />필요한 재료를 추천해요 !
        </p>
        <img src={dorakcrewBannerImg} alt="" className="gp-rec-banner-img" />
      </div>

      <div className="gp-rec-list">
        {RECOMMEND_ITEMS.map((item) => (
          <div key={item.id} className="gp-rec-item">
            <img src={item.image} alt={item.name} className="gp-rec-img" />
            <div className="gp-rec-info">
              <span className="gp-rec-name">{item.name}</span>
              <span className="gp-rec-recipes">{item.recipes}</span>
            </div>
            <button className="gp-rec-add-btn" onClick={(e) => handleAdd(e, item)}>+</button>
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
