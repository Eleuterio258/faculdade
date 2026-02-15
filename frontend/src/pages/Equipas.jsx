import { useState, useEffect } from 'react'
import api from '../services/api'

const Equipas = () => {
  const [equipas, setEquipas] = useState([])
  const [obras, setObras] = useState([])
  const [selectedObra, setSelectedObra] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ nome: '', descricao: '' })

  useEffect(() => {
    fetchObras()
  }, [])

  useEffect(() => {
    if (selectedObra) {
      fetchEquipas()
    }
  }, [selectedObra])

  const fetchObras = async () => {
    try {
      const response = await api.get('/api/obras')
      setObras(response.data)
      if (response.data.length > 0) {
        setSelectedObra(response.data[0].id)
      }
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar obras:', error)
      setLoading(false)
    }
  }

  const fetchEquipas = async () => {
    try {
      const response = await api.get(`/api/equipas/obra/${selectedObra}`)
      setEquipas(response.data)
    } catch (error) {
      console.error('Erro ao carregar equipas:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/api/equipas/obra/${selectedObra}`, formData)
      setShowModal(false)
      setFormData({ nome: '', descricao: '' })
      fetchEquipas()
    } catch (error) {
      console.error('Erro ao criar equipa:', error)
      alert('Erro ao criar equipa.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta equipa?')) {
      try {
        await api.delete(`/api/equipas/${id}`)
        fetchEquipas()
      } catch (error) {
        console.error('Erro ao excluir equipa:', error)
        alert('Erro ao excluir equipa.')
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
          <i className="fa-solid fa-users me-2"></i>
          Equipas
        </h1>
        {selectedObra && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <i className="fa-solid fa-plus me-2"></i>
            Nova Equipa
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
        {equipas.length === 0 ? (
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <p className="text-muted text-center py-4 mb-0">Nenhuma equipa encontrada para esta obra.</p>
              </div>
            </div>
          </div>
        ) : (
          equipas.map((equipa) => (
            <div key={equipa.id} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title">
                      <i className="fa-solid fa-users me-2 text-primary"></i>
                      {equipa.nome}
                    </h5>
                    <button onClick={() => handleDelete(equipa.id)} className="btn btn-sm btn-outline-danger">
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                  {equipa.descricao && <p className="card-text text-muted">{equipa.descricao}</p>}
                  {equipa.lider && (
                    <div className="mt-3">
                      <span className="badge bg-info">
                        <i className="fa-solid fa-user-tie me-1"></i>
                        Líder: {equipa.lider.nome}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fa-solid fa-plus me-2"></i>
                  Nova Equipa
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nome *</label>
                    <input type="text" className="form-control" required value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descrição</label>
                    <textarea className="form-control" rows="2" value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fa-solid fa-check me-2"></i>Criar
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

export default Equipas
