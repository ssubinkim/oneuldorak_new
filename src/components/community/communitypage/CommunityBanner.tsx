import CommunitySearchBar from '../common/CommunitySearchBar'
import './CommunityBanner.css'
import defaultBannerImage from '../../../pages/community/images/dorak02.png'
import recipeBannerImage from '../../../assets/food_mascot_all/dorak18.png'
import boardBannerImage from '../common/images/communityboard.png'
import voteBannerImage from '../../../assets/food_mascot_all/dorak20.png'

type CommunityBannerVariant = 'default' | 'recipe' | 'board' | 'vote'

type CommunityBannerProps = {
  variant?: CommunityBannerVariant
  isCompact?: boolean
  hideHeader?: boolean
  isSearchOpen?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
  onSearchToggle?: () => void
  onSearchClose?: () => void
}

const bannerImageByVariant: Record<CommunityBannerVariant, string> = {
  default: defaultBannerImage,
  recipe: recipeBannerImage,
  board: boardBannerImage,
  vote: voteBannerImage,
}

function CommunityBanner({
  variant = 'default',
  isCompact = false,
  hideHeader = false,
  isSearchOpen = false,
  searchValue = '',
  onSearchChange,
  onSearchToggle,
  onSearchClose,
}: CommunityBannerProps) {
  const bannerImage = bannerImageByVariant[variant]

  return (
    <section className={`community-banner community-banner--${variant}${isCompact ? ' is-compact' : ''}`}>
      {!hideHeader && (
        <div className="community-banner__header">
          <h1>커뮤니티</h1>
          <div className="community-banner__actions">
            {isSearchOpen && onSearchChange && onSearchClose ? (
              <CommunitySearchBar
                className="community-banner__search-inline"
                value={searchValue}
                onChange={onSearchChange}
                onClose={onSearchClose}
                onBlur={onSearchClose}
                showCloseButton={false}
                autoFocus={!isCompact}
              />
            ) : (
              <button
                type="button"
                aria-label="검색"
                aria-expanded={isSearchOpen}
                onClick={onSearchToggle}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      <p className="community-banner__subtitle">
        오늘도 바쁜 도락이들의 도시락 이야기<br />
        도시락도 ROCK이다!
      </p>
      <img src={bannerImage} alt="" className="community-banner__image" aria-hidden="true" />
    </section>
  )
}

export default CommunityBanner
