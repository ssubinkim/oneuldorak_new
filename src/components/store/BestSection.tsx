import { useId } from 'react'
import './StoreSectionHeader.css'
import { ArrowRightIcon } from '../common/ui/ArrowRightIcon'
import './BestSection.css'
import fireIcon from './images/fire_icon.png'
import ProductCard, { type Product } from './ProductCard'

type Props = {
  products: Product[]
  onSelect?: (product: Product) => void
  onCartClick?: (rect: DOMRect) => void
}

function BestSection({ products, onSelect, onCartClick }: Props) {
  const titleId = useId()
  return (
    <section className="best-section" aria-labelledby={titleId}>
      <div className="store-section__header">
        <div className="store-section__title-group">
          <h2 id={titleId} className="store-section__title">
            <img src={fireIcon} alt="" className="store-section__icon" width={22} height={22} loading="lazy" decoding="async" fetchPriority="low" />
            이번주 Best
          </h2>
          <p className="store-section__subtitle">가장 인기있는 상품만 모아보세요</p>
        </div>
        <button className="store-section__more" type="button" disabled>더보기 <ArrowRightIcon /></button>
      </div>
      <div className="best-section__track">
        {products.map((p, i) => (
          <div key={`${p.id}-${i}`} className="best-section__item">
            <ProductCard {...p} rank={i + 1} prioritizeImage={i < 2} onClick={() => onSelect?.(p)} onCartClick={onCartClick} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default BestSection
