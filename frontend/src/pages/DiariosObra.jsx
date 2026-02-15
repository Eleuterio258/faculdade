import { useState, useEffect } from 'react'
import api from '../services/api'

const DiariosObra = () => {
  const [diarios, setDiarios] = useState([])
  const [obras, setObras] = useState([])
  const [selectedObra, setSelectedObra] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    data: '',
    descricao: '',
    condicoesClimaticas: '',
    observacoes: '',
    numeroTrabalhadores: '',
    horasTrabalhadas: ''
  })

  useEffect(() => {
    fetchObras()
  }, [])

  useEffect(() => {
    if (selectedObra) {
      fetchDiarios()
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

  const fetchDiarios = async () => {
    try {
      const response = await api.get(`/api/diarios-obra/obra/${selectedObra}`)
      setDiarios(response.data)
    } catch (error) {
      console.error('Erro ao carregar diários:', error)
    }
  }

  const resetForm = () => {
    setFormData({ data: '', descricao: '', condicoesClimaticas: '', observacoes: '', numeroTrabalhadores: '', horasTrabalhadas: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...formData }
      if (payload.numeroTrabalhadores) payload.numeroTrabalhadores = parseInt(payload.numeroTrabalhadores)
      if (payload.horasTrabalhadas) payload.horasTrabalhadas = parseFloat(payload.horasTrabalhadas)
      await api.post(`/api/diarios-obra/obra/${selectedObra}`, payload)
      setShowModal(false)
      resetForm()
      fetchDiarios()
    } catch (error) {
      console.error('Erro ao criar diário:', error)
      alert('Erro ao criar diário.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este diário?')) {
      try {
        await api.delete(`/api/diarios-obra/${id}`)
        fetchDiarios()
      } catch (error) {
        console.error('Erro ao excluir diário:', error)
        alert('Erro ao excluir diário.')
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
          <i className="fa-solid fa-book me-2"></i>
          Diários de Obra
        </h1>
        {selectedObra && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <i className="fa-solid fa-plus me-2"></i>
            Novo Diário
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
        {diarios.length === 0 ? (
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <p className="text-muted text-center py-4 mb-0">Nenhum diário encontrado para esta obra.</p>
              </div>
            </div>
          </div>
        ) : (
          diarios.map((diario) => (
            <div key={diario.id} className="col-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    <i className="fa-solid fa-calendar-day me-2 text-primary"></i>
                    {diario.data}
                  </h5>
                  <button onClick={() => handleDelete(diario.id)} className="btn btn-sm btn-outline-danger">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
                <div className="card-body">
                  {diario.descricao && <p className="card-text mb-3">{diario.descricao}</p>}
                  <div className="row g-3">
                    {diario.condicoesClimaticas && (
                      <div className="col-md-4">
                        <div className="d-flex align-items-center">
                          <i className="fa-solid fa-cloud me-2 text-muted"></i>
                          <span className="text-muted small"><strong>Clima:</strong> {diario.condicoesClimaticas}</span>
                        </div>
                      </div>
                    )}
                    {diario.numeroTrabalhadores && (
                      <div className="col-md-4">
                        <div className="d-flex align-items-center">
                          <i className="fa-solid fa-users me-2 text-muted"></i>
                          <span className="text-muted small"><strong>Trabalhadores:</strong> {diario.numeroTrabalhadores}</span>
                        </div>
                      </div>
                    )}
                    {diario.horasTrabalhadas && (
                      <div className="col-md-4">
                        <div className="d-flex align-items-center">
                          <i className="fa-solid fa-clock me-2 text-muted"></i>
                          <span className="text-muted small"><strong>Horas:</strong> {diario.horasTrabalhadas}h</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {diario.observacoes && (
                    <div className="mt-3 pt-3 border-top">
                      <p className="text-muted small mb-0"><strong>Observações:</strong> {diario.observacoes}</p>
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
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fa-solid fa-plus me-2"></i>
                  Novo Diário de Obra
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Data *</label>
                      <input type="date" className="form-control" required value={formData.data}
                        onChange={(e) => setFormData({ ...formData, data: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Condições Climáticas</label>
                      <select className="form-select" value={formData.condicoesClimaticas}
                        onChange={(e) => setFormData({ ...formData, condicoesClimaticas: e.target.value })}>
                        <option value="">Selecionar...</option>
                        <option value="Ensolarado">Ensolarado</option>
                        <option value="Nublado">Nublado</option>
                        <option value="Chuvoso">Chuvoso</option>
                        <option value="Tempestade">Tempestade</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Descrição das Actividades *</label>
                      <textarea className="form-control" rows="3" required value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Nº Trabalhadores</label>
                      <input type="number" className="form-control" value={formData.numeroTrabalhadores}
                        onChange={(e) => setFormData({ ...formData, numeroTrabalhadores: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Horas Trabalhadas</label>
                      <input type="number" step="0.5" className="form-control" value={formData.horasTrabalhadas}
                        onChange={(e) => setFormData({ ...formData, horasTrabalhadas: e.target.value })} />
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

export default DiariosObra
