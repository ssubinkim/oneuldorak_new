import './BottomSheet.css'

type Props = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export default function BottomSheet({ open, onClose, children, className }: Props) {
  return (
    <>
      <div className={`bs-overlay${open ? ' open' : ''}`} onClick={onClose} />
      <div className={`bs-container${open ? ' open' : ''}${className ? ` ${className}` : ''}`}>
        <div className="bs-handle" />
        {children}
      </div>
    </>
  )
}
