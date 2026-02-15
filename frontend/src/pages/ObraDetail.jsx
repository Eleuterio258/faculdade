import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'

const ObraDetail = () => {
  const { id } = useParams()
  const [obra, setObra] = useState(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <i className="fa-solid fa-briefcase me-2"></i>
          {obra.nome}
        </h1>
        <Link to="/obras" className="btn btn-outline-secondary">
          <i className="fa-solid fa-arrow-left me-2"></i>
          Voltar
        </Link>
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
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${obra.percentualConclusao || 0}%` }}
                      >
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
