import BoardList from '../../components/community/boardpage/BoardList'
import CommunityWriteButton from '../../components/community/common/CommunityWriteButton'
import CommunityTabs from '../../components/community/common/CommunityTabs'
import type { CommunityTabRoute } from './CommunityTabRoute'
import './BoardPage.css'

type BoardPageProps = {
  onBack: () => void
  onSelectTab: (tab: CommunityTabRoute) => void
  onOpenDetail: (postId: string) => void
}

const chips = ['전체', '질문', '고민', '꿀팁', '냉장고 SO']

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

        <BoardList onOpenDetail={onOpenDetail} />
      </main>

      <CommunityWriteButton className="free-detail-fab" aria-label="글쓰기" />
    </>
  )
}

export default BoardPage
