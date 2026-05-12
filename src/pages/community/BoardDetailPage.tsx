import { useEffect, useRef, useState } from 'react'
import { useUserProfile } from '../../components/common/useUserProfile'
import BoardContent, { type BoardDetailPost } from '../../components/community/boarddetailpage/BoardContent'
import type { BoardComment } from '../../components/community/boarddetailpage/CommentItem'
import CommentSection from '../../components/community/boarddetailpage/CommentSection'
import RelatedBoards from '../../components/community/boarddetailpage/RelatedBoards'
import './BoardDetailPage.css'

type BoardDetailPageProps = {
  postId: string | null
  onBack: () => void
  onOpenPost: (postId: string) => void
}

const boardPosts: BoardDetailPost[] = [
  {
    id: 'free-1',
    category: '질문',
    reward: '인기글 3P',
    title: '도시락 용기 추천 부탁드려요',
    author: '도시락초보',
    timeAgo: '10분 전',
    likes: 23,
    comments: 15,
    paragraphs: [
      '보온 잘되고 세척 편한 용기를 찾고 있어요.',
      '출근길에 들고 다녀도 새지 않는 제품이면 좋겠습니다.',
    ],
    methods: [
      '보온 성능이 좋은 스테인리스 내통 제품 먼저 보기',
      '뚜껑 패킹 분리 세척 가능한지 확인하기',
      '전자레인지 사용 여부와 용량 체크하기',
      '실사용 후기에서 누수 여부 확인하기',
      '예산에 맞는 2~3개 후보 비교하기',
    ],
  },
  {
    id: 'free-2',
    category: '꿀팁',
    reward: '인기글 5P',
    title: '식비 월 20만원으로 줄인 후기',
    author: '절약왕',
    timeAgo: '1시간 전',
    likes: 342,
    comments: 89,
    paragraphs: [
      '안녕하세요! 3개월 동안 식비를 월 20만원으로 줄인 경험을 공유합니다.',
      '처음에는 힘들 줄 알았는데 생각보다 어렵지 않더라고요. 제가 실천한 방법은:',
    ],
    methods: [
      '주말에 일주일치 식단 계획 세우기',
      '마트 전단지 확인하고 할인 품목 위주로 장보기',
      '냉동 야채 활용하기 (신선한 것보다 저렴)',
      '도시락 5일치 한꺼번에 준비하기',
      '간식은 집에서 만들어 먹기',
    ],
  },
  {
    id: 'free-3',
    category: '냉장고 SOS',
    reward: '인기글 2P',
    title: '냉장고에 양배추만 남았는데 뭐 해먹을까요?',
    author: '요리고민',
    timeAgo: '2시간 전',
    likes: 45,
    comments: 32,
    paragraphs: [
      '양배추랑 계란, 간장 정도 있는데 활용 아이디어가 필요해요.',
      '간단하면서 도시락으로도 가능한 메뉴 추천 부탁드립니다.',
    ],
    methods: [
      '양배추 채 썰어 계란과 함께 전으로 부치기',
      '간장+식초+참기름으로 간단한 양배추 무침 만들기',
      '밥이 있으면 양배추 볶음밥으로 활용하기',
      '남는 양배추는 소분해 냉동 보관하기',
      '다음 장보기 전까지 재료 순환 계획 세우기',
    ],
  },
  {
    id: 'free-4',
    category: '고민',
    reward: '인기글 4P',
    title: '매일 도시락 싸는 게 힘들어요',
    author: '지친직장인',
    timeAgo: '3시간 전',
    likes: 67,
    comments: 41,
    paragraphs: [
      '요즘 너무 귀찮아서 배달을 자주 시키게 돼요.',
      '지치지 않고 꾸준히 도시락 챙기는 루틴이 있을까요?',
    ],
    methods: [
      '주 3일만 도시락 챙기는 가벼운 목표부터 시작하기',
      '같은 반찬 2일 연속 허용하기',
      '전자레인지용 간편 반찬을 예비 메뉴로 두기',
      '아침 조리 시간을 15분 이내로 제한하기',
      '한 주에 한 번은 휴식일로 지정하기',
    ],
  },
]

const initialComments: BoardComment[] = [
  { user: '절약고수', timeAgo: '5분 전', text: '대단하시네요! 저도 따라해볼게요' },
  { user: '도시락러버', timeAgo: '30분 전', text: '꿀팁 감사합니다. 장보기 전에 계획 세우는 게 중요하더라고요' },
  { user: '요리초보', timeAgo: '1시간 전', text: '식비 20만원이면 정말 적게 쓰시네요' },
  { user: '알뜰이', timeAgo: '1시간 전', text: '어떤 마트에서 장보시나요?' },
  { user: '절약왕', timeAgo: '2시간 전', text: '저도 비슷하게 하는데 진짜 효과 좋아요!' },
]

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

function BoardDetailPage({ postId, onBack, onOpenPost }: BoardDetailPageProps) {
  const { nickname } = useUserProfile()
  const pageRef = useRef<HTMLElement | null>(null)
  const currentPostId = postId ?? boardPosts[1].id
  const post = boardPosts.find((item) => item.id === currentPostId) ?? boardPosts[1]
  const [commentsByPostId, setCommentsByPostId] = useState<Record<string, BoardComment[]>>({})
  const commentList = commentsByPostId[currentPostId] ?? initialComments
  const relatedPosts = boardPosts
    .filter((item) => item.id !== post.id)
    .map((item) => ({
      id: item.id,
      title: item.title,
      comments: item.comments,
    }))

  useEffect(() => {
    pageRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }, [currentPostId])

  const handleAddComment = (text: string) => {
    const trimmedText = text.trim()

    if (!trimmedText) {
      return
    }

    setCommentsByPostId((prevCommentsByPostId) => ({
      ...prevCommentsByPostId,
      [currentPostId]: [
        { user: nickname, timeAgo: '방금 전', text: trimmedText },
        ...(prevCommentsByPostId[currentPostId] ?? initialComments),
      ],
    }))
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
        <BoardContent post={post} />

        <CommentSection comments={commentList} onAddComment={handleAddComment} />

        <RelatedBoards
          items={relatedPosts}
          onSelectBoard={handleOpenRelatedBoard}
        />
      </section>
    </main>
  )
}

export default BoardDetailPage
