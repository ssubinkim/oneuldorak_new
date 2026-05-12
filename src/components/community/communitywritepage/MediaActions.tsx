import WriteTopIcon from './WriteTopIcon'
import './MediaActions.css'

function MediaActions() {
  return (
    <div className="community-write-media-row">
      <button type="button" className="community-write-media-button">
        <WriteTopIcon kind="image" />
        <span>사진</span>
      </button>
      <button type="button" className="community-write-media-button">
        <WriteTopIcon kind="video" />
        <span>동영상</span>
      </button>
    </div>
  )
}

export default MediaActions
