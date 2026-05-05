import './Header.css'
import batteryIcon from '../../assets/images/bar_battery.png'
import signalIcon from '../../assets/images/siginal.png'
import wifiIcon from '../../assets/images/wifi.png'

function StatusIcons() {
  return (
    <div className="app-header__status-icons">
      <img className="app-header__status-icon app-header__status-icon--signal" src={signalIcon} alt="" aria-hidden="true" />
      <img className="app-header__status-icon app-header__status-icon--wifi" src={wifiIcon} alt="" aria-hidden="true" />
      <img className="app-header__status-icon app-header__status-icon--battery" src={batteryIcon} alt="" aria-hidden="true" />
    </div>
  )
}

type HeaderProps = {
  showActions?: boolean
}

function Header(_props: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__status" aria-hidden="true">
        <span className="app-header__time">9:41</span>
        <StatusIcons />
      </div>
    </header>
  )
}

export default Header
