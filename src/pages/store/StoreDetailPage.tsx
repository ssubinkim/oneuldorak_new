import StoreDetail from '../../components/store/StoreDetail'
import './StoreDetailPage.css'

type Props = {
  productId: string | null
  onBack: () => void
  onSelectProduct: (id: string) => void
}

function StoreDetailPage({ productId, onBack, onSelectProduct }: Props) {
  return (
    <>
      <main className="page-scroll store-detail-page">
        <StoreDetail
          productId={productId}
          onBack={onBack}
          onSelectProduct={onSelectProduct}
        />
      </main>

      <div className="store-detail-action-bar">
        <button className="store-detail-action-button" type="button" aria-label="찜하기">
          <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <button className="store-detail-action-button" type="button" aria-label="장바구니">
          <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>

        <button className="store-detail-buy-button" type="button">
          구매하기
        </button>
      </div>
    </>
  )
}

export default StoreDetailPage
