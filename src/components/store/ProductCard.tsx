export type Product = {
  id: string
  name: string
  price: number
  likes?: number
}

type Props = Product & {
  rank?: number
  onClick?: () => void
}

function ProductCard({ name, price, likes, rank, onClick }: Props) {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      <div style={{
        position: 'relative', background: '#e8e8e8', borderRadius: 8,
        aspectRatio: '1', marginBottom: 6, overflow: 'hidden',
      }}>
        {rank !== undefined && (
          <span style={{
            position: 'absolute', bottom: 6, left: 8,
            fontSize: 20, fontWeight: 800, color: '#111',
          }}>
            {rank}
          </span>
        )}
        <button
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute', bottom: 6, right: 6,
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          }}
        >
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="#aaa" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      <div style={{ fontSize: 12, color: '#222', marginBottom: 2, lineHeight: 1.4 }}>{name}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#111' }}>{price.toLocaleString()}₩</div>
      {likes !== undefined && (
        <div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>
          ☑ {likes > 0 ? `${likes}+` : '0'}
        </div>
      )}
    </div>
  )
}

export default ProductCard
