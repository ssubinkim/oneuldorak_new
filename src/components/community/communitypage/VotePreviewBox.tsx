import { useState } from 'react'
import './VotePreviewBox.css'

type VoteOption = { id: string; label: string; votes: number }

type VotePreviewBoxProps = {
  question?: string
  options?: VoteOption[]
  participantCount?: number
  deadline?: string
}

function VotePreviewBox({
  question = '여름철 도시락으로 뭐가 더 좋을까요?',
  options = [
    { id: '1', label: '샐러드 파스타', votes: 18 },
    { id: '2', label: '사과 브리치즈 샌드위치', votes: 13 },
    { id: '3', label: '오이 참치 주먹밥', votes: 12 },
    { id: '4', label: '닭가슴살 샐러드 랩', votes: 10 },
  ],
  participantCount = 53,
  deadline = '2026.05.18 18:00',
}: VotePreviewBoxProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)

  const votedOptions = options.map((option) => ({
    ...option,
    votes: option.id === selectedOptionId ? option.votes + 1 : option.votes,
  }))
  const totalVotes = votedOptions.reduce((total, option) => total + option.votes, 0)
  const hasVoted = selectedOptionId !== null

  return (
    <section className="vote-preview-box">
      <div className="vote-preview-box__header">
        <div className="vote-preview-box__title-group">
          <h2>오늘의 투표</h2>
          <span className="vote-preview-box__reward">+1p</span>
        </div>
        <button type="button" aria-label="투표 더보기">
          더보기 ›
        </button>
      </div>
      <p className="vote-preview-box__question">Q. {question}</p>
      <ul className="vote-preview-box__options">
        {votedOptions.map((opt) => {
          const isSelected = selectedOptionId === opt.id
          const percent = totalVotes === 0 ? 0 : (opt.votes / totalVotes) * 100

          return (
            <li key={opt.id}>
              <button
                type="button"
                className={`vote-preview-box__option${isSelected ? ' is-selected' : ''}${hasVoted ? ' has-result' : ''}`}
                onClick={() => setSelectedOptionId(opt.id)}
              >
                {hasVoted && (
                  <span
                    className="vote-preview-box__progress"
                    style={{ width: `${percent}%` }}
                    aria-hidden="true"
                  />
                )}
                <span>{opt.label}</span>
                {hasVoted && <strong>{percent.toFixed(1)}% · {opt.votes}표</strong>}
              </button>
            </li>
          )
        })}
      </ul>
      <div className="vote-preview-box__footer">
        <span>현재 참여자 {participantCount}명</span>
        <span>~ {deadline}</span>
      </div>
    </section>
  )
}

export default VotePreviewBox
