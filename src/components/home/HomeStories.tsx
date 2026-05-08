import './HomeStories.css'

const stories = [
  { title: '자취생 추천! 가성비 반찬...', likes: 100, comments: 88 },
  { title: '일주일 3만원 식비 도전기', likes: 96, comments: 65 },
  { title: '요리 초보 탈출한 계기', likes: 65, comments: 52 },
  { title: '도시락 꿀팁 알려줌', likes: 43, comments: 35 },
  { title: '맛집 알려줄게 다 들어와~~~', likes: 36, comments: 13 },
]

function HomeStories() {
  return (
    <section className="stories-section" aria-labelledby="storiesTitle">
      <div className="home-section-title stories-section__title">
        <div>
          <h2 id="storiesTitle">도락이들의 이야기</h2>
          <p>이번주 인기를 TOP5</p>
        </div>
        <a href="#more-stories">더보기 〉</a>
      </div>
      <ol className="story-list">
        {stories.map((story, index) => (
          <li className="story-item" key={story.title}>
            <span className="story-item__rank">{index + 1}</span>
            <span className="story-item__thumb" aria-hidden="true" />
            <span className="story-item__body">
              <span className="story-item__title">{story.title}</span>
              <span className="story-item__stats">
                <span className="heart">♡</span>
                {story.likes} · ◎{story.comments}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default HomeStories
