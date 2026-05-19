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
type CommunityContentTab = 'recipe' | 'free' | 'vote'
type RegistrationModalState = {
  id: number
  message: string
  tab: CommunityContentTab
  targetId: string
} | null
type FocusTarget = { tab: CommunityContentTab; targetId: string } | null

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

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Failed to read media file.'))
    }
    reader.onerror = () => reject(new Error('Failed to read media file.'))
    reader.readAsDataURL(file)
  })
}

function isPersistableMediaUrl(url: string) {
  return Boolean(url) && !url.startsWith('blob:')
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

async function normalizeCommunityMediaAttachment(
  attachment: CommunityMediaAttachment,
): Promise<CommunityMediaAttachment | null> {
  const name = attachment.name ?? attachment.file?.name
  const size = attachment.size ?? attachment.file?.size
  const persistableAttachment: CommunityMediaAttachment = {
    id: attachment.id,
    kind: attachment.kind,
    name,
    size,
  }

  if (attachment.file && attachment.kind === 'image') {
    return {
      ...persistableAttachment,
      url: await readFileAsDataUrl(attachment.file),
      name,
      size,
    }
  }

  if (attachment.url && isPersistableMediaUrl(attachment.url)) {
    return {
      ...persistableAttachment,
      url: attachment.url,
      name,
      size,
    }
  }

  return null
}

async function mapCommunityMediaAttachments(media: CommunityMediaAttachment[]): Promise<CommunityMediaAttachment[]> {
  const nextAttachments = await Promise.all(media.map(normalizeCommunityMediaAttachment))

  return nextAttachments.filter((attachment): attachment is CommunityMediaAttachment => Boolean(attachment))
}

function getFirstMediaUrl(media: CommunityMediaAttachment[], kind: CommunityMediaAttachment['kind']) {
  return media.find((attachment) => attachment.kind === kind && attachment.url)?.url
}

async function createRegisteredRecipe(
  payload: Extract<CommunityWritePayload, { tab: 'recipe' }>,
  author: string,
  authorId: string,
): Promise<RecipeItem> {
  const { data } = payload
  const media = await mapCommunityMediaAttachments(data.media)

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

async function createRegisteredBoardDetailPost(
  payload: Extract<CommunityWritePayload, { tab: 'board' }>,
  author: string,
  authorId: string,
): Promise<BoardDetailPost> {
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
    media: await mapCommunityMediaAttachments(data.media),
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

function normalizeRegisteredBoardDetailPosts(posts: BoardDetailPost[]) {
  return posts.map((post) =>
    post.id.startsWith('user-board')
      ? {
          ...post,
          methods: [],
        }
      : post,
  )
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
    () => normalizeRegisteredBoardDetailPosts(persistedWriteState.boardDetailPosts),
  )
  const [registeredVotes, setRegisteredVotes] = useState<VoteCardItem[]>(persistedWriteState.votes)
  const [registrationModal, setRegistrationModal] = useState<RegistrationModalState>(null)
  const [focusTarget, setFocusTarget] = useState<FocusTarget>(null)
  const selectedRegisteredRecipe = selectedRecipeId
    ? registeredRecipes.find((recipe) => recipe.id === selectedRecipeId) ?? null
    : null

  useEffect(() => {
    savePersistedCommunityWriteState({
      recipes: registeredRecipes,
      boardPosts: registeredBoardPosts,
      boardDetailPosts: registeredBoardDetailPosts,
      votes: registeredVotes,
    })
  }, [registeredBoardDetailPosts, registeredBoardPosts, registeredRecipes, registeredVotes])

  const handleTabClick = (tab: CommunityTab) => {
    setActiveTab(tab)
    setView(tabViewMap[tab])
  }

  const handleOpenRecipeDetail = (recipeId: string) => {
    setSelectedRecipeId(recipeId)
    setView('detail')
  }

  const handleUpdateRecipe = async (recipeId: string, data: Extract<CommunityWritePayload, { tab: 'recipe' }>['data']) => {
    const nextMedia = await mapCommunityMediaAttachments(data.media)

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

    return {
      ...data,
      media: nextMedia,
    }
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

  const handleUpdateBoardPost = async (postId: string, data: Extract<CommunityWritePayload, { tab: 'board' }>['data']) => {
    const nextMedia = await mapCommunityMediaAttachments(data.media)
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
              media: nextMedia,
            }
          : post,
      ),
    )

    return {
      ...data,
      media: nextMedia,
    }
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

  const handleRegistrationModalClose = () => {
    if (!registrationModal) {
      return
    }

    setFocusTarget({
      tab: registrationModal.tab,
      targetId: registrationModal.targetId,
    })
    setRegistrationModal(null)
  }

  const handleRecipeFocusConsumed = () => {
    setFocusTarget((previousTarget) => (previousTarget?.tab === 'recipe' ? null : previousTarget))
  }

  const handleBoardFocusConsumed = () => {
    setFocusTarget((previousTarget) => (previousTarget?.tab === 'free' ? null : previousTarget))
  }

  const handleVoteFocusConsumed = () => {
    setFocusTarget((previousTarget) => (previousTarget?.tab === 'vote' ? null : previousTarget))
  }

  const handleWriteSubmit = async (payload: CommunityWritePayload) => {
    let nextTarget: NonNullable<FocusTarget>

    if (payload.tab === 'recipe') {
      const nextRecipe = await createRegisteredRecipe(payload, nickname, email)
      setRegisteredRecipes((prevRecipes) => [nextRecipe, ...prevRecipes])
      setActiveTab('recipe')
      setView('recipe')
      nextTarget = { tab: 'recipe', targetId: nextRecipe.id }
    } else if (payload.tab === 'vote') {
      const nextVote = createRegisteredVote(payload, nickname, email)
      setRegisteredVotes((prevVotes) => [nextVote, ...prevVotes])
      setActiveTab('vote')
      setView('vote')
      nextTarget = { tab: 'vote', targetId: nextVote.id }
    } else {
      const nextListPost = createRegisteredBoardPost(payload, nickname, email)
      const nextDetailPost = await createRegisteredBoardDetailPost(payload, nickname, email)

      setRegisteredBoardPosts((prevPosts) => [nextListPost, ...prevPosts])
      setRegisteredBoardDetailPosts((prevPosts) => [{ ...nextDetailPost, id: nextListPost.id }, ...prevPosts])
      setActiveTab('free')
      setView('free')
      nextTarget = { tab: 'free', targetId: nextListPost.id }
    }

    if (nextTarget) {
      setRegistrationModal({
        id: Date.now(),
        message: '등록이 완료되었어요. 내 글로 이동할까요?',
        tab: nextTarget.tab,
        targetId: nextTarget.targetId,
      })
    }
  }

  return (
    <div className="app-shell">
      <div className="app-screen">
        <Header />

        {registrationModal && (
          <div
            key={registrationModal.id}
            className="community-registration-modal"
            role="presentation"
            onClick={handleRegistrationModalClose}
          >
            <section
              className="community-registration-modal__panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="community-registration-modal-title"
              aria-describedby="community-registration-modal-description"
              onClick={(event) => event.stopPropagation()}
            >
              <h2 id="community-registration-modal-title">등록 완료</h2>
              <p id="community-registration-modal-description">{registrationModal.message}</p>
              <button type="button" onClick={handleRegistrationModalClose}>작성한 글 보기</button>
            </section>
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
            focusRecipeId={focusTarget?.tab === 'recipe' ? focusTarget.targetId : null}
            onFocusHandled={handleRecipeFocusConsumed}
          />
        )}

        {view === 'free' && (
          <BoardPage
            onSelectTab={handleTabClick}
            onOpenDetail={handleOpenBoardDetail}
            extraPosts={registeredBoardPosts}
            focusPostId={focusTarget?.tab === 'free' ? focusTarget.targetId : null}
            onFocusHandled={handleBoardFocusConsumed}
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
            focusVoteId={focusTarget?.tab === 'vote' ? focusTarget.targetId : null}
            onFocusHandled={handleVoteFocusConsumed}
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
