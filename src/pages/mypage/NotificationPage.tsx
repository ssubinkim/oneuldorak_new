import { useState } from 'react'
import BottomNav from '../../components/common/layout/BottomNav'
import { useUserProfile } from '../../components/common/useUserProfile'
import { NOTIFICATIONS, type NotificationType } from '../../components/mypage/notification/notificationData'
import { getReadIds, markAsRead } from '../../components/mypage/notification/notificationState'
import arrowLeftIcon from '../../assets/icons/arrow_left.svg'
import attendanceIcon from '../../components/mypage/images/Attendance.png'
import pointIcon from '../../components/mypage/images/point.png'
import writingIcon from '../../components/mypage/images/Writing.png'
import savingIcon from '../../components/mypage/images/Saving.png'
import '../../styles/Tailwind.css'
import './NotificationPage.css'

const iconMap: Record<NotificationType, string> = {
  attendance: attendanceIcon,
  point: pointIcon,
  writing: writingIcon,
  saving: savingIcon,
}

export default function NotificationPage() {
  const handleBack = () => { window.location.hash = '#/mypage' }
  const { isNew } = useUserProfile()
  const notifications = isNew ? [] : NOTIFICATIONS

  const [readIds, setReadIds] = useState<Set<number>>(getReadIds)

  const handleRead = (id: number) => {
    markAsRead(id)
    setReadIds(prev => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  return (
    <div className="app-shell">
      <div className="app-screen">
        <header className="notification-topbar">
          <button type="button" className="notification-topbar__back" aria-label="뒤로가기" onClick={handleBack}>
            <img src={arrowLeftIcon} alt="" aria-hidden="true" />
          </button>
          <h1>알림</h1>
          <span />
        </header>

        <div className="notification-page page-scroll">
          {notifications.length === 0 ? (
            <div className="notification-empty">
              <span>아직 도착한 알림이 없어요</span>
              <span>오늘도 알뜰한 하루 보내봐요 🍱</span>
            </div>
          ) : (
            <ul className="notification-list" role="list">
              {notifications.map((item) => {
                const isRead = readIds.has(item.id)
                return (
                  <li
                    key={item.id}
                    className={`notification-card${isRead ? '' : ' notification-card--unread'}`}
                    onClick={() => handleRead(item.id)}
                  >
                    <div className="notification-icon">
                      <img src={iconMap[item.type]} alt="" aria-hidden="true" />
                    </div>
                    <div className="notification-body">
                      <div className="notification-meta">
                        <span className="notification-label">{item.label}</span>
                        <span className="notification-time">{item.time}</span>
                      </div>
                      <p className="notification-message">
                        {item.lines.map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < item.lines.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <BottomNav />
      </div>
    </div>
  )
}
