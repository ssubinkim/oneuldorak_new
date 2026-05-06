import { useState } from 'react'
import CommunityTabs from '../../components/community/common/CommunityTabs'
import VoteList, { type VoteFilter } from '../../components/community/votepage/VoteList'
import type { CommunityTabRoute } from './CommunityTabRoute'
import './VotePage.css'

type VotePageProps = {
  onBack: () => void
  onSelectTab: (tab: CommunityTabRoute) => void
}

const weeklyTopVotes = [
  { rank: 1, title: '내일 뭐 싸지?', people: 742 },
  { rank: 2, title: '여름철 도시락 추천', people: 1313 },
  { rank: 3, title: '가장 실패한 도시락은?', people: 879 },
]

function VotePage({ onBack, onSelectTab }: VotePageProps) {
  const [voteFilter, setVoteFilter] = useState<VoteFilter>('active')

  return (
    <main className="page-scroll vote-page">
      <section className="vote-page-topbar">
        <button type="button" aria-label="커뮤니티로 돌아가기" onClick={onBack}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m14.7 5.6-6.2 6.2 6.2 6.2" />
          </svg>
        </button>
        <h1>투표</h1>
      </section>

      <CommunityTabs
        activeTab="vote"
        className="vote-page-tabs"
        onSelectTab={onSelectTab}
      />

      <div className="vote-page-filters">
        <button
          type="button"
          className={voteFilter === 'active' ? 'is-active' : undefined}
          onClick={() => setVoteFilter('active')}
        >
          진행 중
        </button>
        <button
          type="button"
          className={voteFilter === 'ended' ? 'is-active' : undefined}
          onClick={() => setVoteFilter('ended')}
        >
          종료된 투표
        </button>
      </div>

      <VoteList filter={voteFilter} />

      <section className="vote-weekly">
        <h2>주간 인기 투표</h2>
        <ol>
          {weeklyTopVotes.map((item) => (
            <li key={item.rank}>
              <span className="vote-weekly-rank">{item.rank}</span>
              <p>{item.title}</p>
              <span className="vote-weekly-count">{item.people}명</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}

export default VotePage
