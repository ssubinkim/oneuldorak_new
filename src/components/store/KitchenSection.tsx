import './KitchenSection.css'
import ProductCard, { type Product } from './ProductCard'

type Props = {
  products: Product[]
  onSelect?: (id: string) => void
}

function KitchenSection({ products, onSelect }: Props) {
  return (
    <div className="kitchen-section">
      <div className="kitchen-section__header">
        <div>
          <p className="kitchen-section__title">✂ 오늘의 키친</p>
          <p className="kitchen-section__desc">한 끼 준비가 쉬워지는 아이템</p>
        </div>
        <button className="kitchen-section__more" type="button">더보기 &gt;</button>
      </div>
      <div className="kitchen-section__track">
        {products.map((p, i) => (
          <div key={`${p.id}-${i}`} className="kitchen-section__item">
            <ProductCard {...p} onClick={() => onSelect?.(p.id)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default KitchenSection
