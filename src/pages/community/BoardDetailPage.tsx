import './BoardDetailPage.css'

type BoardDetailPageProps = {
  postId: string | null
  onBack: () => void
}

type BoardDetailPost = {
  id: string
  category: string
  reward: string
  title: string
  author: string
  timeAgo: string
  likes: number
  comments: number
  paragraphs: string[]
  methods: string[]
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

const comments = [
  { user: '절약고수', timeAgo: '5분 전', text: '대단하시네요! 저도 따라해볼게요' },
  { user: '도시락러버', timeAgo: '30분 전', text: '꿀팁 감사합니다. 장보기 전에 계획 세우는 게 중요하더라고요' },
  { user: '요리초보', timeAgo: '1시간 전', text: '식비 20만원이면 정말 적게 쓰시네요' },
  { user: '알뜰이', timeAgo: '1시간 전', text: '어떤 마트에서 장보시나요?' },
  { user: '절약왕', timeAgo: '2시간 전', text: '저도 비슷하게 하는데 진짜 효과 좋아요!' },
]

const relatedPosts = [
  { title: '냉장고에 양배추만 남았는데 뭐 해먹을까요?', comments: 32 },
  { title: '매일 도시락 싸는 게 힘들어요', comments: 41 },
  { title: '도시락 용기 추천 부탁드려요', comments: 15 },
]

function BoardDetailIcon({ kind }: { kind: 'share' | 'bookmark' | 'heart' | 'comment' }) {
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

  if (kind === 'bookmark') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.1 4.8h9.8a1.4 1.4 0 0 1 1.4 1.4v13.9l-6.3-3.4-6.3 3.4V6.2a1.4 1.4 0 0 1 1.4-1.4Z" />
      </svg>
    )
  }

  if (kind === 'heart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.8 5.6a5 5 0 0 0-7 0L12 7.4l-1.7-1.8a5 5 0 0 0-7.1 7l1.8 1.8L12 21l7.1-6.6 1.7-1.8a5 5 0 0 0 0-7Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 6.2h15a1.7 1.7 0 0 1 1.7 1.7v8.4a1.7 1.7 0 0 1-1.7 1.7H9.8L5.4 21V7.9a1.7 1.7 0 0 1 1.7-1.7Z" />
    </svg>
  )
}

function BoardDetailPage({ postId, onBack }: BoardDetailPageProps) {
  const post = boardPosts.find((item) => item.id === postId) ?? boardPosts[1]

  return (
    <main className="page-scroll board-detail-page">
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
        <div className="board-detail-badges">
          <span className="board-detail-badge board-detail-badge--category">{post.category}</span>
          <span className="board-detail-badge board-detail-badge--trend">↗</span>
          <span className="board-detail-badge board-detail-badge--reward">{post.reward}</span>
        </div>

        <h1>{post.title}</h1>
        <p className="board-detail-meta">{post.author} · {post.timeAgo}</p>

        <div className="board-detail-stats">
          <span>
            <BoardDetailIcon kind="heart" />
            {post.likes}
          </span>
          <span>
            <BoardDetailIcon kind="comment" />
            {post.comments}
          </span>
        </div>

        <div className="board-detail-body">
          {post.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <section className="board-detail-method-box">
            <h2>실천 방법</h2>
            <ol>
              {post.methods.map((method) => (
                <li key={method}>{method}</li>
              ))}
            </ol>
          </section>

          <p>가장 중요한 건 계획을 세우는 거예요. 즉흥적으로 장을 보면 불필요한 게 많이 담기더라고요.</p>
          <p>궁금한 점 있으시면 댓글 남겨주세요!</p>
        </div>

        <section className="board-detail-comments">
          <div className="board-detail-comments__header">
            <h2>댓글 5</h2>
            <span>댓글 작성 시 1P 적립</span>
          </div>

          <div className="board-detail-comments__list">
            {comments.map((comment) => (
              <article key={`${comment.user}-${comment.timeAgo}`}>
                <h3>
                  {comment.user}
                  <span>{comment.timeAgo}</span>
                </h3>
                <p>{comment.text}</p>
              </article>
            ))}
          </div>

          <div className="board-detail-comments__input">
            <input type="text" placeholder="댓글을 입력하세요" />
            <button type="button">작성</button>
          </div>
        </section>

        <section className="board-detail-related">
          <h2>관련 글</h2>
          <div className="board-detail-related__list">
            {relatedPosts.map((item) => (
              <article key={item.title}>
                <p>{item.title}</p>
                <span>댓글 {item.comments}</span>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

export default BoardDetailPage
