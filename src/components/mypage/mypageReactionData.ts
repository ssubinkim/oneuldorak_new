import {
  getBoardReactionKey,
  readPersistedBoardLikeKeys,
} from '../community/common/boardReactionPersistence'
import { readPersistedBoardComments } from '../community/common/boardCommentPersistence'
import { mockBoardDetailPosts } from '../community/common/boardMockData'
import { readPersistedCommunityWriteState } from '../community/common/communityWritePersistence'
import { getRecipeDetail, type RecipeId } from '../recipedetailpage/recipeDetailData'
import { getAllPersistedRecipeDetailState } from '../recipedetailpage/recipeDetailPersistence'
import type { LikePost } from './like-page/LikePostCard'
import { LIKE_RECIPES, LIKED_POSTS } from './like-page/likePageData'
import type { SavedRecipe } from './saved-recipe-page/SavedRecipeCard'

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

export function getMyPageActivityCounts(currentUserId: string) {
  const persistedWriteState = readPersistedCommunityWriteState()
  const persistedRecipeStateMap = getAllPersistedRecipeDetailState()
  const persistedBoardComments = readPersistedBoardComments()

  const likeCount =
    getLikedBoardPosts(currentUserId).length +
    Object.values(persistedRecipeStateMap).filter((state) => state.isLiked).length +
    LIKE_RECIPES.length +
    LIKED_POSTS.length

  const postCount = [
    ...persistedWriteState.recipes,
    ...persistedWriteState.boardPosts,
    ...persistedWriteState.votes,
  ].filter((post) => post.authorId === currentUserId).length

  const boardCommentCount = Object.values(persistedBoardComments).reduce(
    (count, comments) => count + comments.filter((comment) => comment.authorId === currentUserId).length,
    0,
  )
  const recipeCommentCount = Object.values(persistedRecipeStateMap).reduce(
    (count, state) => count + state.comments.filter((comment) => comment.authorId === currentUserId).length,
    0,
  )

  return {
    likes: likeCount,
    posts: postCount,
    comments: boardCommentCount + recipeCommentCount,
  }
}

export function getLikedRecipePosts(): LikePost[] {
  const persistedRecipeStateMap = getAllPersistedRecipeDetailState()

  return Object.entries(persistedRecipeStateMap)
    .filter(([, state]) => state.isLiked)
    .map(([recipeId, state]) => ({
      id: `liked-recipe:${recipeId}`,
      category: '레시피',
      showIcon: true,
      title: getRecipeTitleById(recipeId) || '저장한 레시피',
      savedAt: getRelativeActionLabel(state.updatedAt, '좋아요'),
      target: { kind: 'recipe', id: recipeId },
    }))
}

export function getLikedBoardPosts(currentUserId: string): LikePost[] {
  const likedBoardKeys = readPersistedBoardLikeKeys()
  const persistedBoardDetails = readPersistedCommunityWriteState().boardDetailPosts
  const boardDetails = [...persistedBoardDetails, ...mockBoardDetailPosts]

  return boardDetails
    .filter((post, index, posts) => posts.findIndex((candidate) => candidate.id === post.id) === index)
    .filter((post) => likedBoardKeys.includes(getBoardReactionKey(post.id, currentUserId)))
    .map((post) => ({
      id: `liked-board:${post.id}`,
      category: post.category,
      showIcon: true,
      title: post.title,
      savedAt: '방금 전 좋아요',
      target: { kind: 'board', id: post.id },
    }))
}

export function getSavedRecipeCards(): SavedRecipe[] {
  const persistedRecipeStateMap = getAllPersistedRecipeDetailState()

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
