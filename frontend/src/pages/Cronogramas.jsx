import { useState, useEffect } from 'react'
import api from '../services/api'

const Cronogramas = () => {
  const [cronogramas, setCronogramas] = useState([])
  const [obras, setObras] = useState([])
  const [selectedObra, setSelectedObra] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ nome: '', descricao: '' })
  const [selectedCronograma, setSelectedCronograma] = useState(null)
  const [atividades, setAtividades] = useState([])
  const [showAtividadeModal, setShowAtividadeModal] = useState(false)
  const [atividadeForm, setAtividadeForm] = useState({
    nome: '', descricao: '', dataInicioPrevista: '', dataFimPrevista: '',
    status: 'PLANEJADA', prioridade: 'MEDIA', percentualConclusao: 0
  })

  useEffect(() => { fetchObras() }, [])
  useEffect(() => { if (selectedObra) fetchCronogramas() }, [selectedObra])

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

  const fetchCronogramas = async () => {
    try {
      const response = await api.get(`/api/cronogramas/obra/${selectedObra}`)
      setCronogramas(response.data)
      setSelectedCronograma(null)
      setAtividades([])
    } catch (error) {
      console.error('Erro ao carregar cronogramas:', error)
    }
  }

  const fetchAtividades = async (cronogramaId) => {
    try {
      const response = await api.get(`/api/atividades/cronograma/${cronogramaId}`)
      setAtividades(response.data)
    } catch (error) {
      console.error('Erro ao carregar atividades:', error)
    }
  }

  const handleSelectCronograma = (cronograma) => {
    setSelectedCronograma(cronograma)
    fetchAtividades(cronograma.id)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/api/cronogramas/obra/${selectedObra}`, formData)
      setShowModal(false)
      setFormData({ nome: '', descricao: '' })
      fetchCronogramas()
    } catch (error) {
      console.error('Erro ao criar cronograma:', error)
      alert('Erro ao criar cronograma.')
    }
  }

  const handleDeleteCronograma = async (id) => {
    if (window.confirm('Excluir este cronograma e todas as suas atividades?')) {
      try {
        await api.delete(`/api/cronogramas/${id}`)
        fetchCronogramas()
      } catch (error) {
        console.error('Erro ao excluir cronograma:', error)
        alert('Erro ao excluir cronograma.')
      }
    }
  }

  const handleAtividadeSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/api/atividades/cronograma/${selectedCronograma.id}`, atividadeForm)
      setShowAtividadeModal(false)
      setAtividadeForm({ nome: '', descricao: '', dataInicioPrevista: '', dataFimPrevista: '', status: 'PLANEJADA', prioridade: 'MEDIA', percentualConclusao: 0 })
      fetchAtividades(selectedCronograma.id)
    } catch (error) {
      console.error('Erro ao criar atividade:', error)
      alert('Erro ao criar atividade.')
    }
  }

  const handleDeleteAtividade = async (id) => {
    if (window.confirm('Excluir esta atividade?')) {
      try {
        await api.delete(`/api/atividades/${id}`)
        fetchAtividades(selectedCronograma.id)
      } catch (error) {
        console.error('Erro ao excluir atividade:', error)
      }
    }
  }

  const statusBadge = (status) => {
    const c = { PLANEJADA: 'bg-secondary', EM_ANDAMENTO: 'bg-success', CONCLUIDA: 'bg-primary', ATRASADA: 'bg-danger', CANCELADA: 'bg-dark' }
    return <span className={`badge ${c[status] || 'bg-secondary'}`}>{status}</span>
  }

  const prioridadeBadge = (p) => {
    const c = { BAIXA: 'bg-info', MEDIA: 'bg-warning', ALTA: 'bg-danger', URGENTE: 'bg-dark' }
    return <span className={`badge ${c[p] || 'bg-secondary'}`}>{p}</span>
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
          <i className="fa-solid fa-calendar me-2"></i>
          Cronogramas
        </h1>
        {selectedObra && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <i className="fa-solid fa-plus me-2"></i>Novo Cronograma
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
        <div className="col-md-4">
          <div className="card">
            <div className="card-header"><h5 className="card-title mb-0">Cronogramas</h5></div>
            <div className="list-group list-group-flush">
              {cronogramas.length === 0 ? (
                <div className="list-group-item text-muted text-center py-4">Nenhum cronograma.</div>
              ) : (
                cronogramas.map((c) => (
                  <div key={c.id} className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedCronograma?.id === c.id ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }} onClick={() => handleSelectCronograma(c)}>
                    <div>
                      <div className="fw-medium">{c.nome}</div>
                      {c.descricao && <small className={selectedCronograma?.id === c.id ? 'text-white-50' : 'text-muted'}>{c.descricao}</small>}
                    </div>
                    <button className={`btn btn-sm ${selectedCronograma?.id === c.id ? 'btn-outline-light' : 'btn-outline-danger'}`}
                      onClick={(e) => { e.stopPropagation(); handleDeleteCronograma(c.id) }}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {selectedCronograma ? (
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">
                  <i className="fa-solid fa-tasks me-2"></i>
                  Atividades - {selectedCronograma.nome}
                </h5>
                <button onClick={() => setShowAtividadeModal(true)} className="btn btn-sm btn-primary">
                  <i className="fa-solid fa-plus me-2"></i>Nova Atividade
                </button>
              </div>
              <div className="card-body">
                {atividades.length === 0 ? (
                  <p className="text-muted text-center py-4">Nenhuma atividade.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Status</th>
                          <th>Prioridade</th>
                          <th>Início</th>
                          <th>Fim</th>
                          <th>%</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {atividades.map((a) => (
                          <tr key={a.id}>
                            <td className="fw-medium">{a.nome}</td>
                            <td>{statusBadge(a.status)}</td>
                            <td>{prioridadeBadge(a.prioridade)}</td>
                            <td className="text-muted small">{a.dataInicioPrevista || '-'}</td>
                            <td className="text-muted small">{a.dataFimPrevista || '-'}</td>
                            <td>
                              <div className="progress" style={{ width: '60px', height: '16px' }}>
                                <div className="progress-bar" style={{ width: `${a.percentualConclusao || 0}%` }}>
                                  {a.percentualConclusao || 0}%
                                </div>
                              </div>
                            </td>
                            <td>
                              <button onClick={() => handleDeleteAtividade(a.id)} className="btn btn-sm btn-outline-danger">
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
          ) : (
            <div className="card">
              <div className="card-body text-center py-5 text-muted">
                <i className="fa-solid fa-arrow-left fa-2x mb-3"></i>
                <p>Selecione um cronograma para ver as atividades.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="fa-solid fa-plus me-2"></i>Novo Cronograma</h5>
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
                  <button type="submit" className="btn btn-primary"><i className="fa-solid fa-check me-2"></i>Criar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showAtividadeModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowAtividadeModal(false)}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="fa-solid fa-plus me-2"></i>Nova Atividade</h5>
                <button type="button" className="btn-close" onClick={() => setShowAtividadeModal(false)}></button>
              </div>
              <form onSubmit={handleAtividadeSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Nome *</label>
                      <input type="text" className="form-control" required value={atividadeForm.nome}
                        onChange={(e) => setAtividadeForm({ ...atividadeForm, nome: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select className="form-select" value={atividadeForm.status}
                        onChange={(e) => setAtividadeForm({ ...atividadeForm, status: e.target.value })}>
                        <option value="PLANEJADA">Planejada</option>
                        <option value="EM_ANDAMENTO">Em Andamento</option>
                        <option value="CONCLUIDA">Concluída</option>
                        <option value="ATRASADA">Atrasada</option>
                        <option value="CANCELADA">Cancelada</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Prioridade</label>
                      <select className="form-select" value={atividadeForm.prioridade}
                        onChange={(e) => setAtividadeForm({ ...atividadeForm, prioridade: e.target.value })}>
                        <option value="BAIXA">Baixa</option>
                        <option value="MEDIA">Média</option>
                        <option value="ALTA">Alta</option>
                        <option value="URGENTE">Urgente</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Data Início</label>
                      <input type="date" className="form-control" value={atividadeForm.dataInicioPrevista}
                        onChange={(e) => setAtividadeForm({ ...atividadeForm, dataInicioPrevista: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Data Fim</label>
                      <input type="date" className="form-control" value={atividadeForm.dataFimPrevista}
                        onChange={(e) => setAtividadeForm({ ...atividadeForm, dataFimPrevista: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">% Conclusão</label>
                      <input type="number" min="0" max="100" className="form-control" value={atividadeForm.percentualConclusao}
                        onChange={(e) => setAtividadeForm({ ...atividadeForm, percentualConclusao: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Descrição</label>
                      <textarea className="form-control" rows="2" value={atividadeForm.descricao}
                        onChange={(e) => setAtividadeForm({ ...atividadeForm, descricao: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAtividadeModal(false)}>Cancelar</button>
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

export default Cronogramas
