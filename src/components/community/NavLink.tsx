type NavLinkProps = {
  label: string
  isActive: boolean
  onClick: () => void
}

function NavLink({ label, isActive, onClick }: NavLinkProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default NavLink
