import './RelatedProducts.css'
import ProductCard, { type Product } from './ProductCard'
import best1 from './images/best_item1.png'
import best2 from './images/best_item2.png'
import best3 from './images/best_item3.png'
import best4 from './images/best_item4.png'
import best5 from './images/best_item5.png'

const RELATED: Product[] = [
  { id: 'r1', brand: '모노메이트', name: '간편 도시락 세트', price: 32000, originalPrice: 38000, image: best1, rating: 4.9, reviewCount: 267 },
  { id: 'r2', brand: '밥픽', name: '계란말이 도시락', price: 4900, image: best2, rating: 4.9, reviewCount: 0 },
  { id: 'r3', brand: '밥픽', name: '참치마요 덮밥', price: 5900, originalPrice: 7000, image: best3, rating: 4.9, reviewCount: 267 },
  { id: 'r4', brand: '모노메이트', name: '전자레인지 런치박스', price: 9900, image: best4, rating: 4.9, reviewCount: 0 },
  { id: 'r5', brand: '프레시잇', name: '오늘의야채 샐러드', price: 12000, originalPrice: 15000, image: best5, rating: 4.9, reviewCount: 267 },
]

function RelatedProducts({ onSelect }: { onSelect?: (product: Product) => void }) {
  return (
    <div className="related-products">
      <div className="related-products__header">
        <span className="related-products__title">이 재료는 어떠세요 ?</span>
        <span className="related-products__more">더보기 &gt;</span>
      </div>
      <div className="related-products__list">
        {RELATED.map(p => (
          <div key={p.id} className="related-products__item">
            <ProductCard {...p} onClick={() => onSelect?.(p)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
