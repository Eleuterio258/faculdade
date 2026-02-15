import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const Obras = () => {
  const [obras, setObras] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    endereco: '',
    localizacao: '',
    dataInicio: '',
    dataFimPrevista: '',
    orcamentoPrevisto: '',
    status: 'PLANEAMENTO'
  })

  useEffect(() => {
    fetchObras()
  }, [])

  const fetchObras = async () => {
    try {
      const response = await api.get('/api/obras')
      setObras(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar obras:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/obras', formData)
      setShowModal(false)
      setFormData({
        nome: '',
        descricao: '',
        endereco: '',
        localizacao: '',
        dataInicio: '',
        dataFimPrevista: '',
        orcamentoPrevisto: '',
        status: 'PLANEAMENTO'
      })
      fetchObras()
    } catch (error) {
      console.error('Erro ao criar obra:', error)
      alert('Erro ao criar obra. Verifique os dados e tente novamente.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta obra?')) {
      try {
        await api.delete(`/api/obras/${id}`)
        fetchObras()
      } catch (error) {
        console.error('Erro ao excluir obra:', error)
        alert('Erro ao excluir obra.')
      }
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <i className="fa-solid fa-spinner fa-spin fa-2x text-muted"></i>
        <p className="mt-3 text-muted">A carregar...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <i className="fa-solid fa-briefcase me-2"></i>
          Obras
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
        >
          <i className="fa-solid fa-plus me-2"></i>
          Nova Obra
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          {obras.length === 0 ? (
            <p className="text-muted text-center py-4">Nenhuma obra encontrada.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Localização</th>
                    <th>Status</th>
                    <th>Orçamento</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {obras.map((obra) => (
                    <tr key={obra.id}>
                      <td>
                        <Link to={`/obras/${obra.id}`} className="text-decoration-none fw-medium">
                          {obra.nome}
                        </Link>
                      </td>
                      <td className="text-muted">{obra.localizacao}</td>
                      <td>
                        <span className={`badge ${
                          obra.status === 'EM_ANDAMENTO' ? 'bg-success' :
                          obra.status === 'CONCLUIDA' ? 'bg-primary' :
                          'bg-secondary'
                        }`}>
                          {obra.status}
                        </span>
                      </td>
                      <td>
                        {obra.orcamentoPrevisto ? 
                          new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(obra.orcamentoPrevisto) :
                          <span className="text-muted">-</span>
                        }
                      </td>
                      <td className="text-end">
                        <Link to={`/obras/${obra.id}`} className="btn btn-sm btn-outline-primary me-2">
                          <i className="fa-solid fa-eye"></i>
                        </Link>
                        <button
                          onClick={() => handleDelete(obra.id)}
                          className="btn btn-sm btn-outline-danger"
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

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fa-solid fa-plus me-2"></i>
                  Nova Obra
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nome *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Endereço *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.endereco}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Localização *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.localizacao}
                      onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Data de Início *</label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={formData.dataInicio}
                      onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Orçamento Previsto</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={formData.orcamentoPrevisto}
                      onChange={(e) => setFormData({ ...formData, orcamentoPrevisto: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fa-solid fa-check me-2"></i>
                    Criar
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

export default Obras
