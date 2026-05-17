import arrowLeftIcon from '../../assets/icons/arrow_left.svg?url'
import couponIcon from '../../components/mypage/images/icon-slot-5.svg'
import benefitIcon1 from '../../components/mypage/images/benefit-icon-1.svg'
import benefitIcon2 from '../../components/mypage/images/benefit-icon-2.svg'
import benefitIcon3 from '../../components/mypage/images/benefit-icon-3.svg'
import benefitIcon4 from '../../components/mypage/images/benefit-icon-4.svg'
import './PlusBenefitPage.css'

const BENEFITS = [
  { icon: benefitIcon1, title: '브랜드 할인 쿠폰', desc: '다양한 브랜드 할인 혜택을 받고 있어요.' },
  { icon: benefitIcon2, title: '협찬 제품 응모', desc: '다양한 브랜드 제품에 응모 할 수 있어요.' },
  { icon: benefitIcon3, title: '스토어 회원 전용 할인', desc: '회원 전용 할인 혜택을 받고 있어요.' },
  { icon: benefitIcon4, title: '배달비 무료쿠폰 제공', desc: '배달비 무료 쿠폰 혜택을 받고 있어요.' },
]

export default function PlusBenefitPage() {
  return (
    <div className="app-shell">
      <div className="app-screen pb-screen">
        <header className="pb-header">
          <button className="pb-header-btn" onClick={() => window.history.back()} aria-label="뒤로가기">
            <img src={arrowLeftIcon} alt="" />
          </button>
          <h1 className="pb-header-title">오늘도락 Plus</h1>
          <button className="pb-header-btn pb-header-btn--right" aria-label="알림">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
        </header>

        <div className="pb-scroll">
          <section className="pb-hero">
            <h2 className="pb-hero-title">
              지금 누리고 있는<br />
              <span className="pb-blue">PLUS 혜택을</span> 확인해보세요!
            </h2>
            <p className="pb-hero-sub">절약하는 사람들을 위한 Plus 혜택</p>
          </section>

          <section className="pb-benefits-card">
            {BENEFITS.map((b, i) => (
              <div key={i} className={`pb-benefit-row${i < BENEFITS.length - 1 ? ' divider' : ''}`}>
                <img src={b.icon} alt="" className="pb-benefit-icon" />
                <div className="pb-benefit-info">
                  <p className="pb-benefit-title">{b.title}</p>
                  <p className="pb-benefit-desc">{b.desc}</p>
                </div>
                <div className="pb-benefit-check">
                  <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                    <path d="M1 5.5L5 9.5L13 1.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            ))}
          </section>

          <button className="pb-coupon-btn">
            <img src={couponIcon} alt="" className="pb-coupon-btn__icon" />
            지급된 쿠폰 확인하기
            <svg className="pb-coupon-btn__arrow" width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M1 1L7 7L1 13" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="pb-cancel-section">
            <p className="pb-cancel-notice">해지 시 다음 결제일부터 PLUS 혜택이 종료됩니다.</p>
            <button className="pb-cancel-btn">PLUS 해지하기</button>
          </div>
        </div>
      </div>
    </div>
  )
}
