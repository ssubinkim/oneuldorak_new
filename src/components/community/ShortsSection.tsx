import './ShortsSection.css'

type ShortsItem = {
  id: string
  title: string
  duration: string
  views: string
}

type ShortsSectionProps = {
  shorts: ShortsItem[]
}

function ShortsCard({ title, duration, views }: ShortsItem) {
  return (
    <article className="shorts-card">
      <div className="shorts-card__thumbnail">
        <button type="button" className="shorts-card__play" aria-label={`${title} 재생`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 7.5v9l7-4.5-7-4.5Z" />
          </svg>
        </button>
        <span className="shorts-card__duration">{duration}</span>
      </div>
      <div className="shorts-card__body">
        <h3>{title}</h3>
        <p>{views}</p>
      </div>
    </article>
  )
}

function ShortsSection({ shorts }: ShortsSectionProps) {
  return (
    <section className="shorts-section" aria-labelledby="shorts-section-title">
      <h2 id="shorts-section-title">쇼츠</h2>
      <div className="shorts-section__scroll" role="list" aria-label="쇼츠 영상 목록">
        {shorts.map((item) => (
          <div role="listitem" key={item.id}>
            <ShortsCard
              id={item.id}
              title={item.title}
              duration={item.duration}
              views={item.views}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default ShortsSection
