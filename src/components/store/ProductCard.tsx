import './ProductCard.css'

export type Product = {
  id: string
  name: string
  price: number
  originalPrice?: number
  brand?: string
  image?: string
  rating?: number
  reviewCount?: number
  likes?: number
}

type Props = Product & {
  rank?: number
  onClick?: () => void
  onCartClick?: (rect: DOMRect) => void
  prioritizeImage?: boolean
}

function ProductCard({ name, price, originalPrice, brand, image, rating, reviewCount, rank, onClick, onCartClick, prioritizeImage = false }: Props) {
  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-card__image-wrap">
        {image && (
          <img
            className="product-card__image store-img-fade"
            src={image}
            alt={name}
            width={130}
            height={130}
            loading={prioritizeImage ? 'eager' : 'lazy'}
            decoding={prioritizeImage ? 'sync' : 'async'}
            fetchPriority={prioritizeImage ? 'high' : 'low'}
            data-loaded="false"
            onLoad={(event) => {
              event.currentTarget.dataset.loaded = 'true'
            }}
            onError={(event) => {
              event.currentTarget.dataset.loaded = 'true'
            }}
          />
        )}
        {rank !== undefined && (
          <span className="product-card__rank">{rank}</span>
        )}
        <button
          className="product-card__cart-btn"
          onClick={e => { e.stopPropagation(); onCartClick?.(e.currentTarget.getBoundingClientRect()) }}
          type="button"
          aria-label="장바구니 담기"
        >
          <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
      </div>
      <div className="product-card__info">
        {brand && <span className="product-card__brand">{brand}</span>}
        <p className="product-card__name">{name}</p>
        <div className="product-card__price-row">
          <span className="product-card__price">{price.toLocaleString()} ₩</span>
          {originalPrice && (
            <span className="product-card__original-price">{originalPrice.toLocaleString()} ₩</span>
          )}
        </div>
        {rating !== undefined && reviewCount !== 0 && (
          <div className="product-card__rating">
            <span className="product-card__star">★</span>
            <span>{rating}</span>
            <span className="product-card__review-count">({reviewCount ?? 0})</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard
