import './BestSection.css'
import ProductCard, { type Product } from './ProductCard'

type Props = {
  products: Product[]
  onSelect?: (id: string) => void
}

function BestSection({ products, onSelect }: Props) {
  return (
    <div className="best-section">
      <div className="best-section__header">
        <div>
          <p className="best-section__title">🔥 이번주 Best</p>
          <p className="best-section__desc">가장 인기있는 상품만 아아보세요</p>
        </div>
        <button className="best-section__more" type="button">더보기 &gt;</button>
      </div>
      <div className="best-section__track">
        {products.map((p, i) => (
          <div key={`${p.id}-${i}`} className="best-section__item">
            <ProductCard {...p} rank={i + 1} onClick={() => onSelect?.(p.id)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default BestSection
