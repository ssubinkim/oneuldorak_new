import './BestSection.css'
import fireIcon from './images/fire_icon.png'
import ProductCard, { type Product } from './ProductCard'

type Props = {
  products: Product[]
  onSelect?: (product: Product) => void
  onCartClick?: (rect: DOMRect) => void
}

function BestSection({ products, onSelect, onCartClick }: Props) {
  return (
    <div className="best-section">
      <div className="best-section__header">
        <p className="best-section__title">
          <img src={fireIcon} alt="" className="best-section__title-icon" width={22} height={22} loading="lazy" decoding="async" fetchPriority="low" />
          이번주 Best
        </p>
        <div className="best-section__subrow">
          <p className="best-section__desc">가장 인기있는 상품만 모아보세요</p>
          <button className="best-section__more" type="button" disabled>더보기 &gt;</button>
        </div>
      </div>
      <div className="best-section__track">
        {products.map((p, i) => (
          <div key={`${p.id}-${i}`} className="best-section__item">
            <ProductCard {...p} rank={i + 1} prioritizeImage={i < 2} onClick={() => onSelect?.(p)} onCartClick={onCartClick} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default BestSection
