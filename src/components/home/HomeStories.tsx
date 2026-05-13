import SequentialHighlightList from '../effects/stagger/SequentialHighlightList'
import chatImage from './images/chat.png'
import './HomeStories.css'

const stories = [
  { id: 1, title: '자취생 추천! 가성비 반찬 레시피 모음', likes: 100, comments: 88 },
  { id: 2, title: '일주일 3만원 식비 도전기', likes: 96, comments: 65 },
  { id: 3, title: '요리 초보 탈출한 계기', likes: 65, comments: 52 },
  { id: 4, title: '도시락 꿀팁 알려줌', likes: 43, comments: 35 },
  { id: 5, title: '맛집 알려줄게 다 들어와~~~', likes: 36, comments: 13 },
]

const topStories = stories.slice(0, 3)

function HomeStories() {
  return (
    <section className="stories-section font-pretendard" aria-labelledby="storiesTitle">
      <div className="stories-section__intro">
        <div className="stories-section__copy">
          <h2 id="storiesTitle">
            지금 인기 있는
            <br />
            생활 이야기 <span aria-hidden="true">👀</span>
          </h2>
          <a className="stories-section__link" href="#more-stories">
            이번주 인기글 TOP3
            <br />
            보러가기 &gt;
          </a>
        </div>
        <img className="stories-section__character" src={chatImage} alt="" aria-hidden="true" />
      </div>

      <div className="story-list">
        <SequentialHighlightList
          className="stories-section__stagger"
          items={topStories}
          intervalMs={1200}
          startIndex={0}
          loop
          autoplay
        />
      </div>
    </section>
  )
}

export default HomeStories
