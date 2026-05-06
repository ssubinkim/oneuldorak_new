type NavLinkProps = {
  label: string
  isActive: boolean
  onClick: () => void
  className?: string
}

function NavLink({ label, isActive, onClick, className }: NavLinkProps) {
  return (
    <button
      type="button"
      role="tab"
      className={className}
      aria-selected={isActive}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default NavLink
