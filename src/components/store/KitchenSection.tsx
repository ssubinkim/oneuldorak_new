import { useId } from 'react'
import './StoreSectionHeader.css'
import { ArrowRightIcon } from '../common/ui/ArrowRightIcon'
import './KitchenSection.css'
import panIcon from './images/pan.png'
import ProductCard, { type Product } from './ProductCard'

type Props = {
  products: Product[]
  onSelect?: (product: Product) => void
  onCartClick?: (rect: DOMRect) => void
}

function KitchenSection({ products, onSelect, onCartClick }: Props) {
  const titleId = useId()
  return (
    <section className="kitchen-section" aria-labelledby={titleId}>
      <div className="store-section__header">
        <div className="store-section__title-group">
          <h2 id={titleId} className="store-section__title">
            <img src={panIcon} alt="" className="store-section__icon" width={24} height={24} loading="lazy" decoding="async" fetchPriority="low" />
            오늘의 키친
          </h2>
          <p className="store-section__subtitle">한 끼 준비가 쉬워지는 아이템</p>
        </div>
        <button className="store-section__more" type="button" disabled>더보기 <ArrowRightIcon /></button>
      </div>
      <div className="kitchen-section__track">
        {products.map((p, i) => (
          <div key={`${p.id}-${i}`} className="kitchen-section__item">
            <ProductCard {...p} onClick={() => onSelect?.(p)} onCartClick={onCartClick} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default KitchenSection
