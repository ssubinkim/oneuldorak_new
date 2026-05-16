import { useEffect, useState } from 'react'
import BottomNav from '../../components/common/layout/BottomNav'
import { useUserProfile } from '../../components/common/useUserProfile'
import type { BoardDetailPost } from '../../components/community/boarddetailpage/BoardContent'
import type { BoardPost } from '../../components/community/boardpage/BoardList'
import {
  readPersistedCommunityWriteState,
  savePersistedCommunityWriteState,
} from '../../components/community/common/communityWritePersistence'
import {
  getRecipeIngredientsFromText,
  type RecipeDetail,
} from '../../components/recipedetailpage/recipeDetailData'
import CommunityWriteButton from '../../components/community/common/CommunityWriteButton'
import type { RecipeItem } from '../../components/community/recipepage/RecipeList'
import type { VoteCardItem } from '../../components/community/votepage/VoteList'
import type {
  CommunityMediaAttachment,
  CommunityWritePayload,
} from '../../components/community/communitywritepage/writeTypes'
import { getUniqueVoteOptions } from '../../components/community/communitywritepage/writeTypes'
import BoardDetailPage from './BoardDetailPage'
import BoardPage from './BoardPage'
import type { CommunityTabRoute } from './CommunityTabRoute'
import CommunityMainView from '../../components/community/communitypage/CommunityMainView'
import CommunityWritePage from './CommunityWritePage'
import { getWriteTabFromCommunityTab } from './getWriteTabFromCommunityTab'
import Header from '../../components/common/layout/Header'
import { consumeMypageCardTarget } from '../../components/mypage/mypageNavigation'
import RecipeDetailPage from '../recipedetail/RecipeDetailPage'
import RecipePage from './RecipePage'
import VotePage from './VotePage'
import '../../styles/Tailwind.css'
import './Community.css'

type CommunityTab = CommunityTabRoute
type CommunityView = 'main' | 'recipe' | 'free' | 'vote' | 'detail' | 'boardDetail' | 'write'
type CommunityInitialTarget = { kind: 'recipe' | 'board'; id: string }
type RegistrationToast = { id: number; message: string } | null

const DAY_MS = 24 * 60 * 60 * 1000

const tabViewMap: Record<CommunityTab, CommunityView> = {
  all: 'main',
  recipe: 'recipe',
  free: 'free',
  vote: 'vote',
}

function createTemporaryId(prefix: string) {
  return `${prefix}-${Date.now()}`
}

function getCommunityInitialTargetFromHash(): CommunityInitialTarget | null {
  if (typeof window === 'undefined') {
    return null
  }

  const queryString = window.location.hash.split('?')[1] ?? ''
  const searchParams = new URLSearchParams(queryString)
  const recipeId = searchParams.get('recipeId')
  const boardId = searchParams.get('boardId')

  if (recipeId) {
    consumeMypageCardTarget()
    return { kind: 'recipe', id: recipeId }
  }

  if (boardId) {
    consumeMypageCardTarget()
    return { kind: 'board', id: boardId }
  }

  return consumeMypageCardTarget()
}

const VALID_TABS: CommunityTab[] = ['all', 'recipe', 'free', 'vote']

function getInitialTabFromHash(): CommunityTab {
  if (typeof window === 'undefined') return 'all'
  const queryString = window.location.hash.split('?')[1] ?? ''
  const tab = new URLSearchParams(queryString).get('tab') as CommunityTab | null
  return tab && VALID_TABS.includes(tab) ? tab : 'all'
}

function getFilledText(value: string, fallback: string) {
  const trimmedValue = value.trim()

  return trimmedValue || fallback
}

function getSummaryText(value: string, fallback: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return fallback
  }

  return trimmedValue.length > 42 ? `${trimmedValue.slice(0, 42)}...` : trimmedValue
}

function getSeoulDate(dayOffset = 0) {
  const targetDate = new Date(Date.now() + dayOffset * DAY_MS)
  const dateParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(targetDate)
  const year = dateParts.find((part) => part.type === 'year')?.value ?? ''
  const month = dateParts.find((part) => part.type === 'month')?.value ?? ''
  const day = dateParts.find((part) => part.type === 'day')?.value ?? ''

  return `${year}.${month}.${day}`
}

function getTemporaryVoteOptions(options: string[]) {
  const filledOptions = getUniqueVoteOptions(options)
  const optionLabels = filledOptions.length >= 2 ? filledOptions : ['보기 1', '보기 2']

  return optionLabels.map((label) => ({ label, votes: 0 }))
}

function getVoteDurationDayOffset(duration: string) {
  if (duration === '오늘까지') {
    return 0
  }

  const parsedDay = Number(duration.match(/\d+/)?.[0] ?? 3)

  return Number.isFinite(parsedDay) ? parsedDay : 3
}

function getVoteDeadlineText(duration: string) {
  return `~ ${getSeoulDate(getVoteDurationDayOffset(duration))} 18:00`
}

function getMediaAttachmentUrl(attachment: CommunityMediaAttachment) {
  if (attachment.url) {
    return attachment.url
  }

  if (attachment.file && typeof URL !== 'undefined') {
    return URL.createObjectURL(attachment.file)
  }

  return ''
}

function mapCommunityMediaAttachments(media: CommunityMediaAttachment[]) {
  const nextAttachments: CommunityMediaAttachment[] = []

  media.forEach((attachment) => {
    const url = getMediaAttachmentUrl(attachment)

    if (!url) {
      return
    }

    nextAttachments.push({
      ...attachment,
      url,
      name: attachment.name ?? attachment.file?.name,
      size: attachment.size ?? attachment.file?.size,
    })
  })

  return nextAttachments
}

function getFirstMediaUrl(media: CommunityMediaAttachment[], kind: CommunityMediaAttachment['kind']) {
  return media.find((attachment) => attachment.kind === kind && attachment.url)?.url
}

function createRegisteredRecipe(
  payload: Extract<CommunityWritePayload, { tab: 'recipe' }>,
  author: string,
  authorId: string,
): RecipeItem {
  const { data } = payload
  const media = mapCommunityMediaAttachments(data.media)

  return {
    id: createTemporaryId('user-recipe'),
    title: getFilledText(data.title, '새 도시락 레시피'),
    subtitle: getSummaryText(data.content, '방금 등록한 도시락 레시피'),
    content: getFilledText(data.content, '방금 등록한 도시락 레시피'),
    price: data.budget || '예산 미정',
    time: data.time || '시간 미정',
    level: `난이도 ${data.difficulty}`,
    ingredient: data.ingredient.trim(),
    tools: data.tools,
    image: getFirstMediaUrl(media, 'image'),
    media,
    author,
    authorId,
    likes: 0,
    comments: 0,
    saves: 0,
  }
}

function getMinutesFromTimeLabel(timeLabel: string) {
  const parsedMinutes = Number(timeLabel.match(/\d+/)?.[0] ?? 0)
  return Number.isFinite(parsedMinutes) && parsedMinutes > 0 ? parsedMinutes : 15
}

function getDifficultyLevel(levelLabel: string) {
  const parsedLevel = Number(levelLabel.match(/\d+/)?.[0] ?? 1)
  return Number.isFinite(parsedLevel) && parsedLevel > 0 ? parsedLevel : 1
}

function mapRecipeItemToRecipeDetail(item: RecipeItem): RecipeDetail {
  return {
    id: item.id,
    title: item.title,
    summary: item.content ?? item.subtitle,
    meta: {
      authorName: item.author,
      authorId: item.authorId,
      publishedOn: getSeoulDate(),
    },
    cook: {
      durationMinutes: getMinutesFromTimeLabel(item.time),
      budgetLabel: item.price,
      difficultyLevel: getDifficultyLevel(item.level),
    },
    stats: {
      likeCount: item.likes,
      commentCount: item.comments,
      saveCount: item.saves,
    },
    ingredients: getRecipeIngredientsFromText(item.ingredient ?? ''),
    tools: item.tools?.map((tool, index) => ({
      id: `user-tool-${index}-${tool}`,
      label: tool,
    })),
    media: item.media,
  }
}

function createRegisteredBoardPost(
  payload: Extract<CommunityWritePayload, { tab: 'board' }>,
  user: string,
  authorId: string,
): BoardPost {
  const { data } = payload

  return {
    id: createTemporaryId('user-board'),
    category: data.category,
    title: getFilledText(data.title, '새 게시글'),
    body: getSummaryText(data.content, '방금 등록한 게시글입니다.'),
    user,
    authorId,
    timeAgo: '방금 전',
    likes: 0,
    comments: 0,
  }
}

function createRegisteredBoardDetailPost(
  payload: Extract<CommunityWritePayload, { tab: 'board' }>,
  author: string,
  authorId: string,
): BoardDetailPost {
  const { data } = payload
  const trimmedParagraphs = data.content
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return {
    id: createTemporaryId('user-board'),
    category: data.category,
    reward: '인기글 1P',
    title: getFilledText(data.title, '새 게시글'),
    author,
    authorId,
    timeAgo: '방금 전',
    likes: 0,
    comments: 0,
    paragraphs: trimmedParagraphs.length > 0 ? trimmedParagraphs : ['방금 등록한 게시글입니다.'],
    methods: [],
    media: mapCommunityMediaAttachments(data.media),
  }
}

function createRegisteredVote(
  payload: Extract<CommunityWritePayload, { tab: 'vote' }>,
  author: string,
  authorId: string,
): VoteCardItem {
  const { data } = payload

  return {
    id: createTemporaryId('user-vote'),
    question: getFilledText(data.title, '새 투표'),
    subtitle: getSummaryText(data.content, '방금 등록한 투표입니다.'),
    description: getFilledText(data.content, '방금 등록한 투표입니다.'),
    author,
    authorId,
    reward: '+1p',
    participants: 0,
    duration: data.duration,
    deadline: getVoteDeadlineText(data.duration),
    options: getTemporaryVoteOptions(data.options),
  }
}

function Community() {
  const { email, nickname } = useUserProfile()
  const [initialTarget] = useState(getCommunityInitialTargetFromHash)
  const [persistedWriteState] = useState(readPersistedCommunityWriteState)
  const [activeTab, setActiveTab] = useState<CommunityTab>(() => {
    if (initialTarget?.kind === 'recipe') return 'recipe'
    if (initialTarget?.kind === 'board') return 'free'
    return getInitialTabFromHash()
  })
  const [view, setView] = useState<CommunityView>(() => {
    if (initialTarget?.kind === 'recipe') return 'detail'
    if (initialTarget?.kind === 'board') return 'boardDetail'
    const tab = getInitialTabFromHash()
    return tab !== 'all' ? tabViewMap[tab] : 'main'
  })
  const [previousView, setPreviousView] = useState<CommunityView>(() =>
    initialTarget?.kind === 'recipe' ? 'recipe' : initialTarget?.kind === 'board' ? 'free' : 'main',
  )
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(
    initialTarget?.kind === 'recipe' ? initialTarget.id : null,
  )
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(
    initialTarget?.kind === 'board' ? initialTarget.id : null,
  )
  const [registeredRecipes, setRegisteredRecipes] = useState<RecipeItem[]>(persistedWriteState.recipes)
  const [registeredBoardPosts, setRegisteredBoardPosts] = useState<BoardPost[]>(persistedWriteState.boardPosts)
  const [registeredBoardDetailPosts, setRegisteredBoardDetailPosts] = useState<BoardDetailPost[]>(
    persistedWriteState.boardDetailPosts,
  )
  const [registeredVotes, setRegisteredVotes] = useState<VoteCardItem[]>(persistedWriteState.votes)
  const [registrationToast, setRegistrationToast] = useState<RegistrationToast>(null)
  const selectedRegisteredRecipe = selectedRecipeId
    ? registeredRecipes.find((recipe) => recipe.id === selectedRecipeId) ?? null
    : null

  useEffect(() => {
    setRegisteredBoardDetailPosts((previousPosts) =>
      previousPosts.map((post) =>
        post.id.startsWith('user-board')
          ? {
              ...post,
              methods: [],
            }
          : post,
      ),
    )
  }, [])

  useEffect(() => {
    savePersistedCommunityWriteState({
      recipes: registeredRecipes,
      boardPosts: registeredBoardPosts,
      boardDetailPosts: registeredBoardDetailPosts,
      votes: registeredVotes,
    })
  }, [registeredBoardDetailPosts, registeredBoardPosts, registeredRecipes, registeredVotes])

  useEffect(() => {
    if (!registrationToast) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setRegistrationToast(null)
    }, 2200)

    return () => window.clearTimeout(timeoutId)
  }, [registrationToast])

  const handleTabClick = (tab: CommunityTab) => {
    setActiveTab(tab)
    setView(tabViewMap[tab])
  }

  const handleOpenRecipeDetail = (recipeId: string) => {
    setSelectedRecipeId(recipeId)
    setView('detail')
  }

  const handleUpdateRecipe = (recipeId: string, data: Extract<CommunityWritePayload, { tab: 'recipe' }>['data']) => {
    const nextMedia = mapCommunityMediaAttachments(data.media)

    setRegisteredRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === recipeId
          ? {
              ...recipe,
              title: getFilledText(data.title, '새 도시락 레시피'),
              subtitle: getSummaryText(data.content, '방금 등록한 도시락 레시피'),
              content: getFilledText(data.content, '방금 등록한 도시락 레시피'),
              price: data.budget || '예산 미정',
              time: data.time || '시간 미정',
              level: `난이도 ${data.difficulty}`,
              ingredient: data.ingredient.trim(),
              tools: data.tools,
              image: getFirstMediaUrl(nextMedia, 'image'),
              media: nextMedia,
            }
          : recipe,
      ),
    )
  }

  const handleDeleteRecipe = (recipeId: string) => {
    setRegisteredRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== recipeId))
    setSelectedRecipeId(null)
    setActiveTab('recipe')
    setView('recipe')
  }

  const handleOpenBoardDetail = (postId: string) => {
    setSelectedBoardId(postId)
    setView('boardDetail')
  }

  const handleUpdateBoardPost = (postId: string, data: Extract<CommunityWritePayload, { tab: 'board' }>['data']) => {
    const nextTitle = getFilledText(data.title, '새 게시글')
    const nextBody = getSummaryText(data.content, '방금 등록한 게시글입니다.')
    const nextParagraphs = data.content
      .split(/\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)

    setRegisteredBoardPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              category: data.category,
              title: nextTitle,
              body: nextBody,
            }
          : post,
      ),
    )
    setRegisteredBoardDetailPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              category: data.category,
              title: nextTitle,
              paragraphs: nextParagraphs.length > 0 ? nextParagraphs : ['방금 등록한 게시글입니다.'],
              methods: [],
              media: mapCommunityMediaAttachments(data.media),
            }
          : post,
      ),
    )
  }

  const handleDeleteBoardPost = (postId: string) => {
    setRegisteredBoardPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
    setRegisteredBoardDetailPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
    setSelectedBoardId(null)
    setActiveTab('free')
    setView('free')
  }

  const handleUpdateVote = (voteId: string, data: Extract<CommunityWritePayload, { tab: 'vote' }>['data']) => {
    setRegisteredVotes((prevVotes) =>
      prevVotes.map((vote) => {
        if (vote.id !== voteId) {
          return vote
        }

        const nextOptionLabels = getUniqueVoteOptions(data.options)
        const previousOptionsByLabel = new Map(vote.options.map((option) => [option.label, option]))

        return {
          ...vote,
          question: getFilledText(data.title, '새 투표'),
          subtitle: getSummaryText(data.content, '방금 등록한 투표입니다.'),
          description: getFilledText(data.content, '방금 등록한 투표입니다.'),
          duration: data.duration,
          deadline: getVoteDeadlineText(data.duration),
          options: nextOptionLabels.map((label) => {
            const previousOption = previousOptionsByLabel.get(label)

            return {
              label,
              votes: previousOption?.votes ?? 0,
              highlighted: previousOption?.highlighted,
            }
          }),
        }
      }),
    )
  }

  const handleDeleteVote = (voteId: string) => {
    setRegisteredVotes((prevVotes) => prevVotes.filter((vote) => vote.id !== voteId))
  }

  const handleOpenWrite = () => {
    setPreviousView(view)
    setView('write')
  }

  const handleWriteSubmit = (payload: CommunityWritePayload) => {
    if (payload.tab === 'recipe') {
      setRegisteredRecipes((prevRecipes) => [createRegisteredRecipe(payload, nickname, email), ...prevRecipes])
      setActiveTab('recipe')
      setView('recipe')
    } else if (payload.tab === 'vote') {
      setRegisteredVotes((prevVotes) => [createRegisteredVote(payload, nickname, email), ...prevVotes])
      setActiveTab('vote')
      setView('vote')
    } else {
      const nextListPost = createRegisteredBoardPost(payload, nickname, email)
      const nextDetailPost = createRegisteredBoardDetailPost(payload, nickname, email)

      setRegisteredBoardPosts((prevPosts) => [nextListPost, ...prevPosts])
      setRegisteredBoardDetailPosts((prevPosts) => [{ ...nextDetailPost, id: nextListPost.id }, ...prevPosts])
      setActiveTab('free')
      setView('free')
    }

    setRegistrationToast({ id: Date.now(), message: '등록 되었습니다.' })
  }

  return (
    <div className="app-shell">
      <div className="app-screen">
        <Header />

        {registrationToast && (
          <div key={registrationToast.id} className="community-toast" role="status" aria-live="polite">
            {registrationToast.message}
          </div>
        )}

        {view === 'main' && (
          <CommunityMainView activeTab={activeTab} onSelectTab={handleTabClick} />
        )}

        {view === 'recipe' && (
          <RecipePage
            onSelectTab={handleTabClick}
            onOpenDetail={handleOpenRecipeDetail}
            extraRecipes={registeredRecipes}
          />
        )}

        {view === 'free' && (
          <BoardPage
            onSelectTab={handleTabClick}
            onOpenDetail={handleOpenBoardDetail}
            extraPosts={registeredBoardPosts}
          />
        )}

        {view === 'detail' && (
          <RecipeDetailPage
            recipeId={selectedRecipeId}
            overrideRecipe={selectedRegisteredRecipe ? mapRecipeItemToRecipeDetail(selectedRegisteredRecipe) : null}
            onUpdateRecipe={handleUpdateRecipe}
            onDeleteRecipe={handleDeleteRecipe}
            onBack={() => setView('recipe')}
          />
        )}

        {view === 'boardDetail' && (
          <BoardDetailPage
            postId={selectedBoardId}
            onBack={() => setView('free')}
            onOpenPost={handleOpenBoardDetail}
            onUpdatePost={handleUpdateBoardPost}
            onDeletePost={handleDeleteBoardPost}
            extraPosts={registeredBoardDetailPosts}
          />
        )}

        {view === 'vote' && (
          <VotePage
            onSelectTab={handleTabClick}
            extraVotes={registeredVotes}
            onUpdateVote={handleUpdateVote}
            onDeleteVote={handleDeleteVote}
          />
        )}

        {view === 'write' && (
          <CommunityWritePage
            initialTab={getWriteTabFromCommunityTab(activeTab)}
            onBack={() => setView(previousView)}
            onSubmit={handleWriteSubmit}
          />
        )}

        {view !== 'write' && (
          <CommunityWriteButton
            className="community-page__write-button"
            aria-label="글쓰기"
            onClick={handleOpenWrite}
          />
        )}

        <BottomNav />
      </div>
    </div>
  )
}

export default Community
