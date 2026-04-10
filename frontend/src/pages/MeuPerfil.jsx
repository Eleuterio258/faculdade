import { useEffect, useState } from 'react'
import { usuarioService } from '../services/apiServices'
import { useAuth } from '../context/AuthContext'

const MeuPerfil = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || ''
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await usuarioService.atualizarUsuario(user.id, formData)
      setEditing(false)
      alert('Perfil atualizado com sucesso!')
      window.location.reload()
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      alert('Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As passwords novas não coincidem')
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert('A password deve ter pelo menos 6 caracteres')
      return
    }

    try {
      setLoading(true)
      await usuarioService.alterarPassword(user.id, passwordData.currentPassword, passwordData.newPassword)
      setChangingPassword(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      alert('Password alterada com sucesso!')
    } catch (error) {
      console.error('Erro ao alterar password:', error)
      alert('Erro ao alterar password. Verifique a password atual.')
    } finally {
      setLoading(false)
    }
  }

  const getPerfilLabel = (perfil) => {
    const labels = {
      EMPREITEIRO: 'Empreiteiro',
      ENGENHEIRO: 'Engenheiro',
      GESTOR_MATERIAIS: 'Gestor de Materiais',
      TECNICO_OBRA: 'Técnico de Obra'
    }
    return labels[perfil] || perfil
  }

  const getPerfilBadge = (perfil) => {
    const badges = {
      EMPREITEIRO: 'bg-danger',
      ENGENHEIRO: 'bg-primary',
      GESTOR_MATERIAIS: 'bg-success',
      TECNICO_OBRA: 'bg-info'
    }
    return badges[perfil] || 'bg-secondary'
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">
            <i className="fa-solid fa-user me-2"></i>
            Meu Perfil
          </h1>
          <p className="text-muted mb-0">Gerir as minhas informações pessoais</p>
        </div>
      </div>

      <div className="row">
        {/* Informações Pessoais */}
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                <i className="fa-solid fa-id-card me-2"></i>
                Informações Pessoais
              </h5>
              {!editing && (
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => setEditing(true)}
                >
                  <i className="fa-solid fa-edit me-2"></i>
                  Editar
                </button>
              )}
            </div>
            <div className="card-body">
              {!editing ? (
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="text-muted small">Username</label>
                    <p className="fw-bold mb-0">{user?.username}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="text-muted small">Nome Completo</label>
                    <p className="fw-bold mb-0">{formData.nome || '-'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="text-muted small">Email</label>
                    <p className="fw-bold mb-0">{formData.email || '-'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="text-muted small">Telefone</label>
                    <p className="fw-bold mb-0">{formData.telefone || '-'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="text-muted small">Perfil</label>
                    <p className="mb-0">
                      <span className={`badge ${getPerfilBadge(user?.perfil)}`}>
                        {getPerfilLabel(user?.perfil)}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="text-muted small">Estado</label>
                    <p className="mb-0">
                      {user?.ativo ? (
                        <span className="badge bg-success">Ativo</span>
                      ) : (
                        <span className="badge bg-secondary">Inativo</span>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        value={user?.username}
                        disabled
                      />
                      <small className="text-muted">Username não pode ser alterado</small>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nome Completo</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Telefone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setEditing(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin me-2"></i>
                          A guardar...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-save me-2"></i>
                          Guardar
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Alterar Password */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                <i className="fa-solid fa-lock me-2"></i>
                Segurança
              </h5>
              {!changingPassword && (
                <button 
                  className="btn btn-sm btn-warning"
                  onClick={() => setChangingPassword(true)}
                >
                  <i className="fa-solid fa-key me-2"></i>
                  Alterar Password
                </button>
              )}
            </div>
            <div className="card-body">
              {!changingPassword ? (
                <div>
                  <p className="text-muted mb-0">
                    <i className="fa-solid fa-shield-alt me-2"></i>
                    A sua password está protegida. Altere regularmente para maior segurança.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleChangePassword}>
                  <div className="mb-3">
                    <label className="form-label">Password Atual *</label>
                    <input
                      type="password"
                      className="form-control"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nova Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={6}
                    />
                    <small className="text-muted">Mínimo 6 caracteres</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirmar Nova Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={6}
                    />
                  </div>
                  {passwordData.newPassword && passwordData.confirmPassword && (
                    <div className={`alert ${passwordData.newPassword === passwordData.confirmPassword ? 'alert-success' : 'alert-danger'} mb-3`}>
                      {passwordData.newPassword === passwordData.confirmPassword 
                        ? '✓ As passwords coincidem' 
                        : '✗ As passwords não coincidem'}
                    </div>
                  )}
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setChangingPassword(false)
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-warning"
                      disabled={loading || passwordData.newPassword !== passwordData.confirmPassword}
                    >
                      {loading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin me-2"></i>
                          A alterar...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-check me-2"></i>
                          Alterar Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '100px', height: '100px', fontSize: '3rem' }}>
                {user?.nome ? user.nome.charAt(0).toUpperCase() : (user?.username?.charAt(0).toUpperCase() || 'U')}
              </div>
              <h4 className="mb-1">{user?.nome || user?.username}</h4>
              <p className="text-muted mb-2">{user?.email}</p>
              <span className={`badge ${getPerfilBadge(user?.perfil)} fs-6`}>
                {getPerfilLabel(user?.perfil)}
              </span>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h6 className="card-title mb-0">
                <i className="fa-solid fa-link me-2"></i>
                Links Rápidos
              </h6>
            </div>
            <div className="list-group list-group-flush">
              <a href="/notificacoes" className="list-group-item list-group-item-action">
                <i className="fa-solid fa-bell me-2"></i>
                Notificações
              </a>
              <a href="/" className="list-group-item list-group-item-action">
                <i className="fa-solid fa-home me-2"></i>
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeuPerfil
