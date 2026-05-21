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
  { id: 'free-1', rank: 1, title: '직장인 도시락 루틴 공유해요', body: '전날 밤 10분 투자로 아침 도시락 준비가 훨씬 편해졌어요.', author: '도시락고수', mascot: eggMascot, likes: 318, comments: 74 },
  { id: 'free-3', rank: 2, title: '계란+김치 냉털 조합 총정리', body: '묵은 김치랑 계란만 있으면 도시락 반찬 다 해결돼요.', author: '냉털장인', mascot: blueMascot, likes: 204, comments: 49 },
  { id: 'free-4', rank: 3, title: '도시락 보냉백 이거 진짜 좋아요', body: '여름 도시락 상할까봐 걱정됐는데 보냉백 바꾸고 고민 없어졌어요.', author: '도락장비러버', mascot: carrotMascot, likes: 176, comments: 38 },
]

export const mockBoardDetailPosts: BoardDetailPost[] = [
  {
    id: 'free-1',
    category: '꿀팁',
    reward: '인기글 5P',
    title: '직장인 도시락 루틴 공유해요',
    author: '도시락고수',
    mascot: eggMascot,
    timeAgo: '20분 전',
    likes: 318,
    comments: 74,
    paragraphs: [
      '3년째 매일 도시락 싸고 있는데 이 루틴 생기고 나서 아침이 훨씬 편해졌어요.',
      '핵심은 전날 밤 10분 투자입니다.',
    ],
    methods: [
      '전날 밤: 밥 짓고 반찬 1~2가지만 준비해두기',
      '냉장 보관 후 아침엔 용기에 담기만 하기',
      '국물 반찬은 작은 밀폐 통에 따로 담기',
      '과일이나 간식은 지퍼백에 미리 소분해두기',
      '주 2회는 냉동 반찬 활용해서 준비 시간 줄이기',
    ],
  },
  {
    id: 'free-2',
    category: '질문',
    reward: '인기글 2P',
    title: '도시락 용기 뭐 쓰세요?',
    author: '용기고민중',
    mascot: strawMascot,
    timeAgo: '1시간 전',
    likes: 52,
    comments: 61,
    paragraphs: [
      '지금 쓰는 플라스틱 용기가 냄새가 배서 새로 구매하려고요.',
      '유리, 스테인리스, 플라스틱 중에 뭐가 제일 실용적인지 추천 부탁드려요!',
    ],
    methods: [],
  },
  {
    id: 'free-3',
    category: '냉장고SOS',
    reward: '인기글 4P',
    title: '계란+김치 냉털 조합 총정리',
    author: '냉털장인',
    mascot: blueMascot,
    timeAgo: '2시간 전',
    likes: 204,
    comments: 49,
    paragraphs: [
      '냉장고 문 열 때마다 보이는 묵은 김치랑 계란, 이것만 있으면 도시락 반찬 다 해결돼요.',
      '제가 매주 냉털할 때 제일 자주 쓰는 조합 정리해봤습니다.',
    ],
    methods: [
      '묵은 김치 송송 썰어 계란이랑 같이 볶기 → 김치볶음밥 or 반찬',
      '계란 풀어서 김치 넣고 도톰하게 부치면 김치전',
      '참치캔 있으면 셋 다 합쳐서 참치김치볶음으로 업그레이드',
      '남은 밥 없으면 당면 불려서 잡채식으로 변환',
      '마무리에 참기름 한 방울 넣으면 퀄리티가 달라짐',
    ],
  },
  {
    id: 'free-4',
    category: '추천',
    reward: '인기글 3P',
    title: '도시락 보냉백 이거 진짜 좋아요',
    author: '도락장비러버',
    mascot: carrotMascot,
    timeAgo: '3시간 전',
    likes: 176,
    comments: 38,
    paragraphs: [
      '여름 되면서 도시락 상할까봐 걱정됐는데 보냉백 바꾸고 나서 고민이 없어졌어요.',
      '써봤던 것들 중에 괜찮았던 조합 공유할게요.',
    ],
    methods: [
      '알루미늄 내장 보냉백 + 아이스팩 2개 조합이 가장 효과적',
      '젤 타입 아이스팩이 물 타입보다 오래 유지됨',
      '용기 뚜껑 위에 아이스팩 올려두는 게 포인트',
      '보냉백은 지퍼 완전히 잠그는 타입으로 고르기',
    ],
  },
  {
    id: 'free-5',
    category: '고민',
    reward: '인기글 1P',
    title: '도시락 매일 싸다가 번아웃 왔어요',
    author: '지친도락이',
    mascot: broMascot,
    timeAgo: '4시간 전',
    likes: 38,
    comments: 55,
    paragraphs: [
      '6개월째 매일 도시락 쌌는데 요즘 너무 귀찮고 지쳐서 결국 배달 시키게 되네요.',
      '이 슬럼프 어떻게 극복하셨나요? 다들 비슷한 경험 있으신지 궁금해요.',
    ],
    methods: [],
  },
  {
    id: 'free-6',
    category: '냉장고SOS',
    reward: '인기글 3P',
    title: '두부+애호박+계란으로 뭐 해먹을까요?',
    author: '냉장고비상',
    mascot: eggMascot,
    timeAgo: '6시간 전',
    likes: 143,
    comments: 27,
    paragraphs: [
      '장 보러 가기 귀찮은데 냉장고에 딱 이것만 남아있어요.',
      '내일 도시락 싸야 하는데 이 조합으로 가능한 메뉴 아시는 분 있나요?',
    ],
    methods: [],
  },
]

const mockBoardPostSummaries: Record<string, string> = {
  'free-1': '전날 밤 10분 투자로 아침 도시락 준비가 훨씬 편해졌어요.',
  'free-2': '유리, 스테인리스, 플라스틱 중에 뭐가 제일 실용적인가요?',
  'free-3': '묵은 김치랑 계란만 있으면 도시락 반찬 다 해결돼요.',
  'free-4': '여름 도시락 상할까봐 걱정됐는데 보냉백 바꾸고 고민 없어졌어요.',
  'free-5': '6개월 개근했는데 요즘 번아웃이 왔어요. 극복 방법이 있을까요?',
  'free-6': '내일 도시락 싸야 하는데 두부, 애호박, 계란으로 뭐 할 수 있을까요?',
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
