import ProductCard, { type Product } from './ProductCard'

const RELATED: Product[] = [
  { id: 'r1', name: '제품이름입니다', price: 12000, likes: 999 },
  { id: 'r2', name: '제품이름입니다', price: 12000, likes: 999 },
  { id: 'r3', name: '제품이름입니다', price: 12000, likes: 999 },
  { id: 'r4', name: '제품이름입니다', price: 12000, likes: 999 },
]

function RelatedProducts({ onSelect }: { onSelect?: (id: string) => void }) {
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
          <div key={p.id} style={{ flex: '0 0 120px' }}>
            <ProductCard {...p} onClick={() => onSelect?.(p.id)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
