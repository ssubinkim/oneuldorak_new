import {
  readPersistedBoardLikeKeys,
} from '../community/common/boardReactionPersistence'
import { readPersistedBoardComments } from '../community/common/boardCommentPersistence'
import { mockBoardDetailPosts, mockBoardPosts } from '../community/common/boardMockData'
import { readPersistedCommunityWriteState } from '../community/common/communityWritePersistence'
import { getRecipeDetail, type RecipeId } from '../recipedetailpage/recipeDetailData'
import { getAllPersistedRecipeDetailState } from '../recipedetailpage/recipeDetailPersistence'
import type { LikePost } from './like-page/LikePostCard'
import type { LikeRecipe } from './like-page/likePageData'
import type { SavedRecipe } from './saved-recipe-page/SavedRecipeCard'
import defaultRecipeImage from '../../assets/images/food_imges/today_menu.png'

const mockRecipeIds = new Set<string>(['recipe-1', 'recipe-2', 'recipe-3'])

function isMockRecipeId(recipeId: string): recipeId is RecipeId {
  return mockRecipeIds.has(recipeId)
}

function getRelativeActionLabel(updatedAt: string, actionLabel: string) {
  if (!updatedAt) {
    return `방금 전 ${actionLabel}`
  }

  const updatedTime = new Date(updatedAt).getTime()

  if (!Number.isFinite(updatedTime)) {
    return `방금 전 ${actionLabel}`
  }

  const diffMinutes = Math.max(0, Math.floor((Date.now() - updatedTime) / 60000))

  if (diffMinutes < 1) {
    return `방금 전 ${actionLabel}`
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전 ${actionLabel}`
  }

  const diffHours = Math.floor(diffMinutes / 60)

  if (diffHours < 24) {
    return `${diffHours}시간 전 ${actionLabel}`
  }

  const diffDays = Math.floor(diffHours / 24)

  return `${diffDays}일 전 ${actionLabel}`
}

function getRecipeTitleById(recipeId: string) {
  const persistedRecipes = readPersistedCommunityWriteState().recipes
  const persistedRecipe = persistedRecipes.find((recipe) => recipe.id === recipeId)

  if (persistedRecipe) {
    return persistedRecipe.title
  }

  if (isMockRecipeId(recipeId)) {
    return getRecipeDetail(recipeId).title
  }

  return ''
}

function getRecipeDifficultyLabel(difficultyLevel: number) {
  if (difficultyLevel <= 1) {
    return '쉬움'
  }

  if (difficultyLevel === 2) {
    return '보통'
  }

  return '어려움'
}

function getTimestampFromId(value: string) {
  const matchedTimestamp = value.match(/(\d{10,13})(?!.*\d)/)?.[1]

  if (!matchedTimestamp) {
    return 0
  }

  const numericTimestamp = Number(matchedTimestamp)

  return Number.isFinite(numericTimestamp) ? numericTimestamp : 0
}

function normalizeIdentity(value: string | undefined) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

function isOwnedByCurrentUser(
  authorId: string | undefined,
  authorName: string | undefined,
  currentUserId: string,
  currentUserNickname?: string,
) {
  const normalizedCurrentUserId = normalizeIdentity(currentUserId)
  const normalizedAuthorId = normalizeIdentity(authorId)

  if (normalizedCurrentUserId && normalizedAuthorId) {
    return normalizedCurrentUserId === normalizedAuthorId
  }

  if (normalizedAuthorId) {
    return false
  }

  const normalizedCurrentUserNickname = normalizeIdentity(currentUserNickname)
  const normalizedAuthorName = normalizeIdentity(authorName)

  if (!normalizedCurrentUserNickname || !normalizedAuthorName) {
    return false
  }

  return normalizedCurrentUserNickname === normalizedAuthorName
}

type LikeRecipeMeta = {
  image: string
  description: string
  title: string
  price: string
  time: string
  difficulty: string
}

function getRecipeLikeMeta(recipeId: string): LikeRecipeMeta {
  const persistedRecipe = readPersistedCommunityWriteState().recipes.find((recipe) => recipe.id === recipeId)

  if (persistedRecipe) {
    return {
      image: persistedRecipe.image ?? defaultRecipeImage,
      description: persistedRecipe.subtitle || '저장한 레시피',
      title: persistedRecipe.title,
      price: persistedRecipe.price || '예산 정보 없음',
      time: persistedRecipe.time || '시간 정보 없음',
      difficulty: persistedRecipe.level || '난이도 정보 없음',
    }
  }

  if (isMockRecipeId(recipeId)) {
    const recipe = getRecipeDetail(recipeId)

    return {
      image: defaultRecipeImage,
      description: recipe.summary,
      title: recipe.title,
      price: recipe.cook.budgetLabel,
      time: `${recipe.cook.durationMinutes}분`,
      difficulty: getRecipeDifficultyLabel(recipe.cook.difficultyLevel),
    }
  }

  return {
    image: defaultRecipeImage,
    description: '저장한 레시피',
    title: '저장한 레시피',
    price: '예산 정보 없음',
    time: '시간 정보 없음',
    difficulty: '난이도 정보 없음',
  }
}

function getBoardTitleById(postId: string) {
  const persistedPosts = readPersistedCommunityWriteState().boardDetailPosts
  const boardPost = [...persistedPosts, ...mockBoardDetailPosts].find((post) => post.id === postId)

  return boardPost?.title ?? '게시글'
}

function getLikedBoardPostIds(currentUserId: string) {
  const likedBoardKeys = readPersistedBoardLikeKeys()
  const normalizedCurrentUserId = normalizeIdentity(currentUserId)
  if (!normalizedCurrentUserId) {
    return []
  }

  const likedPostIds = likedBoardKeys
    .map((reactionKey) => {
      const separatorIndex = reactionKey.indexOf(':')
      if (separatorIndex <= 0) {
        return null
      }

      const ownerUserId = reactionKey.slice(0, separatorIndex)
      const postId = reactionKey.slice(separatorIndex + 1)

      if (!postId) {
        return null
      }

      return normalizeIdentity(ownerUserId) === normalizedCurrentUserId
        ? postId
        : null
    })
    .filter((postId): postId is string => Boolean(postId))

  return Array.from(new Set(likedPostIds))
}

export function getMyPageActivityCounts(currentUserId: string, currentUserNickname?: string) {
  const persistedWriteState = readPersistedCommunityWriteState()
  const persistedRecipeStateMap = getAllPersistedRecipeDetailState(currentUserId)
  const persistedBoardComments = readPersistedBoardComments()

  const likeCount = getLikedBoardPostIds(currentUserId).length + getLikedRecipes(currentUserId).length

  const recipePostCount = persistedWriteState.recipes.filter((recipe) =>
    isOwnedByCurrentUser(recipe.authorId, recipe.author, currentUserId, currentUserNickname),
  ).length
  const boardPostCount = persistedWriteState.boardPosts.filter((post) =>
    isOwnedByCurrentUser(post.authorId, post.user, currentUserId, currentUserNickname),
  ).length
  const votePostCount = persistedWriteState.votes.filter((vote) =>
    isOwnedByCurrentUser(vote.authorId, vote.author, currentUserId, currentUserNickname),
  ).length

  const boardCommentCount = Object.values(persistedBoardComments).reduce(
    (count, comments) =>
      count +
      comments.filter((comment) =>
        isOwnedByCurrentUser(comment.authorId, comment.user, currentUserId, currentUserNickname),
      ).length,
    0,
  )
  const recipeCommentCount = Object.values(persistedRecipeStateMap).reduce(
    (count, state) =>
      count +
      state.comments.filter((comment) =>
        isOwnedByCurrentUser(comment.authorId, comment.authorName, currentUserId, currentUserNickname),
      ).length,
    0,
  )

  return {
    likes: likeCount,
    posts: recipePostCount + boardPostCount + votePostCount,
    comments: boardCommentCount + recipeCommentCount,
  }
}

export function getLikedRecipes(currentUserId?: string): LikeRecipe[] {
  const persistedRecipeStateMap = getAllPersistedRecipeDetailState(currentUserId)

  return Object.entries(persistedRecipeStateMap)
    .filter(([, state]) => state.isLiked)
    .sort((left, right) => {
      const rightTime = new Date(right[1].updatedAt).getTime()
      const leftTime = new Date(left[1].updatedAt).getTime()

      return (Number.isFinite(rightTime) ? rightTime : 0) - (Number.isFinite(leftTime) ? leftTime : 0)
    })
    .map(([recipeId, state]) => {
      const recipeMeta = getRecipeLikeMeta(recipeId)

      return {
        id: `liked-recipe:${recipeId}`,
        image: recipeMeta.image,
        description: recipeMeta.description,
        title: recipeMeta.title,
        price: recipeMeta.price,
        time: recipeMeta.time,
        difficulty: recipeMeta.difficulty,
        savedAt: getRelativeActionLabel(state.updatedAt, '좋아요'),
        target: { kind: 'recipe', id: recipeId },
      }
    })
}

export function getLikedRecipePosts(): LikePost[] {
  return getLikedRecipes().map((recipe) => ({
    id: String(recipe.id),
    category: '레시피',
    showIcon: true,
    title: recipe.title,
    preview: recipe.description,
    savedAt: recipe.savedAt,
    target: recipe.target,
  }))
}

export function getLikedBoardPosts(currentUserId: string): LikePost[] {
  const persistedWriteState = readPersistedCommunityWriteState()
  const likedPostIds = getLikedBoardPostIds(currentUserId)
  const boardDetails = [...persistedWriteState.boardDetailPosts, ...mockBoardDetailPosts]
  const boardPosts = [...persistedWriteState.boardPosts, ...mockBoardPosts]
  const boardDetailsById = new Map(
    boardDetails.map((post) => [post.id, post] as const),
  )
  const boardPostsById = new Map(
    boardPosts.map((post) => [post.id, post] as const),
  )

  return likedPostIds.map((postId) => {
    const boardDetail = boardDetailsById.get(postId)
    const boardPost = boardPostsById.get(postId)

    return {
      id: `liked-board:${postId}`,
      category: boardDetail?.category ?? boardPost?.category ?? '게시글',
      showIcon: true,
      title: boardDetail?.title ?? boardPost?.title ?? '게시글',
      savedAt: '방금 전 좋아요',
      target: { kind: 'board' as const, id: postId },
    }
  })
}

export function getMyWrittenPosts(currentUserId: string, currentUserNickname?: string): LikePost[] {
  const persistedWriteState = readPersistedCommunityWriteState()
  const recipePosts = persistedWriteState.recipes
    .filter((recipe) => isOwnedByCurrentUser(recipe.authorId, recipe.author, currentUserId, currentUserNickname))
    .map((recipe) => ({
      id: `mypage-written-recipe:${recipe.id}`,
      category: '레시피',
      showIcon: false,
      title: recipe.title,
      preview: recipe.subtitle || recipe.content || '작성한 레시피입니다.',
      savedAt: getRelativeActionLabel(
        new Date(getTimestampFromId(recipe.id) || Date.now()).toISOString(),
        '작성',
      ),
      target: { kind: 'recipe' as const, id: recipe.id },
    }))

  const boardPosts = persistedWriteState.boardPosts
    .filter((post) => isOwnedByCurrentUser(post.authorId, post.user, currentUserId, currentUserNickname))
    .map((post) => ({
      id: `mypage-written-board:${post.id}`,
      category: post.category,
      showIcon: false,
      title: post.title,
      preview: post.body,
      savedAt: getRelativeActionLabel(
        new Date(getTimestampFromId(post.id) || Date.now()).toISOString(),
        '작성',
      ),
      target: { kind: 'board' as const, id: post.id },
    }))

  const votePosts = persistedWriteState.votes
    .filter((vote) => isOwnedByCurrentUser(vote.authorId, vote.author, currentUserId, currentUserNickname))
    .map((vote) => ({
      id: `mypage-written-vote:${vote.id}`,
      category: '투표',
      showIcon: false,
      title: vote.question,
      preview: vote.subtitle || vote.description || '작성한 투표입니다.',
      savedAt: getRelativeActionLabel(
        new Date(getTimestampFromId(vote.id) || Date.now()).toISOString(),
        '작성',
      ),
    }))

  return [...recipePosts, ...boardPosts, ...votePosts].sort(
    (left, right) => getTimestampFromId(String(right.id)) - getTimestampFromId(String(left.id)),
  )
}

export function getMyCommentPosts(currentUserId: string, currentUserNickname?: string): LikePost[] {
  const persistedBoardComments = readPersistedBoardComments()
  const persistedRecipeStateMap = getAllPersistedRecipeDetailState(currentUserId)
  const boardCommentPosts = Object.entries(persistedBoardComments).flatMap(([postId, comments]) =>
    comments
      .filter((comment) =>
        isOwnedByCurrentUser(comment.authorId, comment.user, currentUserId, currentUserNickname),
      )
      .map((comment) => ({
        id: `mypage-comment-board:${postId}:${comment.id}`,
        category: '게시글',
        showIcon: false,
        title: getBoardTitleById(postId),
        preview: comment.text,
        savedAt: getRelativeActionLabel(
          new Date(getTimestampFromId(comment.id) || Date.now()).toISOString(),
          '댓글',
        ),
        target: { kind: 'board' as const, id: postId },
      })),
  )

  const recipeCommentPosts = Object.entries(persistedRecipeStateMap).flatMap(([recipeId, state]) =>
    state.comments
      .filter((comment) =>
        isOwnedByCurrentUser(comment.authorId, comment.authorName, currentUserId, currentUserNickname),
      )
      .map((comment) => ({
        id: `mypage-comment-recipe:${recipeId}:${comment.id}`,
        category: '레시피',
        showIcon: false,
        title: getRecipeTitleById(recipeId) || '레시피',
        preview: comment.content,
        savedAt: getRelativeActionLabel(
          new Date(getTimestampFromId(comment.id) || Date.now()).toISOString(),
          '댓글',
        ),
        target: { kind: 'recipe' as const, id: recipeId },
      })),
  )

  return [...boardCommentPosts, ...recipeCommentPosts].sort(
    (left, right) => getTimestampFromId(String(right.id)) - getTimestampFromId(String(left.id)),
  )
}

export function getSavedRecipeCards(currentUserId?: string): SavedRecipe[] {
  const persistedRecipeStateMap = getAllPersistedRecipeDetailState(currentUserId)

  return Object.entries(persistedRecipeStateMap)
    .filter(([, state]) => state.isSaved)
    .map(([recipeId, state]) => ({
      id: `saved-recipe:${recipeId}`,
      showIcon: true,
      title: getRecipeTitleById(recipeId) || '저장한 레시피',
      savedAt: getRelativeActionLabel(state.updatedAt, '저장'),
      target: { kind: 'recipe', id: recipeId },
    }))
}
