import { useState, useRef } from 'react'
import './SubscriptionSection.css'
import { type Product } from './ProductCard'
import slide1 from './images/slide1.svg'

const SUB_TABS = ['전체', '도시락', '밀키트']
const PAGE_SIZE = 3

type Props = {
  products: Product[]
  onSelect?: (id: string) => void
}

function SubscriptionSection({ products, onSelect }: Props) {
  const [activeTab, setActiveTab] = useState('전체')
  const [currentPage, setCurrentPage] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const pages: Product[][] = []
  for (let i = 0; i < products.length; i += PAGE_SIZE) {
    pages.push(products.slice(i, i + PAGE_SIZE))
  }

  function goTo(index: number) {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' })
    setCurrentPage(index)
  }

  function handleScroll() {
    const el = trackRef.current
    if (!el) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    setCurrentPage(index)
  }

  return (
    <div className="subscription">
      <div className="subscription__header">
        <div>
          <p className="subscription__title">🌿 오늘도락 정기식단</p>
          <p className="subscription__desc">매주 도착하는 건강한 한 끼</p>
        </div>
        <button className="subscription__more" type="button">더보기 &gt;</button>
      </div>

      <div className="subscription__banner">
        <img className="subscription__banner-img" src={slide1} alt="정기식단 배너" />
        <div className="subscription__banner-overlay" />
        <div className="subscription__banner-text">
          <p>식단 구성 보는 전</p>
          <p>매주 새로운 도시락을</p>
          <p>간편하게 받아보세요 !</p>
        </div>
      </div>

      <div className="subscription__tabs">
        {SUB_TABS.map(tab => (
          <button
            key={tab}
            type="button"
            className={`subscription__tab${activeTab === tab ? ' subscription__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="subscription__slider" ref={trackRef} onScroll={handleScroll}>
        {pages.map((page, pi) => (
          <div key={pi} className="subscription__page">
            {page.map((p, i) => (
              <div key={`${p.id}-${i}`} className="subscription__item" onClick={() => onSelect?.(p.id)}>
                <div className="subscription__item-img-wrap">
                  {p.image && <img className="subscription__item-img" src={p.image} alt={p.name} />}
                  <button
                    className="subscription__item-cart"
                    type="button"
                    aria-label="장바구니"
                    onClick={e => e.stopPropagation()}
                  >
                    <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                  </button>
                </div>
                <div className="subscription__item-info">
                  {p.brand && <span className="subscription__item-brand">{p.brand}</span>}
                  <p className="subscription__item-name">{p.name}</p>
                  <div className="subscription__item-price-row">
                    <span className="subscription__item-price">{p.price.toLocaleString()} ₩</span>
                    {p.originalPrice && (
                      <span className="subscription__item-original-price">{p.originalPrice.toLocaleString()} ₩</span>
                    )}
                  </div>
                  {p.rating !== undefined && p.reviewCount !== 0 && (
                    <div className="subscription__item-rating">
                      <span className="subscription__item-star">★</span>
                      <span>{p.rating}</span>
                      <span className="subscription__item-review">({p.reviewCount ?? 0})</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="subscription__dots">
        {pages.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}페이지`}
            className={`subscription__dot${i === currentPage ? ' subscription__dot--active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  )
}

export default SubscriptionSection
