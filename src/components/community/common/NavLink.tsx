type NavLinkProps = {
  label: string
  isActive: boolean
  onClick: () => void
  className?: string
  disabled?: boolean
}

function NavLink({ label, isActive, onClick, className, disabled }: NavLinkProps) {
  return (
    <button
      type="button"
      role="tab"
      className={className}
      aria-selected={isActive}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export default NavLink
