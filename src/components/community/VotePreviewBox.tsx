import './VotePreviewBox.css'

type VotePreviewBoxProps = {
  title?: string
  meta?: string
  reward?: string
}

function VotePreviewBox({
  title = '내일 뭐 싸지?',
  meta = '참여 742명 · 23시간 남음',
  reward = '1P',
}: VotePreviewBoxProps) {
  return (
    <section className="vote-preview-box">
      <div className="vote-preview-box__header">
        <h2>최근 인기 투표</h2>
        <button type="button" aria-label="최근 인기 투표 더보기">
          더보기›
        </button>
      </div>
      <article className="vote-preview-box__item">
        <div>
          <h3>{title}</h3>
          <p>{meta}</p>
        </div>
        <span>{reward}</span>
      </article>
    </section>
  )
}

export default VotePreviewBox
