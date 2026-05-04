import BottomNav from '../components/common/BottomNav'
import '../styles/Tailwind.css'

const sosItems = ['10분 요리', '밀프랩', '간단재료', '다이어트']
const recommendedItems = [
  { title: '우렁된장쌈밥', meta: '10분 · 든든식', badge: 'BEST' },
  { title: '버터갈릭 새우 덮밥', meta: '10분 · 든든식' },
]
const posts = [
  '자취생 추천! 가성비 반찬 레시...',
  '자취생 추천! 가성비 반찬 레시피 모음',
  '자취생 추천! 가성비 반찬 레시피 모음',
]

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 16.3H6c1.2-1.3 1.7-3.3 1.7-6a4.3 4.3 0 0 1 8.6 0c0 2.7.5 4.7 1.7 6Z" />
      <path d="M10.1 18.5a2.1 2.1 0 0 0 3.8 0" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="18" cy="5.6" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="18.4" r="2.5" />
      <path d="m8.3 10.9 7.4-4.1M8.3 13.1l7.4 4.1" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m6 3.5 4 4.5-4 4.5" />
    </svg>
  )
}

function LunchIcon() {
  return (
    <svg className="lunch-icon" viewBox="0 0 32 32" aria-hidden="true">
      <rect x="6.5" y="5.5" width="19" height="21" rx="7" />
      <path d="M15.7 6.2c-.8 3.1-.9 6.6-.2 10.6.7 4.1.8 7.2.2 9.4" />
      <path d="M7.2 15.4c3.1-.7 6.3-.7 9.7 0 3 .6 5.7.6 8-.1" />
    </svg>
  )
}

function BurgerIcon() {
  return (
    <svg className="burger-icon" viewBox="0 0 34 34" aria-hidden="true">
      <path d="M7.4 16c.5-5.1 4.3-8 9.6-8s9.1 2.9 9.6 8H7.4Z" />
      <path d="M6.6 20.6h20.8" />
      <path d="M8.1 24.6h17.8" />
      <path d="M9.4 16.1c.5 1.2 1.4 1.2 2.1 0 .7-1.2 1.6-1.2 2.3 0 .7 1.2 1.6 1.2 2.3 0 .7-1.2 1.6-1.2 2.3 0 .7 1.2 1.6 1.2 2.3 0 .7-1.2 1.6-1.2 2.1 0" />
      <path d="M10.7 11.8h.1M14.8 10.3h.1M19.5 10.9h.1M23 12.6h.1" />
    </svg>
  )
}

function CostChart() {
  return (
    <svg className="cost-chart" viewBox="0 0 160 82" aria-label="이번주 예상 식비 그래프">
      <path d="M14 63h133M14 47h133M14 31h133M14 15h133" />
      <path
        d="M17 45 43 15 69 30 95 65 121 37 147 36 147 70 17 70Z"
        className="cost-chart__fill"
      />
      <path d="M17 45 43 15 69 30 95 65 121 37 147 36" className="cost-chart__line" />
      <g>
        <circle cx="17" cy="45" r="2.3" />
        <circle cx="43" cy="15" r="2.3" />
        <circle cx="69" cy="30" r="2.3" />
        <circle cx="95" cy="65" r="2.3" />
        <circle cx="121" cy="37" r="2.3" />
        <circle cx="147" cy="36" r="2.3" />
      </g>
      <text x="10" y="78">Mon</text>
      <text x="36" y="78">Tue</text>
      <text x="63" y="78">Wed</text>
      <text x="90" y="78">Thu</text>
      <text x="116" y="78">Fri</text>
      <text x="141" y="78">Sun</text>
    </svg>
  )
}

function FridgeIllustration() {
  return (
    <svg className="fridge-illustration" viewBox="0 0 92 92" aria-hidden="true">
      <defs>
        <linearGradient id="fridgeBody" x1="18" x2="74" y1="8" y2="84">
          <stop stopColor="#fbfbff" />
          <stop offset="1" stopColor="#cdd5e4" />
        </linearGradient>
      </defs>
      <path d="M18 12 67 5l7 76-49 7-7-76Z" fill="url(#fridgeBody)" />
      <path d="M22 16 64 10l2.3 26.5-41.8 6L22 16ZM25 47l42-6 3 34-42 6-3-34Z" fill="#f7f8ff" />
      <path d="M37 27h5M39 58h5" stroke="#b3bdca" strokeLinecap="round" strokeWidth="3" />
      <rect x="43" y="50" width="11" height="7" rx="3.5" fill="#f55774" />
      <rect x="56" y="49" width="11" height="8" rx="4" fill="#8ac857" />
      <rect x="39" y="63" width="11" height="7" rx="3.5" fill="#f4d442" />
      <rect x="52" y="63" width="14" height="8" rx="4" fill="#6d8bf4" />
      <rect x="48" y="25" width="10" height="7" rx="3.5" fill="#d74ad8" />
      <rect x="58" y="23" width="8" height="7" rx="3.5" fill="#ea3d3d" />
    </svg>
  )
}

function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <span>9:41</span>
      <div className="status-bar__icons">
        <span className="signal-icon">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="wifi-icon" />
        <span className="battery-icon">80</span>
      </div>
    </div>
  )
}

function VisualPlaceholder({ large = false }: { large?: boolean }) {
  return (
    <div className={large ? 'visual-placeholder visual-placeholder--large' : 'visual-placeholder'}>
      <LunchIcon />
    </div>
  )
}

function Home() {
  return (
    <div className="home-shell">
      <div className="home-screen">
        <div className="home-scroll">
          <StatusBar />

          <header className="home-header">
            <div className="home-actions" aria-label="홈 빠른 메뉴">
              <button type="button" aria-label="알림">
                <BellIcon />
              </button>
              <button type="button" aria-label="공유">
                <ShareIcon />
              </button>
            </div>

            <p className="home-greeting">안녕하세요, 세아님</p>
            <h1>
              오늘, 세아님에게
              <br />
              어울리는 도시락이에요!
            </h1>
            <p className="home-subtitle">빠른 선택으로 맛있는 한 끼를 준비해보세요!</p>
          </header>

          <main className="home-content">
            <section className="cost-card" aria-label="이번주 예상 식비">
              <div className="cost-card__copy">
                <p>이번주 예상 식비</p>
                <strong>
                  28,500<span>원</span>
                </strong>
                <small>
                  지난 주 대비 <b>3,900원</b> 절약했어요!
                </small>
              </div>
              <CostChart />
            </section>

            <section className="today-lunch" aria-labelledby="todayLunchTitle">
              <h2 id="todayLunchTitle">오늘의 도시락</h2>
              <VisualPlaceholder large />

              <h3>도시락 SOS</h3>
              <div className="sos-grid">
                {sosItems.map((item) => (
                  <button type="button" className="sos-card" key={item}>
                    <BurgerIcon />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="recommend-section" aria-labelledby="recommendTitle">
              <div className="section-heading">
                <h2 id="recommendTitle">오늘의 도시락 추천</h2>
                <a href="#more-recommend">
                  더보기
                  <ChevronIcon />
                </a>
              </div>

              <button className="chatbot-bubble" type="button">
                <span>나의</span>
                챗봇
              </button>

              <div className="recommend-grid">
                {recommendedItems.map((item) => (
                  <article className="recommend-card" key={item.title}>
                    <div className="recommend-card__image">
                      {item.badge && <span>{item.badge}</span>}
                      <LunchIcon />
                    </div>
                    <div className="recommend-card__body">
                      <h3>{item.title}</h3>
                      <p>⏱ {item.meta}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="ingredient-banner" aria-label="내 재료로 메뉴 찾기">
              <FridgeIllustration />
              <div>
                <h2>내 재료로 메뉴 찾기</h2>
                <p>
                  냉장고 속 재료로
                  <br />
                  딱 맞는 메뉴를 추천받아보세요!
                </p>
              </div>
              <button type="button" aria-label="내 재료로 메뉴 찾기 이동">
                <ChevronIcon />
              </button>
            </section>

            <section className="popular-section" aria-labelledby="popularTitle">
              <div className="section-heading">
                <h2 id="popularTitle">인기글</h2>
                <a href="#more-posts">
                  더보기
                  <ChevronIcon />
                </a>
              </div>
              <div className="popular-tabs" role="tablist" aria-label="인기글 카테고리">
                <button type="button" role="tab" aria-selected="true">
                  자유게시판
                </button>
                <button type="button" role="tab" aria-selected="false">
                  레시피
                </button>
              </div>
              <div className="post-list">
                {posts.map((post, index) => (
                  <article className="post-item" key={`${post}-${index}`}>
                    <VisualPlaceholder />
                    <div>
                      <h3>
                        {index === 0 && <span>HOT</span>}
                        {post}
                      </h3>
                      <p>
                        <span className="post-item__heart" aria-hidden="true">
                          ♥
                        </span>
                        96 · ▤ 23
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>
        </div>

        <BottomNav />
      </div>
    </div>
  )
}

export default Home
