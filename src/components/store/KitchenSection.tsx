import './KitchenSection.css'
import panIcon from './images/pan.png'
import ProductCard, { type Product } from './ProductCard'

type Props = {
  products: Product[]
  onSelect?: (product: Product) => void
  onCartClick?: (rect: DOMRect) => void
}

function KitchenSection({ products, onSelect, onCartClick }: Props) {
  return (
    <div className="kitchen-section">
      <div className="kitchen-section__header">
        <p className="kitchen-section__title">
          <img src={panIcon} alt="" className="kitchen-section__title-icon" width={24} height={24} loading="lazy" decoding="async" fetchPriority="low" />
          오늘의 키친
        </p>
        <div className="kitchen-section__subrow">
          <p className="kitchen-section__desc">한 끼 준비가 쉬워지는 아이템</p>
          <button className="kitchen-section__more" type="button">더보기 &gt;</button>
        </div>
      </div>
      <div className="kitchen-section__track">
        {products.map((p, i) => (
          <div key={`${p.id}-${i}`} className="kitchen-section__item">
            <ProductCard {...p} onClick={() => onSelect?.(p)} onCartClick={onCartClick} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default KitchenSection
