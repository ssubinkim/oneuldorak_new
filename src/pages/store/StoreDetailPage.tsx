import { useState, useRef } from 'react'
import StoreDetail from '../../components/store/StoreDetail'
import { type Product } from '../../components/store/ProductCard'
import './StoreDetailPage.css'

type Props = {
  product: Product | null
  onBack: () => void
  onSelectProduct: (product: Product) => void
}

function StoreDetailPage({ product, onBack, onSelectProduct }: Props) {
  const [showTop, setShowTop] = useState(false)
  const [liked, setLiked] = useState(false)
  const scrollRef = useRef<HTMLElement>(null)

  function handleScroll() {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop
      setShowTop(scrollTop > 200)
    }
  }

  function scrollToTop() {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <main
        ref={scrollRef}
        className="page-scroll store-detail-page"
        onScroll={handleScroll}
      >
        <StoreDetail
          product={product}
          onBack={onBack}
          onSelectProduct={onSelectProduct}
          onScrollToTop={(selector) => {
            setTimeout(() => {
              const el = scrollRef.current?.querySelector(selector ?? '')
              if (el && scrollRef.current) {
                scrollRef.current.scrollTo({ top: (el as HTMLElement).offsetTop - 130, behavior: 'smooth' })
              }
            }, 0)
          }}
        />
      </main>

      {showTop && (
        <button className="store-detail-scroll-top" onClick={scrollToTop} aria-label="맨 위로">
          <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
      )}

      <div className="store-detail-action-bar store-detail-action-bar--visible">
        <button className="store-detail-action-button" type="button" aria-label="찜하기" onClick={() => setLiked(v => !v)}>
          <svg viewBox="0 0 24 24" width={20} height={20} fill={liked ? '#EF5246' : 'none'} stroke={liked ? '#EF5246' : 'currentColor'} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <button className="store-detail-action-button" type="button" aria-label="장바구니">
          <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>

        <button className="store-detail-buy-button" type="button">
          구매하기
        </button>
      </div>
    </>
  )
}

export default StoreDetailPage
