import type { WriteTab } from '../../components/community/communitywritepage/writeTab'
import type { CommunityTabRoute } from './CommunityTabRoute'

export function getWriteTabFromCommunityTab(tab: CommunityTabRoute): WriteTab {
  if (tab === 'recipe') return 'recipe'
  if (tab === 'vote') return 'vote'

  return 'board'
}
