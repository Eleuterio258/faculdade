import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

const ObraDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [obra, setObra] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchObra()
  }, [id])

  const fetchObra = async () => {
    try {
      const response = await api.get(`/api/obras/${id}`)
      setObra(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar obra:', error)
      setLoading(false)
    }
  }

  const startEdit = () => {
    setFormData({
      nome: obra.nome || '',
      descricao: obra.descricao || '',
      endereco: obra.endereco || '',
      localizacao: obra.localizacao || '',
      dataInicio: obra.dataInicio || '',
      dataFimPrevista: obra.dataFimPrevista || '',
      status: obra.status || 'PLANEAMENTO',
      orcamentoPrevisto: obra.orcamentoPrevisto || '',
      percentualConclusao: obra.percentualConclusao || 0
    })
    setEditing(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/api/obras/${id}`, formData)
      setEditing(false)
      fetchObra()
    } catch (error) {
      console.error('Erro ao atualizar obra:', error)
      alert('Erro ao atualizar obra.')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta obra?')) {
      try {
        await api.delete(`/api/obras/${id}`)
        navigate('/obras')
      } catch (error) {
        console.error('Erro ao excluir obra:', error)
        alert('Erro ao excluir obra.')
      }
    }
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('pt-MZ')
  }

  const formatCurrency = (value) => {
    if (value == null) return '-'
    return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(value)
  }

  const statusBadge = (status) => {
    const classes = {
      EM_ANDAMENTO: 'bg-success',
      CONCLUIDA: 'bg-primary',
      PARALISADA: 'bg-warning',
      CANCELADA: 'bg-danger',
      PLANEAMENTO: 'bg-secondary',
    }
    return <span className={`badge ${classes[status] || 'bg-secondary'}`}>{status}</span>
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <i className="fa-solid fa-spinner fa-spin fa-2x text-muted"></i>
        <p className="mt-3 text-muted">A carregar...</p>
      </div>
    )
  }

  if (!obra) {
    return (
      <div className="text-center py-5">
        <i className="fa-solid fa-triangle-exclamation fa-2x text-muted mb-3"></i>
        <p className="text-muted">Obra não encontrada.</p>
        <Link to="/obras" className="btn btn-primary mt-2">Voltar às Obras</Link>
      </div>
    )
  }

  if (editing) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">
            <i className="fa-solid fa-pen me-2"></i>
            Editar Obra
          </h1>
          <button className="btn btn-outline-secondary" onClick={() => setEditing(false)}>
            <i className="fa-solid fa-times me-2"></i>Cancelar
          </button>
        </div>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleUpdate}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nome *</label>
                  <input type="text" className="form-control" required value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Status *</label>
                  <select className="form-select" value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="PLANEAMENTO">Planeamento</option>
                    <option value="EM_ANDAMENTO">Em Andamento</option>
                    <option value="PARALISADA">Paralisada</option>
                    <option value="CONCLUIDA">Concluída</option>
                    <option value="CANCELADA">Cancelada</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Endereço *</label>
                  <input type="text" className="form-control" required value={formData.endereco}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Localização *</label>
                  <input type="text" className="form-control" required value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Data de Início *</label>
                  <input type="date" className="form-control" required value={formData.dataInicio}
                    onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Previsão de Término</label>
                  <input type="date" className="form-control" value={formData.dataFimPrevista}
                    onChange={(e) => setFormData({ ...formData, dataFimPrevista: e.target.value })} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Orçamento Previsto</label>
                  <input type="number" step="0.01" className="form-control" value={formData.orcamentoPrevisto}
                    onChange={(e) => setFormData({ ...formData, orcamentoPrevisto: e.target.value })} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">% Conclusão</label>
                  <input type="number" min="0" max="100" className="form-control" value={formData.percentualConclusao}
                    onChange={(e) => setFormData({ ...formData, percentualConclusao: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label">Descrição</label>
                  <textarea className="form-control" rows="3" value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary me-2">
                    <i className="fa-solid fa-check me-2"></i>Guardar
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancelar</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <i className="fa-solid fa-briefcase me-2"></i>
          {obra.nome}
        </h1>
        <div>
          <button className="btn btn-outline-primary me-2" onClick={startEdit}>
            <i className="fa-solid fa-pen me-2"></i>Editar
          </button>
          <button className="btn btn-outline-danger me-2" onClick={handleDelete}>
            <i className="fa-solid fa-trash me-2"></i>Excluir
          </button>
          <Link to="/obras" className="btn btn-outline-secondary">
            <i className="fa-solid fa-arrow-left me-2"></i>Voltar
          </Link>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fa-solid fa-circle-info me-2"></i>
                Informações Gerais
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="text-muted small">Endereço</div>
                  <div>{obra.endereco || '-'}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small">Localização</div>
                  <div>{obra.localizacao}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small">Status</div>
                  <div>{statusBadge(obra.status)}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small">Conclusão</div>
                  <div>
                    <div className="progress" style={{ height: '20px' }}>
                      <div className="progress-bar" role="progressbar"
                        style={{ width: `${obra.percentualConclusao || 0}%` }}>
                        {obra.percentualConclusao || 0}%
                      </div>
                    </div>
                  </div>
                </div>
                {obra.descricao && (
                  <div className="col-12">
                    <div className="text-muted small">Descrição</div>
                    <div>{obra.descricao}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fa-solid fa-calendar me-2"></i>
                Datas
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="text-muted small">Data de Início</div>
                <div>{formatDate(obra.dataInicio)}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small">Previsão de Término</div>
                <div>{formatDate(obra.dataFimPrevista)}</div>
              </div>
              <div>
                <div className="text-muted small">Data de Conclusão</div>
                <div>{formatDate(obra.dataFimReal)}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fa-solid fa-coins me-2"></i>
                Financeiro
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="text-muted small">Orçamento Previsto</div>
                <div className="fw-medium">{formatCurrency(obra.orcamentoPrevisto)}</div>
              </div>
              <div>
                <div className="text-muted small">Custo Realizado</div>
                <div className="fw-medium">{formatCurrency(obra.custoRealizado)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ObraDetail
