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
    <div style={{ padding: '24px 0 0' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 16px', marginBottom: 12,
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>이 재료는 어떠세요 ?</span>
        <span style={{ fontSize: 12, color: '#888', cursor: 'pointer', whiteSpace: 'nowrap' }}>전체보기 &gt;</span>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 16px', scrollbarWidth: 'none' }}>
        {RELATED.map(p => (
          <div key={p.id} style={{ flex: '0 0 120px' }} className="related-product-item">
            <ProductCard {...p} onClick={() => onSelect?.(p)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
