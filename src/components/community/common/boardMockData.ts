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

export const mockBoardCommentsByPostId: Record<string, BoardComment[]> = {
  'free-1': [
    { id: 'f1-c1', user: '절약고수', timeAgo: '5분 전', text: '대단하시네요! 저도 따라해볼게요' },
    { id: 'f1-c2', user: '도시락러버', timeAgo: '12분 전', text: '꿀팁 감사합니다. 장보기 전에 계획 세우는 게 중요하더라고요' },
    { id: 'f1-c3', user: '요리초보', timeAgo: '28분 전', text: '루틴 만들기가 제일 어려운데 이렇게 하면 되겠네요!' },
    { id: 'f1-c4', user: '알뜰이', timeAgo: '45분 전', text: '어떤 용기 쓰세요? 저도 알고 싶어요' },
    { id: 'f1-c5', user: '절약왕', timeAgo: '1시간 전', text: '저도 비슷하게 하는데 진짜 효과 좋아요!' },
    { id: 'f1-c6', user: '냉장고지킴이', timeAgo: '1시간 전', text: '전날 밤 10분 투자가 핵심이네요. 실천해볼게요' },
    { id: 'f1-c7', user: '주부9단', timeAgo: '2시간 전', text: '식단 계획 같이 세우면 더 효율적이에요 👍' },
    { id: 'f1-c8', user: '도락이팬', timeAgo: '2시간 전', text: '저는 주말에 한 번만 장보는데 오히려 더 절약됐어요' },
    { id: 'f1-c9', user: '요리왕비룡', timeAgo: '3시간 전', text: '냉동 반찬 활용 팁이 진짜 꿀이에요' },
    { id: 'f1-c10', user: '건강한식탁', timeAgo: '3시간 전', text: '앞으로 저도 루틴 만들어봐야겠어요' },
    { id: 'f1-c11', user: '미니멀주방', timeAgo: '4시간 전', text: '3년 동안 지속하셨다는 게 대단해요!' },
    { id: 'f1-c12', user: '밥블레스유', timeAgo: '5시간 전', text: '이 방법 써봤는데 한 달에 식비 3만원 넘게 아꼈어요' },
    { id: 'f1-c13', user: '간단요리왕', timeAgo: '6시간 전', text: '과일 소분 팁 너무 좋아요. 아침에 바로 먹기 딱이겠다' },
    { id: 'f1-c14', user: '도시락일상', timeAgo: '7시간 전', text: '공유 감사해요. 내일부터 바로 시작해볼게요!' },
  ],
  'free-2': [
    { id: 'f2-c1', user: '용기수집가', timeAgo: '8분 전', text: '저는 유리 용기 쓰는데 무겁긴 해도 위생적이에요' },
    { id: 'f2-c2', user: '락앤락팬', timeAgo: '20분 전', text: '락앤락 강추해요. 진짜 국물 안 새요' },
    { id: 'f2-c3', user: '도시락초보', timeAgo: '35분 전', text: '스텐 용기 써보셨나요? 전자레인지 안 된다는 게 단점인데' },
    { id: 'f2-c4', user: '알뜰살림', timeAgo: '1시간 전', text: '다이소 용기도 생각보다 괜찮더라고요' },
    { id: 'f2-c5', user: '주방고수', timeAgo: '1시간 전', text: '칸칸이 나뉜 용기가 반찬 섞이지 않아서 편해요' },
    { id: 'f2-c6', user: '요리새내기', timeAgo: '2시간 전', text: '추천 제품 링크 있으면 공유해주세요!' },
    { id: 'f2-c7', user: '도락이러버', timeAgo: '3시간 전', text: '두 칸짜리랑 세 칸짜리 둘 다 있으면 편해요' },
    { id: 'f2-c8', user: '냉장고왕', timeAgo: '4시간 전', text: '국물 반찬은 작은 밀폐 통 따로 쓰는 게 맞아요' },
    { id: 'f2-c9', user: '절약생활', timeAgo: '5시간 전', text: '용기 색깔별로 요일 정해서 쓰는 분도 계시더라고요' },
  ],
  'free-3': [
    { id: 'f3-c1', user: '계란장인', timeAgo: '3분 전', text: '계란이랑 김치는 진짜 최강 조합이죠' },
    { id: 'f3-c2', user: '냉털고수', timeAgo: '15분 전', text: '여기에 참치 하나만 추가하면 완벽한 반찬 세트예요' },
    { id: 'f3-c3', user: '묵은김치러버', timeAgo: '30분 전', text: '묵은 김치 볶음은 언제 먹어도 맛있어요' },
    { id: 'f3-c4', user: '도시락달인', timeAgo: '42분 전', text: '저도 이 조합으로 일주일 버티고 있어요 ㅋㅋ' },
    { id: 'f3-c5', user: '요리왕', timeAgo: '1시간 전', text: '계란말이, 스크램블, 반숙 돌려가면서 먹으면 질리지 않아요' },
    { id: 'f3-c6', user: '절약미식가', timeAgo: '2시간 전', text: '김치 볶음밥에 계란 프라이 올리면 한 끼 완성이죠' },
    { id: 'f3-c7', user: '냉장고정리왕', timeAgo: '2시간 전', text: '냉털 아이디어 항상 여기서 얻어가요 감사해요' },
    { id: 'f3-c8', user: '간편요리', timeAgo: '3시간 전', text: '계란 한 판 사두면 한 주가 든든하더라고요' },
    { id: 'f3-c9', user: '알뜰도시락', timeAgo: '4시간 전', text: '이 외에도 다른 냉털 조합 알려주세요!' },
    { id: 'f3-c10', user: '주부왕', timeAgo: '5시간 전', text: '매번 좋은 정보 감사해요. 저장해뒀어요' },
    { id: 'f3-c11', user: '도락이일상', timeAgo: '6시간 전', text: '오늘 바로 따라해봤는데 진짜 맛있었어요' },
    { id: 'f3-c12', user: '집밥러버', timeAgo: '7시간 전', text: '집밥이 최고라는 걸 다시 느꼈어요' },
    { id: 'f3-c13', user: '건강밥상', timeAgo: '8시간 전', text: '재료비 적게 들면서 영양은 풍부하니까 최고죠' },
    { id: 'f3-c14', user: '냉털마스터', timeAgo: '1일 전', text: '이런 꿀팁 계속 올려주세요!' },
    { id: 'f3-c15', user: '요리입문자', timeAgo: '1일 전', text: '요리 못해도 이건 따라할 수 있겠어요' },
  ],
  'free-4': [
    { id: 'f4-c1', user: '보냉백덕후', timeAgo: '10분 전', text: '어떤 브랜드 쓰세요? 저도 바꾸고 싶어요' },
    { id: 'f4-c2', user: '여름도시락', timeAgo: '25분 전', text: '여름엔 보냉백 필수예요. 안 쓰면 진짜 위험해요' },
    { id: 'f4-c3', user: '도시락안전제일', timeAgo: '50분 전', text: '아이스팩이랑 같이 쓰면 더 좋아요' },
    { id: 'f4-c4', user: '장비러버', timeAgo: '1시간 전', text: '도시락 장비에 투자하면 오래 쓸 수 있어서 결국 이득이에요' },
    { id: 'f4-c5', user: '위생왕', timeAgo: '2시간 전', text: '식중독 걱정 없어지니까 훨씬 마음 편하게 먹을 수 있어요' },
    { id: 'f4-c6', user: '도락이팬클럽', timeAgo: '3시간 전', text: '저도 똑같은 고민하다 바꿨는데 정말 만족해요' },
    { id: 'f4-c7', user: '알뜰장비', timeAgo: '4시간 전', text: '가격대가 어떻게 돼요? 비싼 거 사야 효과 있나요?' },
    { id: 'f4-c8', user: '현명한소비', timeAgo: '5시간 전', text: '중간 가격대가 제일 가성비 좋더라고요' },
  ],
  'free-5': [
    { id: 'f5-c1', user: '소분왕', timeAgo: '7분 전', text: '소분 습관 들이면 요리 시간이 진짜 확 줄어요' },
    { id: 'f5-c2', user: '냉동실활용', timeAgo: '18분 전', text: '고기 소분해서 냉동하면 훨씬 편해요' },
    { id: 'f5-c3', user: '절약주부', timeAgo: '40분 전', text: '지퍼백 대량 구매하면 단가가 낮아져요' },
    { id: 'f5-c4', user: '똑똑한살림', timeAgo: '1시간 전', text: '날짜 라벨 붙여두면 유통기한 관리가 쉬워요' },
    { id: 'f5-c5', user: '냉장고정리', timeAgo: '2시간 전', text: '소분만 잘해도 음식물 쓰레기가 확 줄어요' },
    { id: 'f5-c6', user: '요리준비완료', timeAgo: '2시간 전', text: '주말에 한 번만 하면 평일이 너무 편해요!' },
    { id: 'f5-c7', user: '밀프렙고수', timeAgo: '3시간 전', text: '밀프렙 개념이랑 비슷하네요. 완전 공감해요' },
    { id: 'f5-c8', user: '스마트주방', timeAgo: '4시간 전', text: '소분 용기도 통일해두면 냉장고 공간 활용이 좋아요' },
    { id: 'f5-c9', user: '생활의달인', timeAgo: '5시간 전', text: '이거 한 번 해보면 안 할 수가 없어요' },
    { id: 'f5-c10', user: '도시락매니아', timeAgo: '6시간 전', text: '저도 이 방법으로 식비 많이 줄었어요' },
    { id: 'f5-c11', user: '알뜰살림', timeAgo: '1일 전', text: '좋은 정보 감사합니다!' },
  ],
  'free-6': [
    { id: 'f6-c1', user: '일요일쿠킹', timeAgo: '2분 전', text: '일요일 저녁이 제일 바쁜 시간이 됐어요 ㅋㅋ' },
    { id: 'f6-c2', user: '3일치달인', timeAgo: '20분 전', text: '3일치가 딱 좋은 것 같아요. 4일 넘어가면 신선도가...' },
    { id: 'f6-c3', user: '계획형주부', timeAgo: '35분 전', text: '저도 똑같이 하는데 생각보다 어렵지 않아요' },
    { id: 'f6-c4', user: '도시락루틴', timeAgo: '1시간 전', text: '메뉴 정해두고 장보면 시간이 훨씬 줄어요' },
    { id: 'f6-c5', user: '냉장고활용왕', timeAgo: '1시간 전', text: '반찬 3가지만 만들어도 조합이 다양해서 안 질려요' },
    { id: 'f6-c6', user: '주말요리사', timeAgo: '2시간 전', text: '주말 두 시간 투자하면 평일이 완전 편해요' },
    { id: 'f6-c7', user: '도락이생활', timeAgo: '3시간 전', text: '이 루틴 2년째 유지 중인데 진짜 좋아요' },
    { id: 'f6-c8', user: '밥먹자', timeAgo: '4시간 전', text: '냉동 보관 팁도 알려주시면 좋겠어요!' },
    { id: 'f6-c9', user: '건강식단', timeAgo: '5시간 전', text: '균형 잡힌 식단도 같이 짜면 더 좋을 것 같아요' },
    { id: 'f6-c10', user: '요리왕입문', timeAgo: '6시간 전', text: '요리 초보인데 이렇게 하면 저도 할 수 있을 것 같아요!' },
    { id: 'f6-c11', user: '알뜰식탁', timeAgo: '7시간 전', text: '식비 절약에도 도움이 많이 되더라고요' },
    { id: 'f6-c12', user: '냉장고지킴이', timeAgo: '8시간 전', text: '음식물 낭비도 줄고 일석이조네요' },
    { id: 'f6-c13', user: '스마트쿡', timeAgo: '1일 전', text: '이 방법 친구한테도 추천해줬어요' },
  ],
}

export const mockBoardComments: BoardComment[] = mockBoardCommentsByPostId['free-1']
