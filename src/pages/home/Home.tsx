import { useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react'
import BottomNav from '../../components/common/BottomNav'
import Header from '../../components/common/Header'
import { ChevronIcon } from '../../components/home/ChevronIcon'
import { CostChart } from '../../components/home/CostChart'
import { FridgeIllustration } from '../../components/home/FridgeIllustration'
import { PopularPostItem } from '../../components/home/PopularPostItem'
import { QuickMenuCard } from '../../components/home/QuickMenuCard'
import { RecommendedLunchCard } from '../../components/home/RecommendedLunchCard'
import { RecipePreviewCard } from '../../components/home/RecipePreviewCard'
import { TodayLunchbox } from '../../components/home/TodayLunchbox'
import '../../styles/Tailwind.css'
import './Home.css'

type PopularTab = 'board' | 'recipe'

const sosItems = ['10분 요리', '밀프랩', '간단재료', '다이어트']
const recommendedItems = [
  { title: '우렁된장쌈밥', meta: '10분 · 든든식', badge: 'BEST' },
  { title: '버터갈릭 새우 덮밥', meta: '10분 · 든든식' },
  { title: '닭가슴살 샐러드', meta: '15분 · 가벼운식', badge: 'NEW' },
  { title: '참치마요 주먹밥', meta: '8분 · 간편식' },
  { title: '두부 유부초밥', meta: '12분 · 균형식' },
  { title: '계란말이 김밥', meta: '10분 · 든든식' },
]
const posts = [
  '자취생 추천! 가성비 반찬 레시...',
  '자취생 추천! 가성비 반찬 레시피 모음',
  '자취생 추천! 가성비 반찬 레시피 모음',
]
const recipes = ['후랑멘트입니다', '후랑멘트입니다', '후랑멘트입니다', '후랑멘트', '후랑멘트']

function Home() {
  const [popularTab, setPopularTab] = useState<PopularTab>('board')
  const dragStateRef = useRef({
    element: null as HTMLDivElement | null,
    pointerId: null as number | null,
    startX: 0,
    startScrollLeft: 0,
    didDrag: false,
    blockClick: false,
  })

  const handleDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') {
      return
    }

    const element = event.currentTarget
    if (element.scrollWidth <= element.clientWidth) {
      return
    }

    dragStateRef.current.element = element
    dragStateRef.current.pointerId = event.pointerId
    dragStateRef.current.startX = event.clientX
    dragStateRef.current.startScrollLeft = element.scrollLeft
    dragStateRef.current.didDrag = false

    element.classList.add('is-dragging')
    element.setPointerCapture(event.pointerId)
  }

  const handleDragMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current
    if (!dragState.element || dragState.pointerId !== event.pointerId) {
      return
    }

    const deltaX = event.clientX - dragState.startX
    if (Math.abs(deltaX) > 3) {
      dragState.didDrag = true
    }

    dragState.element.scrollLeft = dragState.startScrollLeft - deltaX
    event.preventDefault()
  }

  const handleDragEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current
    if (!dragState.element || dragState.pointerId !== event.pointerId) {
      return
    }

    if (dragState.element.hasPointerCapture(event.pointerId)) {
      dragState.element.releasePointerCapture(event.pointerId)
    }

    dragState.element.classList.remove('is-dragging')
    dragState.blockClick = dragState.didDrag
    dragState.element = null
    dragState.pointerId = null
    dragState.startX = 0
    dragState.startScrollLeft = 0
    dragState.didDrag = false
  }

  const handleDragClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.blockClick) {
      return
    }

    dragStateRef.current.blockClick = false
    event.preventDefault()
    event.stopPropagation()
  }

  const handleSosCardClick = () => {
    window.location.hash = '#/store'
  }

  return (
    <div className="app-shell">
      <div className="app-screen">
        <Header />

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
              <TodayLunchbox />

              <h3>도시락 SOS</h3>
              <div
                className="quick-menu-grid card-drag-scroll"
                onPointerDown={handleDragStart}
                onPointerMove={handleDragMove}
                onPointerUp={handleDragEnd}
                onPointerCancel={handleDragEnd}
                onClickCapture={handleDragClickCapture}
              >
                {sosItems.map((item) => (
                  <QuickMenuCard label={item} key={item} onClick={handleSosCardClick} />
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

              <div
                className="recommend-grid card-drag-scroll"
                onPointerDown={handleDragStart}
                onPointerMove={handleDragMove}
                onPointerUp={handleDragEnd}
                onPointerCancel={handleDragEnd}
                onClickCapture={handleDragClickCapture}
              >
                {recommendedItems.map((item, index) => (
                  <RecommendedLunchCard
                    title={item.title}
                    meta={item.meta}
                    badge={item.badge}
                    muted={index === 0}
                    key={item.title}
                  />
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
                <button
                  type="button"
                  role="tab"
                  aria-selected={popularTab === 'board'}
                  onClick={() => setPopularTab('board')}
                >
                  자유게시판
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={popularTab === 'recipe'}
                  onClick={() => setPopularTab('recipe')}
                >
                  레시피
                </button>
              </div>
              {popularTab === 'board' ? (
                <div className="post-list">
                  {posts.map((post, index) => (
                    <PopularPostItem title={post} hot={index === 0} key={`${post}-${index}`} />
                  ))}
                </div>
              ) : (
                <div
                  className="recipe-preview-list card-drag-scroll"
                  onPointerDown={handleDragStart}
                  onPointerMove={handleDragMove}
                  onPointerUp={handleDragEnd}
                  onPointerCancel={handleDragEnd}
                  onClickCapture={handleDragClickCapture}
                >
                  {recipes.map((recipe, index) => (
                    <RecipePreviewCard title={recipe} key={`${recipe}-${index}`} />
                  ))}
                </div>
              )}
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
