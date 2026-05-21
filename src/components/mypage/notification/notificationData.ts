export type NotificationType = 'attendance' | 'point' | 'writing' | 'saving'

export interface NotificationItem {
  id: number
  type: NotificationType
  label: string
  time: string
  lines: string[]
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: 'writing',
    label: '커뮤니티 알림',
    time: '3시간 전',
    lines: ['회원님 도시락에 새로운 이야기가 달렸어요 💬'],
  },
  {
    id: 2,
    type: 'attendance',
    label: '출석체크 알림',
    time: '4시간 전',
    lines: ['오늘도 도시락 한 칸 채웠어요 🍱', '1P가 적립되었어요'],
  },
  {
    id: 3,
    type: 'attendance',
    label: '출석체크 알림',
    time: '1일 전',
    lines: ['벌써 4일째 함께하고 있어요', '이번 주도 잘하고 있어요'],
  },
  {
    id: 4,
    type: 'point',
    label: '포인트 알림',
    time: '1일 전',
    lines: ['1P 적립 완료', '한 끼 절약 성공'],
  },
  {
    id: 5,
    type: 'saving',
    label: '절약 알림',
    time: '2일 전',
    lines: ['절약 목표 달성 🎉', '오늘도락과 함께 한 끼 성공'],
  },
  {
    id: 6,
    type: 'writing',
    label: '커뮤니티 알림',
    time: '2일 전',
    lines: ['누군가 회원님의 기록에 공감했어요'],
  },
  {
    id: 7,
    type: 'attendance',
    label: '출석체크 알림',
    time: '3일 전',
    lines: ['도시락이 모두 열렸어요 🎉', '10P가 지급되었어요'],
  },
  {
    id: 8,
    type: 'saving',
    label: '절약 알림',
    time: '4일 전',
    lines: ['이번 주 목표까지 조금만 더!', '한 끼씩 이어가볼까요?'],
  },
]
