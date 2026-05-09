import BottomNav from '../../components/common/layout/BottomNav'
import LikePostCard from '../../components/mypage/LikePostCard'
import type { LikePost } from '../../components/mypage/LikePostCard'
import '../../styles/Tailwind.css'
import './LikePage.css'

const LIKED_POSTS: LikePost[] = [
  { id: 1, category: '꿀팁', showIcon: true, title: '식비 월 20만원으로 줄인 후기', savedAt: '2일 전 저장' },
  { id: 2, category: '냉장고 SOS', showIcon: false, title: '냉장고에 양배추만 남았는데 뭐 해먹을까요?', savedAt: '3일 전 저장' },
  { id: 3, category: '자취', showIcon: true, title: '매일 도시락 싸는 게 힘들어요', savedAt: '3일 전 저장' },
  { id: 4, category: '추천', showIcon: false, title: '도시락 용기 추천 부탁드려요', savedAt: '4일 전 저장' },
]

type Props = { onBack?: () => void }

function LikePage({ onBack }: Props = {}) {
  const handleBack = onBack ?? (() => { window.location.hash = '#/mypage' })

  return (
    <div className="app-shell">
      <div className="app-screen">

        {/* 헤더 */}
        <header className="like-header">
          <button
            className="like-header-back"
            onClick={handleBack}
            aria-label="뒤로가기"
          >
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M9 1L1 9L9 17" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="like-header-title">좋아요</span>
        </header>

        {/* 콘텐츠 */}
        <div className="page-scroll">
          <div className="like-page">
            <div className="like-list">
              {LIKED_POSTS.map((post) => (
                <LikePostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  )
}

export default LikePage
