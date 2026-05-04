import BottomNav from '../components/common/BottomNav'
import Header from '../components/common/Header'
import { ChevronIcon } from '../components/home/ChevronIcon'
import { CostChart } from '../components/home/CostChart'
import { FridgeIllustration } from '../components/home/FridgeIllustration'
import { LunchIcon } from '../components/home/LunchIcon'
import { SosCard } from '../components/home/SosCard'
import { VisualPlaceholder } from '../components/home/VisualPlaceholder'
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

function Home() {
  return (
    <div className="home-shell">
      <div className="home-screen">
        <Header showActions />

        <div className="home-scroll">
          <header className="home-header">
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
                  <SosCard label={item} key={item} />
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

        <button className="chatbot-bubble" type="button">
          <span>나의</span>
          챗봇
        </button>
        <BottomNav />
      </div>
    </div>
  )
}

export default Home
