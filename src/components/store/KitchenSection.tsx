import './KitchenSection.css'
import panIcon from './images/pan.png'
import ProductCard, { type Product } from './ProductCard'

type Props = {
  products: Product[]
  onSelect?: (product: Product) => void
}

function KitchenSection({ products, onSelect }: Props) {
  return (
    <div className="kitchen-section">
      <div className="kitchen-section__header">
        <p className="kitchen-section__title">
          <img src={panIcon} alt="" className="kitchen-section__title-icon" />
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
            <ProductCard {...p} onClick={() => onSelect?.(p)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default KitchenSection
