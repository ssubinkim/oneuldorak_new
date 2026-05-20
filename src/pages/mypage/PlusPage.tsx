import { useState } from 'react'
import heroMascot from '../../components/mypage/images/plus-hero-mascote.svg'
import benefitIcon1 from '../../components/mypage/images/benefit-icon-1.svg'
import benefitIcon2 from '../../components/mypage/images/benefit-icon-2.svg'
import benefitIcon3 from '../../components/mypage/images/benefit-icon-3.svg'
import benefitIcon4 from '../../components/mypage/images/benefit-icon-4.svg'
import arrowLeftIcon from '../../assets/icons/arrow_left.svg?url'
import './PlusPage.css'

type Plan = 'monthly' | 'annual'

const BENEFITS = [
  {
    icon: benefitIcon1,
    title: '브랜드 할인 쿠폰',
    desc: '다양한 브랜드 할인 혜택을\n받아보세요.',
  },
  {
    icon: benefitIcon2,
    title: '협찬 제품 응모',
    desc: '다양한 협찬 제품에\n응모할 수 있어요.',
  },
  {
    icon: benefitIcon3,
    title: '스토어 회원 전용 할인',
    desc: '회원 전용 할인 혜택을\n누릴 수 있어요.',
  },
  {
    icon: benefitIcon4,
    title: '배달비 무료쿠폰 제공',
    desc: '배달비 무료 쿠폰을\n받아보세요.',
  },
]

export default function PlusPage() {
  const [plan, setPlan] = useState<Plan>('annual')

  return (
    <div className="app-shell">
      <div className="app-screen plus-screen">
        <header className="plus-header">
          <button className="plus-header-btn" onClick={() => window.history.back()} aria-label="뒤로가기">
            <img src={arrowLeftIcon} alt="" />
          </button>
          <h1 className="plus-header-title">오늘도락 Plus</h1>
          <button className="plus-header-btn plus-header-btn--right" aria-label="알림">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
        </header>

        <div className="plus-scroll">
          {/* 히어로 */}
          <section className="plus-hero">
            <h2 className="plus-hero-title">
              <span className="plus-blue">PLUS</span>로 <span className="plus-blue">더 많은 혜택을</span><br />받아보세요!
            </h2>
            <p className="plus-hero-sub">절약하는 사람들을 위한 Plus 혜택</p>
          </section>

          {/* 플랜 선택 */}
          <section className="plus-plans">
            <img src={heroMascot} alt="" className="plus-mascot-hero" />
            <div className="plus-discount-badge">첫 구독 20% 할인</div>

            <button
              className={`plus-plan-card${plan === 'monthly' ? ' selected' : ''}`}
              onClick={() => setPlan('monthly')}
              disabled
            >
              <div className={`plus-plan-radio${plan === 'monthly' ? ' selected' : ''}`}>
                {plan === 'monthly' && (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div className="plus-plan-info">
                <span className="plus-plan-name">월간 구독</span>
                <div className="plus-plan-price">
                  <strong>4,900원</strong>
                  <span className="plus-plan-unit"> / 월</span>
                  <span className="plus-plan-original">6,000원</span>
                </div>
              </div>
            </button>

            <button
              className={`plus-plan-card${plan === 'annual' ? ' selected' : ''}`}
              onClick={() => setPlan('annual')}
              disabled
            >
              <div className={`plus-plan-radio${plan === 'annual' ? ' selected' : ''}`}>
                {plan === 'annual' && (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div className="plus-plan-info">
                <span className="plus-plan-name">연간 구독</span>
                <div className="plus-plan-price">
                  <strong>49,000</strong>
                  <span className="plus-plan-unit"> / 월</span>
                  <span className="plus-plan-original">85,800원</span>
                </div>
              </div>
            </button>

            <button className="plus-cta plus-cta--subscribed" disabled>이미 구독중이에요</button>
          </section>

          {/* 혜택 미리보기 */}
          <section className="plus-benefits">
            <h3 className="plus-benefits-title">PLUS 주요 혜택 미리보기</h3>
            <div className="plus-benefits-grid">
              {BENEFITS.map((b) => (
                <div key={b.title} className="plus-benefit-card">
                  <div className="plus-benefit-icon">
                    <img src={b.icon} alt="" />
                  </div>
                  <p className="plus-benefit-name">{b.title}</p>
                  <p className="plus-benefit-desc">{b.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
