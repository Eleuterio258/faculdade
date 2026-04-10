import { useState, useEffect } from 'react'
import api from '../services/api'
import { ocorrenciaService } from '../services/apiServices'

const Ocorrencias = () => {
  const [ocorrencias, setOcorrencias] = useState([])
  const [obras, setObras] = useState([])
  const [selectedObra, setSelectedObra] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    titulo: '', descricao: '', data: '', tipo: 'INCIDENTE',
    gravidade: 'MEDIA', status: 'ABERTA', resolucao: ''
  })
  const [filtros, setFiltros] = useState({ tipo: '', gravidade: '', status: '' })
  const [estatisticas, setEstatisticas] = useState({})

  useEffect(() => { fetchObras() }, [])
  useEffect(() => { if (selectedObra) { fetchOcorrencias(); fetchEstatisticas() } }, [selectedObra, filtros])

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

  const fetchOcorrencias = async () => {
    try {
      const response = await ocorrenciaService.filtrarOcorrencias(selectedObra, filtros)
      setOcorrencias(response.data)
    } catch (error) {
      console.error('Erro ao carregar ocorrências:', error)
    }
  }

  const fetchEstatisticas = async () => {
    try {
      const response = await ocorrenciaService.estatisticasOcorrencias(selectedObra)
      setEstatisticas(response.data)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/api/ocorrencias/${editingId}`, formData)
        setEditingId(null)
      } else {
        await api.post(`/api/ocorrencias/obra/${selectedObra}`, formData)
      }
      setShowModal(false)
      setFormData({ titulo: '', descricao: '', data: '', tipo: 'INCIDENTE', gravidade: 'MEDIA', status: 'ABERTA', resolucao: '' })
      fetchOcorrencias()
      fetchEstatisticas()
    } catch (error) {
      console.error('Erro ao salvar ocorrência:', error)
      alert('Erro ao salvar ocorrência.')
    }
  }

  const handleEdit = (ocorrencia) => {
    setFormData({
      titulo: ocorrencia.titulo || '',
      descricao: ocorrencia.descricao || '',
      data: ocorrencia.data || '',
      tipo: ocorrencia.tipo || 'INCIDENTE',
      gravidade: ocorrencia.gravidade || 'MEDIA',
      status: ocorrencia.status || 'ABERTA',
      resolucao: ocorrencia.resolucao || ''
    })
    setEditingId(ocorrencia.id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Excluir esta ocorrência?')) {
      try {
        await api.delete(`/api/ocorrencias/${id}`)
        fetchOcorrencias()
        fetchEstatisticas()
      } catch (error) {
        console.error('Erro ao excluir ocorrência:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
    setFormData({ titulo: '', descricao: '', data: '', tipo: 'INCIDENTE', gravidade: 'MEDIA', status: 'ABERTA', resolucao: '' })
  }

  const tipoBadge = (tipo) => {
    const c = { INCIDENTE: 'bg-warning', ACIDENTE: 'bg-danger', ATRASO: 'bg-info', DEFEITO: 'bg-secondary', RECLAMACAO: 'bg-dark', OUTRO: 'bg-secondary' }
    return <span className={`badge ${c[tipo] || 'bg-secondary'}`}>{tipo}</span>
  }

  const gravidadeBadge = (g) => {
    const c = { BAIXA: 'bg-info', MEDIA: 'bg-warning', ALTA: 'bg-danger', CRITICA: 'bg-dark' }
    return <span className={`badge ${c[g] || 'bg-secondary'}`}>{g}</span>
  }

  const statusBadge = (s) => {
    const c = { ABERTA: 'bg-danger', EM_ANALISE: 'bg-warning', RESOLVIDA: 'bg-success', FECHADA: 'bg-secondary' }
    return <span className={`badge ${c[s] || 'bg-secondary'}`}>{s}</span>
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
          <i className="fa-solid fa-triangle-exclamation me-2"></i>
          Ocorrências
        </h1>
        {selectedObra && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <i className="fa-solid fa-plus me-2"></i>Nova Ocorrência
          </button>
        )}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <label className="form-label fw-medium">Selecionar Obra</label>
              <select value={selectedObra} onChange={(e) => setSelectedObra(e.target.value)} className="form-select">
                {obras.map((obra) => (
                  <option key={obra.id} value={obra.id}>{obra.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-light h-100">
            <div className="card-body d-flex align-items-center">
              <div className="flex-grow-1">
                <div className="text-muted small">Total de Ocorrências</div>
                <div className="h3 mb-0 fw-bold">{estatisticas.total || 0}</div>
              </div>
              <i className="fa-solid fa-exclamation-triangle fa-2x text-muted"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {estatisticas.total > 0 && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-danger">
              <div className="card-body text-center">
                <div className="text-muted small">Abertas</div>
                <div className="h4 text-danger mb-0">{estatisticas.abertas || 0}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-warning">
              <div className="card-body text-center">
                <div className="text-muted small">Em Análise</div>
                <div className="h4 text-warning mb-0">{estatisticas.emAnalise || 0}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-success">
              <div className="card-body text-center">
                <div className="text-muted small">Resolvidas</div>
                <div className="h4 text-success mb-0">{estatisticas.resolvidas || 0}</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-dark">
              <div className="card-body text-center">
                <div className="text-muted small">Críticas</div>
                <div className="h4 text-dark mb-0">{estatisticas.criticas || 0}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="fa-solid fa-filter me-2"></i>
            Filtros
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Tipo</label>
              <select 
                className="form-select" 
                value={filtros.tipo}
                onChange={(e) => setFiltros(prev => ({ ...prev, tipo: e.target.value }))}
              >
                <option value="">Todos</option>
                <option value="INCIDENTE">Incidente</option>
                <option value="ACIDENTE">Acidente</option>
                <option value="ATRASO">Atraso</option>
                <option value="DEFEITO">Defeito</option>
                <option value="RECLAMACAO">Reclamação</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Gravidade</label>
              <select 
                className="form-select" 
                value={filtros.gravidade}
                onChange={(e) => setFiltros(prev => ({ ...prev, gravidade: e.target.value }))}
              >
                <option value="">Todas</option>
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
                <option value="CRITICA">Crítica</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select 
                className="form-select" 
                value={filtros.status}
                onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">Todos</option>
                <option value="ABERTA">Aberta</option>
                <option value="EM_ANALISE">Em Análise</option>
                <option value="RESOLVIDA">Resolvida</option>
                <option value="FECHADA">Fechada</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => setFiltros({ tipo: '', gravidade: '', status: '' })}
              >
                <i className="fa-solid fa-times me-2"></i>Limpar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title mb-0">
            <i className="fa-solid fa-list me-2"></i>Ocorrências da Obra
            <span className="badge bg-primary ms-2">{ocorrencias.length}</span>
          </h2>
        </div>
        <div className="card-body">
          {ocorrencias.length === 0 ? (
            <p className="text-muted text-center py-4">Nenhuma ocorrência registada.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Gravidade</th>
                    <th>Status</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ocorrencias.map((o) => (
                    <tr key={o.id} className={o.gravidade === 'CRITICA' ? 'table danger' : o.gravidade === 'ALTA' ? 'table warning' : ''}>
                      <td className="text-muted small">{o.data}</td>
                      <td>
                        <div className="fw-medium">{o.titulo}</div>
                        {o.descricao && <small className="text-muted">{o.descricao.substring(0, 80)}{o.descricao.length > 80 ? '...' : ''}</small>}
                      </td>
                      <td>{tipoBadge(o.tipo)}</td>
                      <td>{gravidadeBadge(o.gravidade)}</td>
                      <td>{statusBadge(o.status)}</td>
                      <td className="text-end">
                        <button onClick={() => handleEdit(o)} className="btn btn-sm btn-outline-primary me-1">
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button onClick={() => handleDelete(o.id)} className="btn btn-sm btn-outline-danger">
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
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={handleCloseModal}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fa-solid fa-plus me-2"></i>
                  {editingId ? 'Editar Ocorrência' : 'Nova Ocorrência'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label">Título *</label>
                      <input type="text" className="form-control" required value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Data *</label>
                      <input type="date" className="form-control" required value={formData.data}
                        onChange={(e) => setFormData({ ...formData, data: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Tipo</label>
                      <select className="form-select" value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}>
                        <option value="INCIDENTE">Incidente</option>
                        <option value="ACIDENTE">Acidente</option>
                        <option value="ATRASO">Atraso</option>
                        <option value="DEFEITO">Defeito</option>
                        <option value="RECLAMACAO">Reclamação</option>
                        <option value="OUTRO">Outro</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Gravidade</label>
                      <select className="form-select" value={formData.gravidade}
                        onChange={(e) => setFormData({ ...formData, gravidade: e.target.value })}>
                        <option value="BAIXA">Baixa</option>
                        <option value="MEDIA">Média</option>
                        <option value="ALTA">Alta</option>
                        <option value="CRITICA">Crítica</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Status</label>
                      <select className="form-select" value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                        <option value="ABERTA">Aberta</option>
                        <option value="EM_ANALISE">Em Análise</option>
                        <option value="RESOLVIDA">Resolvida</option>
                        <option value="FECHADA">Fechada</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Descrição</label>
                      <textarea className="form-control" rows="2" value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Resolução</label>
                      <textarea className="form-control" rows="2" value={formData.resolucao}
                        onChange={(e) => setFormData({ ...formData, resolucao: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fa-solid fa-check me-2"></i>
                    {editingId ? 'Atualizar' : 'Registar'}
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

export default Ocorrencias
