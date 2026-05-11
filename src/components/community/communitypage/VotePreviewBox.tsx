import './VotePreviewBox.css'

type VoteOption = { id: string; label: string }

type VotePreviewBoxProps = {
  question?: string
  options?: VoteOption[]
  participantCount?: number
  deadline?: string
}

function VotePreviewBox({
  question = '여름철 도시락으로 뭐가 더 좋을까요?',
  options = [
    { id: '1', label: '샐러드 파스타' },
    { id: '2', label: '사과 브리치즈 샌드위치' },
    { id: '3', label: '오이 참치 주먹밥' },
    { id: '4', label: '닭가슴살 샐러드 랩' },
  ],
  participantCount = 53,
  deadline = '2026.05.18 18:00',
}: VotePreviewBoxProps) {
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
        {options.map((opt) => (
          <li key={opt.id}>
            <button type="button" className="vote-preview-box__option">
              {opt.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="vote-preview-box__footer">
        <span>현재 참여자 {participantCount}명</span>
        <span>~ {deadline}</span>
      </div>
    </section>
  )
}

export default VotePreviewBox
