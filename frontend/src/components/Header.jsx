const Header = ({ onToggleSidebar }) => {
  return (
    <header className="header">
      <button
        className="sidebar-trigger"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <i className="fa-solid fa-bars"></i>
      </button>
      <div className="separator"></div>
      <h1>Gestão de Obras</h1>
    </header>
  )
}

export default Header

