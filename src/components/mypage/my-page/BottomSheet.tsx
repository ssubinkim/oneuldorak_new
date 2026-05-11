import './BottomSheet.css'

type Props = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function BottomSheet({ open, onClose, children }: Props) {
  return (
    <>
      <div className={`bs-overlay${open ? ' open' : ''}`} onClick={onClose} />
      <div className={`bs-container${open ? ' open' : ''}`}>
        <div className="bs-handle" />
        {children}
      </div>
    </>
  )
}
