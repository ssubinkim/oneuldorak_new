type PopularPostItemProps = {
  title: string
  hot?: boolean
}

function PopularPostItemThumbnail() {
  return (
    <div className="post-item__thumbnail" aria-hidden="true">
      <svg viewBox="0 0 32 32">
        <rect x="6.5" y="5.5" width="19" height="21" rx="7" />
        <path d="M15.7 6.2c-.8 3.1-.9 6.6-.2 10.6.7 4.1.8 7.2.2 9.4" />
        <path d="M7.2 15.4c3.1-.7 6.3-.7 9.7 0 3 .6 5.7.6 8-.1" />
      </svg>
    </div>
  )
}

// 인기글 목록에 들어가는 썸네일, 제목, 반응 정보를 묶은 리스트 아이템입니다.
export function PopularPostItem({ title, hot = false }: PopularPostItemProps) {
  return (
    <article className="post-item">
      <PopularPostItemThumbnail />
      <div>
        <h3>
          {hot && <span>HOT</span>}
          {title}
        </h3>
        <p>
          <span className="post-item__heart" aria-hidden="true">
            ♥
          </span>
          96 · ▤ 23
        </p>
      </div>
    </article>
  )
}
