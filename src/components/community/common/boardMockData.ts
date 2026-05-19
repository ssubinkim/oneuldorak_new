import type { BoardDetailPost } from '../boarddetailpage/BoardContent'
import type { BoardComment } from '../boarddetailpage/CommentItem'
import type { BoardPost } from '../boardpage/BoardList'
import type { BoardPopularPost } from '../boardpage/BoardPopularPosts'
import eggMascot from '../../../assets/food_mascot/egg_mascot.png'
import strawMascot from '../../../assets/food_mascot/straw_mascot.png'
import blueMascot from '../../../assets/food_mascot/blue_mascot.png'
import carrotMascot from '../../../assets/food_mascot/carrot_mascot.png'
import broMascot from '../../../assets/food_mascot/bro_mascot.png'

const mascots = [eggMascot, strawMascot, blueMascot, carrotMascot, broMascot]

export const mockBoardPopularPosts: BoardPopularPost[] = [
  { rank: 1, title: '오늘 점심 권태기 어떻게 해결하시나요?', likes: 100, comments: 88 },
  { rank: 2, title: '일주일 식단 짜다가 진짜 도시락 찾음', likes: 96, comments: 65 },
  { rank: 3, title: '식비 월 20만원으로 줄인 후기', likes: 65, comments: 52 },
]

export const mockBoardDetailPosts: BoardDetailPost[] = [
  {
    id: 'free-1',
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
    id: 'free-2',
    category: '냉장고SOS',
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
    id: 'free-3',
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
  {
    id: 'free-5',
    category: '추천',
    reward: '인기글 3P',
    title: '편의점 재료로 만든 점심 조합 추천',
    author: '편도락',
    timeAgo: '4시간 전',
    likes: 54,
    comments: 18,
    paragraphs: [
      '오늘은 편의점 재료만으로 도시락 느낌 나는 점심 조합을 만들어봤어요.',
      '샐러드, 삶은 달걀, 닭가슴살, 컵밥을 조합하면 생각보다 든든합니다.',
    ],
    methods: [
      '단백질 재료 하나 고르기',
      '채소나 샐러드로 식감 보충하기',
      '밥 양은 반 공기 정도로 조절하기',
      '소스는 절반만 넣어 간 맞추기',
    ],
  },
  {
    id: 'free-6',
    category: '꿀팁',
    reward: '인기글 2P',
    title: '남은 반찬으로 도시락 돌려막는 법',
    author: '반찬활용러',
    timeAgo: '5시간 전',
    likes: 73,
    comments: 24,
    paragraphs: [
      '반찬이 애매하게 남았을 때 버리지 않고 도시락으로 돌려쓰는 방법을 정리해봤어요.',
      '핵심은 같은 반찬도 밥, 면, 샐러드에 얹어 형태를 바꾸는 겁니다.',
    ],
    methods: [
      '볶음 반찬은 덮밥으로 바꾸기',
      '나물류는 비빔밥 재료로 모으기',
      '고기 반찬은 또띠아나 샐러드 토핑으로 쓰기',
      '국물 있는 반찬은 전날 저녁에 먼저 소진하기',
    ],
  },
]

const mockBoardPostSummaries: Record<string, string> = {
  'free-1': '3개월 실천한 방법 공유합니다. 생각보다 어렵지 않았어요..!',
  'free-2': '양배추랑 계란, 간장 정도 있어요. 찾아보면 더 있을지도?',
  'free-3': '보온 잘되고 세척 편한 용기 찾고 있어요. 추천해주세요!',
  'free-4': '요즘 도시락 권태기 왔는데 이겨내는 법 있나요?',
  'free-5': '편의점 재료만으로 든든하게 먹는 조합 공유해요.',
  'free-6': '애매하게 남은 반찬을 도시락 메뉴로 바꾸는 팁입니다.',
}

export const mockBoardPosts: BoardPost[] = mockBoardDetailPosts.map((post, index) => ({
  id: post.id,
  category: post.category,
  title: post.title,
  body: mockBoardPostSummaries[post.id] ?? post.paragraphs[0] ?? '',
  user: post.author,
  mascot: mascots[index % mascots.length],
  timeAgo: post.timeAgo,
  likes: post.likes,
  comments: post.comments,
  highlighted: post.id === 'free-1',
}))

export const mockBoardComments: BoardComment[] = [
  { id: 'mock-comment-1', user: '절약고수', timeAgo: '5분 전', text: '대단하시네요! 저도 따라해볼게요' },
  {
    id: 'mock-comment-2',
    user: '도시락러버',
    timeAgo: '30분 전',
    text: '꿀팁 감사합니다. 장보기 전에 계획 세우는 게 중요하더라고요',
  },
  { id: 'mock-comment-3', user: '요리초보', timeAgo: '1시간 전', text: '식비 20만원이면 정말 적게 쓰시네요' },
  { id: 'mock-comment-4', user: '알뜰이', timeAgo: '1시간 전', text: '어떤 마트에서 장보시나요?' },
  { id: 'mock-comment-5', user: '절약왕', timeAgo: '2시간 전', text: '저도 비슷하게 하는데 진짜 효과 좋아요!' },
]
