import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { notificacaoService } from '../services/apiServices'
import { useAuth } from '../context/AuthContext'

const Header = ({ onToggleSidebar }) => {
  const { user } = useAuth()
  const [notifCount, setNotifCount] = useState(0)
  const [showNotifDropdown, setShowNotifDropdown] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [recentNotifs, setRecentNotifs] = useState([])

  useEffect(() => {
    fetchNotifCount()
    const interval = setInterval(fetchNotifCount, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchNotifCount = async () => {
    try {
      const response = await notificacaoService.contarNaoLidas()
      setNotifCount(response.data.count || 0)
      
      if (response.data.count > 0) {
        const recentResponse = await notificacaoService.listarNaoLidas()
        setRecentNotifs((recentResponse.data || []).slice(0, 5))
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    }
  }

  const handleMarcarTodasLidas = async () => {
    try {
      await notificacaoService.marcarTodasComoLidas()
      setNotifCount(0)
      setRecentNotifs([])
      setShowNotifDropdown(false)
    } catch (error) {
      console.error('Erro ao marcar como lidas:', error)
    }
  }

  const getPrioridadeColor = (prioridade) => {
    const colors = {
      BAIXA: 'secondary',
      MEDIA: 'info',
      ALTA: 'warning',
      URGENTE: 'danger'
    }
    return colors[prioridade] || 'secondary'
  }

  const getPerfilLabel = (perfil) => {
    const labels = {
      EMPREITEIRO: 'Empreiteiro',
      ENGENHEIRO: 'Engenheiro',
      GESTOR_MATERIAIS: 'Gestor Materiais',
      TECNICO_OBRA: 'Técnico Obra'
    }
    return labels[perfil] || perfil
  }

  return (
    <header className="header d-flex justify-content-between align-items-center px-3">
      <div className="d-flex align-items-center">
        <button
          className="sidebar-trigger me-3"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <h1 className="mb-0">Gestão de Obras</h1>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* Notification Bell */}
        <div className="position-relative">
          <button
            className="btn btn-link text-dark p-0 position-relative"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
          >
            <i className="fa-solid fa-bell fa-lg"></i>
            {notifCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {notifCount > 99 ? '99+' : notifCount}
                <span className="visually-hidden">notificações não lidas</span>
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="position-absolute end-0 mt-2 bg-white shadow-lg rounded" style={{ width: '350px', zIndex: 1050 }}>
              <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Notificações</h6>
                {notifCount > 0 && (
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={handleMarcarTodasLidas}
                  >
                    Marcar todas lidas
                  </button>
                )}
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {recentNotifs.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    <i className="fa-solid fa-bell-slash fa-2x mb-2"></i>
                    <p className="mb-0">Nenhuma notificação</p>
                  </div>
                ) : (
                  recentNotifs.map((notif) => (
                    <div key={notif.id} className="p-3 border-bottom border-light">
                      <div className="d-flex align-items-start">
                        <span className={`badge bg-${getPrioridadeColor(notif.prioridade)} me-2`}>
                          {notif.prioridade}
                        </span>
                        <div className="flex-grow-1">
                          <strong className="d-block small">{notif.titulo}</strong>
                          <p className="mb-1 small text-muted">{notif.mensagem}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 text-center border-top">
                <Link to="/notificacoes" className="btn btn-sm btn-link text-decoration-none">
                  Ver todas as notificações
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="position-relative">
          <button
            className="btn btn-link text-dark p-0 d-flex align-items-center gap-2"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
              {user?.nome ? user.nome.charAt(0).toUpperCase() : (user?.username?.charAt(0).toUpperCase() || 'U')}
            </div>
            <div className="text-start d-none d-md-block">
              <div className="small fw-bold mb-0">{user?.nome || user?.username}</div>
              <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                {getPerfilLabel(user?.perfil)}
              </div>
            </div>
            <i className="fa-solid fa-chevron-down small"></i>
          </button>

          {showProfileDropdown && (
            <div className="position-absolute end-0 mt-2 bg-white shadow-lg rounded" style={{ width: '250px', zIndex: 1050 }}>
              <div className="p-3 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                    {user?.nome ? user.nome.charAt(0).toUpperCase() : (user?.username?.charAt(0).toUpperCase() || 'U')}
                  </div>
                  <div>
                    <strong className="d-block">{user?.nome || user?.username}</strong>
                    <small className="text-muted">{user?.email}</small>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="badge bg-primary">{getPerfilLabel(user?.perfil)}</span>
                </div>
              </div>
              <div className="py-2">
                <Link to="/meu-perfil" className="dropdown-item py-2" onClick={() => setShowProfileDropdown(false)}>
                  <i className="fa-solid fa-user me-2"></i>
                  Meu Perfil
                </Link>
                <Link to="/notificacoes" className="dropdown-item py-2" onClick={() => setShowProfileDropdown(false)}>
                  <i className="fa-solid fa-bell me-2"></i>
                  Notificações
                  {notifCount > 0 && <span className="badge bg-danger ms-2">{notifCount}</span>}
                </Link>
              </div>
              <div className="border-top py-2">
                <button 
                  className="dropdown-item py-2 text-danger"
                  onClick={() => {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    window.location.href = '/login'
                  }}
                >
                  <i className="fa-solid fa-sign-out-alt me-2"></i>
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
