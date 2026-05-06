import './ShortsSection.css'

type ShortsItem = {
  id: string
  title: string
  hash: string
  author: string
  views: string
  timeAgo: string
}

type ShortsSectionProps = {
  shorts: ShortsItem[]
}

function ShortsCard({ title, hash, author, views, timeAgo }: ShortsItem) {
  return (
    <article className="shorts-card">
      <div className="shorts-card__thumbnail">
        <div className="shorts-card__overlay">
          <h3>{title}</h3>
          <p>{hash}</p>
        </div>
      </div>
      <div className="shorts-card__body">
        <span className="shorts-card__avatar" aria-hidden="true" />
        <div>
          <strong>{author}</strong>
          <p>{views} · {timeAgo}</p>
        </div>
      </div>
    </article>
  )
}

function ShortsSection({ shorts }: ShortsSectionProps) {
  return (
    <section className="shorts-section" aria-label="쇼츠 영상">
      <div className="shorts-section__scroll" role="list" aria-label="쇼츠 영상 목록">
        {shorts.map((item) => (
          <div role="listitem" key={item.id}>
            <ShortsCard
              id={item.id}
              title={item.title}
              hash={item.hash}
              author={item.author}
              views={item.views}
              timeAgo={item.timeAgo}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default ShortsSection
