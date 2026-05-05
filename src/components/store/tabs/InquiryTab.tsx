import InquiryEmpty from '../InquiryEmpty'
import RelatedRecipes from '../RelatedRecipes'
import RelatedProducts from '../RelatedProducts'

export type Inquiry = {
  id: string
  content: string
  username: string
  date: string
  isAnswered: boolean
  isSecret: boolean
}

type Props = {
  inquiries: Inquiry[]
  onSelectProduct?: (id: string) => void
}

function InquiryTab({ inquiries, onSelectProduct }: Props) {
  return (
    <div>
      <div style={{ padding: '0 16px' }}>
        <button style={{
          width: '100%', padding: '14px 0', marginBottom: 16,
          border: '1px solid #ddd', borderRadius: 8,
          background: '#fff', fontSize: 14, fontWeight: 600, color: '#333', cursor: 'pointer',
        }}>
          상품 문의하기
        </button>

        {inquiries.length === 0
          ? <InquiryEmpty />
          : inquiries.map(inq => (
            <div key={inq.id} style={{ padding: '14px 0', borderBottom: '1px solid #f2f2f2' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
                {inq.isSecret && (
                  <svg
                    viewBox="0 0 24 24" width={14} height={14}
                    fill="none" stroke="#aaa" strokeWidth={1.8}
                    style={{ marginTop: 1, flexShrink: 0 }}
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                )}
                <span style={{ fontSize: 13, color: inq.isSecret ? '#aaa' : '#222' }}>
                  {inq.content}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                {inq.isAnswered && (
                  <span style={{ color: '#888', fontWeight: 600 }}>답변완료</span>
                )}
                <span style={{ color: '#aaa' }}>{inq.username}</span>
                <span style={{ color: '#aaa' }}>{inq.date}</span>
              </div>
            </div>
          ))
        }
      </div>

      <RelatedRecipes />
      <RelatedProducts onSelect={onSelectProduct} />
      <div style={{ height: 24 }} />
    </div>
  )
}

export default InquiryTab
