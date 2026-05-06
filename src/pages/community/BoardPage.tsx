import CommunityWriteButton from '../../components/community/common/CommunityWriteButton'
import CommunityTabs from '../../components/community/common/CommunityTabs'
import type { CommunityTabRoute } from './CommunityTabRoute'
import './BoardPage.css'

type FreePost = {
  id: string
  category: string
  title: string
  body: string
  user: string
  timeAgo: string
  likes: number
  comments: number
  highlighted?: boolean
}

type BoardPageProps = {
  onBack: () => void
  onSelectTab: (tab: CommunityTabRoute) => void
  onOpenDetail: (postId: string) => void
}

const chips = ['전체', '질문', '고민', '꿀팁', '냉장고 SO']

const posts: FreePost[] = [
  {
    id: 'free-1',
    category: '질문',
    title: '도시락 용기 추천 부탁드려요',
    body: '보온 잘되고 세척 편한 용기 찾고 있어요. 추천해주세요!',
    user: '도시락초보',
    timeAgo: '10분 전',
    likes: 23,
    comments: 15,
  },
  {
    id: 'free-2',
    category: '꿀팁',
    title: '식비 월 20만원으로 줄인 후기',
    body: '3개월 실천한 방법 공유합니다. 생각보다 어렵지 않아요.',
    user: '절약왕',
    timeAgo: '1시간 전',
    likes: 342,
    comments: 89,
    highlighted: true,
  },
  {
    id: 'free-3',
    category: '냉장고 SOS',
    title: '냉장고에 양배추만 남았는데 뭐 해먹을까요?',
    body: '양배추랑 계란, 간장 정도 있어요',
    user: '요리고민',
    timeAgo: '2시간 전',
    likes: 45,
    comments: 32,
  },
  {
    id: 'free-4',
    category: '고민',
    title: '매일 도시락 싸는 게 힘들어요',
    body: '요즘 너무 귀찮아서... 다들 어떻게 하시나요?',
    user: '지친직장인',
    timeAgo: '3시간 전',
    likes: 67,
    comments: 41,
  },
]

function FreeActionIcon({ kind }: { kind: 'heart' | 'comment' | 'bookmark' }) {
  if (kind === 'heart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 5.6a5 5 0 0 0-7 0L12 7.4l-1.7-1.8a5 5 0 0 0-7.1 7l1.8 1.8L12 21l7.1-6.6 1.7-1.8a5 5 0 0 0 0-7Z" />
      </svg>
    )
  }

  if (kind === 'comment') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 6.2h15a1.7 1.7 0 0 1 1.7 1.7v8.4a1.7 1.7 0 0 1-1.7 1.7H9.8L5.4 21V7.9a1.7 1.7 0 0 1 1.7-1.7Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.1 4.8h9.8a1.4 1.4 0 0 1 1.4 1.4v13.9l-6.3-3.4-6.3 3.4V6.2a1.4 1.4 0 0 1 1.4-1.4Z" />
    </svg>
  )
}

function BoardPage({ onBack, onSelectTab, onOpenDetail }: BoardPageProps) {
  return (
    <>
      <main className="page-scroll free-detail-page">
        <section className="free-detail-topbar">
          <button type="button" aria-label="커뮤니티로 돌아가기" onClick={onBack}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m14.7 5.6-6.2 6.2 6.2 6.2" />
            </svg>
          </button>
          <h1>자유게시판</h1>
        </section>

        <CommunityTabs
          activeTab="free"
          className="free-detail-tabs"
          onSelectTab={onSelectTab}
        />

        <div className="free-detail-chips">
          {chips.map((chip, index) => (
            <button type="button" key={chip} className={index === 0 ? 'is-active' : undefined}>
              {chip}
            </button>
          ))}
        </div>

        <section className="free-detail-list" aria-label="자유게시판 글 목록">
          {posts.map((post) => (
            <article
              className="free-post-card"
              key={post.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenDetail(post.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onOpenDetail(post.id)
                }
              }}
            >
              <div className="free-post-card__top">
                <span className="free-post-card__category">{post.category}</span>
                <div className="free-post-card__top-icons">
                  {post.highlighted && <span className="free-post-card__trend">↗</span>}
                  <button type="button" aria-label="북마크">
                    <FreeActionIcon kind="bookmark" />
                  </button>
                </div>
              </div>

              <h2>{post.title}</h2>
              <p className="free-post-card__body">{post.body}</p>

              <div className="free-post-card__bottom">
                <span className="free-post-card__meta">{post.user} · {post.timeAgo}</span>
                <div className="free-post-card__stats">
                  <span>
                    <FreeActionIcon kind="heart" />
                    {post.likes}
                  </span>
                  <span>
                    <FreeActionIcon kind="comment" />
                    {post.comments}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      <CommunityWriteButton className="free-detail-fab" aria-label="글쓰기" />
    </>
  )
}

export default BoardPage
