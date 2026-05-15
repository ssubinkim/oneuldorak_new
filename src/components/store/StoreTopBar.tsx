import './StoreTopBar.css'
import storeLogo from './images/store_logo.png'

function StoreTopBar() {
  return (
    <div className="store-top-bar">
      <h1 className="store-top-bar__title">
        <img src={storeLogo} alt="도락마켓" className="store-top-bar__logo" />
        도락마켓
      </h1>
      <div className="store-top-bar__actions">
        <button className="store-top-bar__icon-btn" type="button" aria-label="장바구니">
          <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default StoreTopBar
