import { useEffect, useRef, useState } from 'react'
import { useUserProfile } from '../../components/common/useUserProfile'
import BoardContent, { type BoardDetailPost } from '../../components/community/boarddetailpage/BoardContent'
import type { BoardComment } from '../../components/community/boarddetailpage/CommentItem'
import CommentSection from '../../components/community/boarddetailpage/CommentSection'
import BoardWriteForm from '../../components/community/communitywritepage/BoardWriteForm'
import type { BoardWriteData } from '../../components/community/communitywritepage/writeTypes'
import { mockBoardComments, mockBoardDetailPosts } from '../../components/community/common/boardMockData'
import RelatedBoards from '../../components/community/boarddetailpage/RelatedBoards'
import './BoardDetailPage.css'

type BoardDetailPageProps = {
  postId: string | null
  onBack: () => void
  onOpenPost: (postId: string) => void
  onUpdatePost?: (postId: string, data: BoardWriteData) => void
  onDeletePost?: (postId: string) => void
  extraPosts?: BoardDetailPost[]
}

const emptyBoardEditValue: BoardWriteData = {
  category: '냉장고SOS',
  title: '',
  content: '',
}

function createTemporaryCommentId() {
  return `comment-${Date.now()}`
}

function getBoardEditValue(post: BoardDetailPost | undefined): BoardWriteData {
  if (!post) {
    return emptyBoardEditValue
  }

  return {
    category: post.category,
    title: post.title,
    content: post.paragraphs.join('\n\n'),
  }
}

function isOwnBoardPost(post: BoardDetailPost | undefined, currentUserId: string, nickname: string) {
  if (!post) {
    return false
  }

  if (post.authorId) {
    return post.authorId === currentUserId
  }

  return post.id.startsWith('user-board') && post.author === nickname
}

function BoardDetailIcon({ kind }: { kind: 'share' | 'bookmark' }) {
  if (kind === 'share') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="6" cy="12" r="2" />
        <circle cx="17.5" cy="6" r="2" />
        <circle cx="17.5" cy="18" r="2" />
        <path d="M7.8 11.1 15.7 7M7.8 12.9 15.7 17" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.1 4.8h9.8a1.4 1.4 0 0 1 1.4 1.4v13.9l-6.3-3.4-6.3 3.4V6.2a1.4 1.4 0 0 1 1.4-1.4Z" />
    </svg>
  )
}

function BoardDetailPage({
  postId,
  onBack,
  onOpenPost,
  onUpdatePost,
  onDeletePost,
  extraPosts = [],
}: BoardDetailPageProps) {
  const { email, nickname } = useUserProfile()
  const pageRef = useRef<HTMLElement | null>(null)
  const allPosts = [...extraPosts, ...mockBoardDetailPosts]
  const fallbackPost = allPosts[0]
  const currentPostId = postId ?? fallbackPost?.id ?? null
  const post = allPosts.find((item) => item.id === currentPostId) ?? fallbackPost
  const commentSeed = mockBoardDetailPosts.some((mockPost) => mockPost.id === post?.id)
    ? mockBoardComments
    : []
  const [commentsByPostId, setCommentsByPostId] = useState<Record<string, BoardComment[]>>({})
  const [isEditingPost, setIsEditingPost] = useState(false)
  const [postEditValue, setPostEditValue] = useState<BoardWriteData>(() => getBoardEditValue(post))
  const commentList = currentPostId ? commentsByPostId[currentPostId] ?? commentSeed : commentSeed
  const canManagePost = Boolean(
    post && onUpdatePost && onDeletePost && isOwnBoardPost(post, email, nickname),
  )
  const relatedPosts = allPosts
    .filter((item) => item.id !== post?.id)
    .map((item) => ({
      id: item.id,
      title: item.title,
      comments: item.comments,
    }))

  useEffect(() => {
    pageRef.current?.scrollTo({ top: 0, behavior: 'auto' })
    setIsEditingPost(false)
    setPostEditValue(getBoardEditValue(post))
  }, [currentPostId, post])

  const handleSavePostEdit = () => {
    if (!post || !onUpdatePost) {
      return
    }

    const nextTitle = postEditValue.title.trim()
    const nextContent = postEditValue.content.trim()

    if (!nextTitle || !nextContent) {
      return
    }

    onUpdatePost(post.id, {
      ...postEditValue,
      title: nextTitle,
      content: nextContent,
    })
    setIsEditingPost(false)
  }

  const handleDeletePost = () => {
    if (!post || !onDeletePost) {
      return
    }

    const shouldDelete = window.confirm('게시물을 삭제할까요?')

    if (shouldDelete) {
      onDeletePost(post.id)
    }
  }

  const handleAddComment = (text: string) => {
    const trimmedText = text.trim()

    if (!trimmedText) {
      return
    }

    if (!currentPostId) {
      return
    }

    setCommentsByPostId((prevCommentsByPostId) => {
      const currentComments = prevCommentsByPostId[currentPostId] ?? commentSeed

      return {
        ...prevCommentsByPostId,
        [currentPostId]: [
          {
            id: createTemporaryCommentId(),
            user: nickname,
            authorId: email,
            timeAgo: '방금 전',
            text: trimmedText,
          },
          ...currentComments,
        ],
      }
    })
  }

  const handleUpdateComment = (commentId: string, text: string) => {
    const trimmedText = text.trim()

    if (!currentPostId || !trimmedText) {
      return
    }

    setCommentsByPostId((prevCommentsByPostId) => {
      const currentComments = prevCommentsByPostId[currentPostId] ?? commentSeed

      return {
        ...prevCommentsByPostId,
        [currentPostId]: currentComments.map((comment) =>
          comment.id === commentId ? { ...comment, text: trimmedText } : comment,
        ),
      }
    })
  }

  const handleDeleteComment = (commentId: string) => {
    if (!currentPostId) {
      return
    }

    setCommentsByPostId((prevCommentsByPostId) => {
      const currentComments = prevCommentsByPostId[currentPostId] ?? commentSeed

      return {
        ...prevCommentsByPostId,
        [currentPostId]: currentComments.filter((comment) => comment.id !== commentId),
      }
    })
  }

  const handleOpenRelatedBoard = (nextPostId: string) => {
    onOpenPost(nextPostId)
  }

  return (
    <main className="page-scroll board-detail-page" ref={pageRef}>
      <section className="board-detail-topbar">
        <button type="button" aria-label="자유게시판 목록으로 돌아가기" onClick={onBack}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m14.7 5.6-6.2 6.2 6.2 6.2" />
          </svg>
        </button>
        <div className="board-detail-topbar__actions">
          <button type="button" aria-label="공유하기">
            <BoardDetailIcon kind="share" />
          </button>
          <button type="button" aria-label="북마크">
            <BoardDetailIcon kind="bookmark" />
          </button>
        </div>
      </section>

      <section className="board-detail-content">
        {isEditingPost ? (
          <section className="board-detail-edit-card" aria-label="게시물 수정">
            <h1>게시물 수정</h1>
            <BoardWriteForm value={postEditValue} onChange={setPostEditValue} />
            <div className="board-detail-edit-actions">
              <button type="button" onClick={() => setIsEditingPost(false)}>취소</button>
              <button type="button" onClick={handleSavePostEdit}>저장</button>
            </div>
          </section>
        ) : (
          <>
            {post ? <BoardContent post={post} /> : null}
            {canManagePost && (
              <div className="board-detail-owner-actions">
                <button type="button" onClick={() => setIsEditingPost(true)}>수정</button>
                <button type="button" onClick={handleDeletePost}>삭제</button>
              </div>
            )}
          </>
        )}

        <CommentSection
          comments={commentList}
          currentUserId={email}
          onAddComment={handleAddComment}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
        />

        <RelatedBoards
          items={relatedPosts}
          onSelectBoard={handleOpenRelatedBoard}
        />
      </section>
    </main>
  )
}

export default BoardDetailPage
