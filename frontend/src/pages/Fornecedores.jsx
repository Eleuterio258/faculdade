import { useState, useEffect } from 'react'
import api from '../services/api'

const Fornecedores = () => {
  const [fornecedores, setFornecedores] = useState([])
  const [obras, setObras] = useState([])
  const [selectedObra, setSelectedObra] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    nome: '', contacto: '', email: '', endereco: '', tipoFornecimento: '', observacoes: ''
  })

  useEffect(() => { fetchObras() }, [])
  useEffect(() => { if (selectedObra) fetchFornecedores() }, [selectedObra])

  const fetchObras = async () => {
    try {
      const response = await api.get('/api/obras')
      setObras(response.data)
      if (response.data.length > 0) setSelectedObra(response.data[0].id)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar obras:', error)
      setLoading(false)
    }
  }

  const fetchFornecedores = async () => {
    try {
      const response = await api.get(`/api/fornecedores/obra/${selectedObra}`)
      setFornecedores(response.data)
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/api/fornecedores/obra/${selectedObra}`, formData)
      setShowModal(false)
      setFormData({ nome: '', contacto: '', email: '', endereco: '', tipoFornecimento: '', observacoes: '' })
      fetchFornecedores()
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error)
      alert('Erro ao criar fornecedor.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Excluir este fornecedor?')) {
      try {
        await api.delete(`/api/fornecedores/${id}`)
        fetchFornecedores()
      } catch (error) {
        console.error('Erro ao excluir fornecedor:', error)
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
          <i className="fa-solid fa-truck me-2"></i>
          Fornecedores
        </h1>
        {selectedObra && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <i className="fa-solid fa-plus me-2"></i>Novo Fornecedor
          </button>
        )}
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <label className="form-label fw-medium">Selecionar Obra</label>
          <select value={selectedObra} onChange={(e) => setSelectedObra(e.target.value)} className="form-select">
            {obras.map((obra) => (
              <option key={obra.id} value={obra.id}>{obra.nome}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row g-4">
        {fornecedores.length === 0 ? (
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-4 text-muted">
                Nenhum fornecedor registado para esta obra.
              </div>
            </div>
          </div>
        ) : (
          fornecedores.map((f) => (
            <div key={f.id} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">
                      <i className="fa-solid fa-building me-2 text-primary"></i>
                      {f.nome}
                    </h5>
                    <button onClick={() => handleDelete(f.id)} className="btn btn-sm btn-outline-danger">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                  {f.tipoFornecimento && (
                    <span className="badge bg-info mb-2">{f.tipoFornecimento}</span>
                  )}
                  {f.contacto && (
                    <div className="small mb-1">
                      <i className="fa-solid fa-phone me-2 text-muted"></i>{f.contacto}
                    </div>
                  )}
                  {f.email && (
                    <div className="small mb-1">
                      <i className="fa-solid fa-envelope me-2 text-muted"></i>{f.email}
                    </div>
                  )}
                  {f.endereco && (
                    <div className="small mb-1">
                      <i className="fa-solid fa-location-dot me-2 text-muted"></i>{f.endereco}
                    </div>
                  )}
                  {f.observacoes && (
                    <div className="small text-muted mt-2">{f.observacoes}</div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="fa-solid fa-plus me-2"></i>Novo Fornecedor</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nome *</label>
                      <input type="text" className="form-control" required value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Tipo de Fornecimento</label>
                      <select className="form-select" value={formData.tipoFornecimento}
                        onChange={(e) => setFormData({ ...formData, tipoFornecimento: e.target.value })}>
                        <option value="">Selecionar...</option>
                        <option value="Materiais de Construção">Materiais de Construção</option>
                        <option value="Equipamentos">Equipamentos</option>
                        <option value="Mão de Obra">Mão de Obra</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Serviços Técnicos">Serviços Técnicos</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Contacto</label>
                      <input type="text" className="form-control" value={formData.contacto}
                        onChange={(e) => setFormData({ ...formData, contacto: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Endereço</label>
                      <input type="text" className="form-control" value={formData.endereco}
                        onChange={(e) => setFormData({ ...formData, endereco: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Observações</label>
                      <textarea className="form-control" rows="2" value={formData.observacoes}
                        onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary"><i className="fa-solid fa-check me-2"></i>Criar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Fornecedores
