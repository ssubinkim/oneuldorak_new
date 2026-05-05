import ProductCard, { type Product } from './ProductCard'

type Props = {
  title: string
  description?: string
  products: Product[]
  columns?: number
  onSelect?: (id: string) => void
}

function ProductSection({ title, description, products, columns = 3, onSelect }: Props) {
  return (
    <div style={{ padding: '20px 16px 0' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: description ? 2 : 12,
      }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{title}</span>
        <span style={{ fontSize: 12, color: '#888', cursor: 'pointer', whiteSpace: 'nowrap' }}>전체보기 &gt;</span>
      </div>
      {description && (
        <div style={{ fontSize: 12, color: '#aaa', marginBottom: 12 }}>{description}</div>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '12px 10px',
      }}>
        {products.map(p => (
          <ProductCard key={p.id} {...p} onClick={() => onSelect?.(p.id)} />
        ))}
      </div>
    </div>
  )
}

export default ProductSection
