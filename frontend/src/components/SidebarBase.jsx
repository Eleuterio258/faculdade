import { NavLink } from 'react-router-dom'

export const SidebarMenuItem = ({ item }) => {
  return (
    <li className="nav-item">
      <NavLink
        to={item.url}
        end={item.exact ?? true}
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <i className={item.icon}></i>
        <span>{item.title}</span>
        {item.badge && (
          <span className={`badge bg-${item.badgeColor || 'primary'} ms-auto`}>
            {item.badge}
          </span>
        )}
      </NavLink>
    </li>
  )
}

const SidebarBase = ({ collapsed, user, logout, groups }) => {
  const getRoleBadgeColor = (role) => {
    const colors = {
      ENGENHEIRO: 'primary',
      EMPREITEIRO: 'warning',
      GESTOR_MATERIAIS: 'success',
      TECNICO_OBRA: 'info',
    }
    return colors[role] || 'secondary'
  }

  const getRoleLabel = (role) => {
    const labels = {
      ENGENHEIRO: 'Engenheiro',
      EMPREITEIRO: 'Empreiteiro',
      GESTOR_MATERIAIS: 'Gestor de Materiais',
      TECNICO_OBRA: 'Técnico de Obra',
    }
    return labels[role] || role
  }

  return (
    <nav className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {!collapsed ? (
        <div className="sidebar-logo">
          <div className="logo-icon">
            <i className="fa-solid fa-building"></i>
          </div>
          <div className="logo-text">
            <div className="logo-title">Gestão de Obras</div>
            <div className="logo-subtitle">Plataforma de Construção</div>
          </div>
        </div>
      ) : (
        <div className="sidebar-logo-collapsed">
          <i className="fa-solid fa-building"></i>
        </div>
      )}

      <div className="sidebar-header-user">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            <i className="fa-solid fa-user-circle"></i>
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.username || 'Usuário'}</div>
            <div className="sidebar-user-email">{user?.email || 'user@gestaoobras.com'}</div>
            {user?.perfil && (
              <span
                className={`badge bg-${getRoleBadgeColor(user.perfil)} mt-1`}
                style={{ fontSize: '0.65rem' }}
              >
                {getRoleLabel(user.perfil)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="sidebar-content">
        {groups.map((group) => (
          <div className="sidebar-group" key={group.label}>
            <div className="sidebar-group-label">{group.label}</div>
            <ul className="nav flex-column">
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title} item={item} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="btn btn-outline-danger btn-sm w-100" onClick={logout}>
          <i className="fa-solid fa-right-from-bracket me-2"></i>
          <span>Sair</span>
        </button>
      </div>
    </nav>
  )
}

export default SidebarBase
