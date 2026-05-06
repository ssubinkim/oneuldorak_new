import './SavedPostBox.css'

type SavedPostBoxProps = {
  count?: number
}

function SavedPostBox({ count = 12 }: SavedPostBoxProps) {
  return (
    <section className="saved-post-box">
      <button type="button" className="saved-post-box__link" aria-label="저장한 글 보기">
        <div>
          <h2>저장한 글</h2>
          <p>오늘도락 페이지에서 다시 볼 수 있어요</p>
        </div>
        <span>{count} ›</span>
      </button>
    </section>
  )
}

export default SavedPostBox
