import { useEffect, useState } from 'react'
import { usuarioService } from '../services/apiServices'

const GestaoUsuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    nome: '',
    telefone: '',
    perfil: 'TECNICO_OBRA',
    ativo: true
  })

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const fetchUsuarios = async () => {
    try {
      setLoading(true)
      const response = await usuarioService.listarUsuarios()
      setUsuarios(response.data)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        nome: user.nome || '',
        telefone: user.telefone || '',
        perfil: user.perfil || 'TECNICO_OBRA',
        ativo: user.ativo
      })
    } else {
      setEditingUser(null)
      setFormData({
        username: '',
        email: '',
        password: '',
        nome: '',
        telefone: '',
        perfil: 'TECNICO_OBRA',
        ativo: true
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUser(null)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await usuarioService.atualizarUsuario(editingUser.id, formData)
      } else {
        await usuarioService.criarUsuario(formData)
      }
      handleCloseModal()
      fetchUsuarios()
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
      alert('Erro ao salvar usuário')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      await usuarioService.toggleStatus(id)
      fetchUsuarios()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja eliminar este usuário?')) {
      try {
        await usuarioService.eliminarUsuario(id)
        fetchUsuarios()
      } catch (error) {
        console.error('Erro ao eliminar usuário:', error)
        alert('Erro ao eliminar usuário')
      }
    }
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

  const getPerfilLabel = (perfil) => {
    const labels = {
      EMPREITEIRO: 'Empreiteiro',
      ENGENHEIRO: 'Engenheiro',
      GESTOR_MATERIAIS: 'Gestor Materiais',
      TECNICO_OBRA: 'Técnico Obra'
    }
    return labels[perfil] || perfil
  }

  if (loading) {
    return <div className="text-center py-12"><i className="fa-solid fa-spinner fa-spin fa-2x text-muted"></i></div>
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">
          <i className="fa-solid fa-users me-2"></i>
          Gestão de Utilizadores
        </h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <i className="fa-solid fa-plus me-2"></i>
          Novo Utilizador
        </button>
      </div>

      {/* Tabela de Usuários */}
      <div className="card">
        <div className="card-body">
          {usuarios.length === 0 ? (
            <p className="text-muted text-center py-5">Nenhum utilizador encontrado</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Perfil</th>
                    <th>Status</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(user => (
                    <tr key={user.id}>
                      <td><strong>{user.username}</strong></td>
                      <td>{user.nome || '-'}</td>
                      <td>{user.email || '-'}</td>
                      <td>{user.telefone || '-'}</td>
                      <td>
                        <span className={`badge ${getPerfilBadge(user.perfil)}`}>
                          {getPerfilLabel(user.perfil)}
                        </span>
                      </td>
                      <td>
                        {user.ativo ? (
                          <span className="badge bg-success">Ativo</span>
                        ) : (
                          <span className="badge bg-secondary">Inativo</span>
                        )}
                      </td>
                      <td className="text-end">
                        <button 
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleOpenModal(user)}
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button 
                          className={`btn btn-sm ${user.ativo ? 'btn-warning' : 'btn-success'} me-2`}
                          onClick={() => handleToggleStatus(user.id)}
                        >
                          <i className={`fa-solid ${user.ativo ? 'fa-ban' : 'fa-check'}`}></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(user.id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Edição/Criação */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingUser ? 'Editar Utilizador' : 'Novo Utilizador'}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Username *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
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
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        {editingUser ? 'Nova Password (vazio para manter)' : 'Password *'}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={!editingUser}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nome</label>
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
                      <label className="form-label">Telefone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Perfil *</label>
                      <select
                        className="form-select"
                        name="perfil"
                        value={formData.perfil}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="EMPREITEIRO">Empreiteiro</option>
                        <option value="ENGENHEIRO">Engenheiro</option>
                        <option value="GESTOR_MATERIAIS">Gestor de Materiais</option>
                        <option value="TECNICO_OBRA">Técnico de Obra</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    {editingUser ? 'Atualizar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GestaoUsuarios
