import type { ReactNode } from 'react'
import BottomNav from '../../common/layout/BottomNav'
import Header from '../../common/layout/Header'
import '../../../styles/Tailwind.css'

type MyPageShellProps = {
  children: ReactNode
  header?: ReactNode
  showDefaultHeader?: boolean
}

function MyPageShell({ children, header, showDefaultHeader = true }: MyPageShellProps) {
  return (
    <div className="app-shell">
      <div className="app-screen">
        {header ?? (showDefaultHeader ? <Header /> : null)}
        {children}
        <BottomNav />
      </div>
    </div>
  )
}

export default MyPageShell
