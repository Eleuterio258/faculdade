import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { cotacaoService } from '../services/apiServices'

const AnaliseMercado = () => {
  const { id: obraId } = useParams()
  const [analise, setAnalise] = useState(null)
  const [recomendacoes, setRecomendacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState({
    inicio: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0],
    fim: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchAnalise()
    fetchRecomendacoes()
  }, [obraId, periodo])

  const fetchAnalise = async () => {
    try {
      setLoading(true)
      const response = await cotacaoService.analiseMercado(obraId, periodo.inicio, periodo.fim)
      setAnalise(response.data)
    } catch (error) {
      console.error('Erro ao carregar análise:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecomendacoes = async () => {
    try {
      const response = await cotacaoService.recomendacoes(obraId)
      setRecomendacoes(response.data)
    } catch (error) {
      console.error('Erro ao carregar recomendações:', error)
    }
  }

  const handlePeriodoChange = (e) => {
    const { name, value } = e.target
    setPeriodo(prev => ({ ...prev, [name]: value }))
  }

  const handleAplicarFiltro = () => {
    fetchAnalise()
  }

  const formatCurrency = (v) => {
    if (v == null) return '-'
    return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v)
  }

  const getRecomendacaoIcon = (tipo) => {
    const icons = {
      URGENTE: 'fa-exclamation-circle text-danger',
      ALERTA: 'fa-exclamation-triangle text-warning',
      ECONOMIA: 'fa-piggy-bank text-success'
    }
    return icons[tipo] || 'fa-info-circle text-info'
  }

  if (loading) {
    return <div className="text-center py-12"><i className="fa-solid fa-spinner fa-spin fa-2x text-muted"></i></div>
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">
            <i className="fa-solid fa-chart-line me-2"></i>
            Análise de Mercado
          </h1>
          <p className="text-muted mb-0">Análise comparativa e tendências de preços</p>
        </div>
        <a href={`/obras/${obraId}/cotacoes`} className="btn btn-outline-secondary">
          <i className="fa-solid fa-arrow-left me-2"></i>
          Voltar
        </a>
      </div>

      {/* Filtro de Período */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="fa-solid fa-calendar me-2"></i>
            Período de Análise
          </h5>
        </div>
        <div className="card-body">
          <div className="row align-items-end">
            <div className="col-md-4">
              <label className="form-label">Data Início</label>
              <input
                type="date"
                className="form-control"
                name="inicio"
                value={periodo.inicio}
                onChange={handlePeriodoChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Data Fim</label>
              <input
                type="date"
                className="form-control"
                name="fim"
                value={periodo.fim}
                onChange={handlePeriodoChange}
              />
            </div>
            <div className="col-md-4">
              <button 
                className="btn btn-primary w-100"
                onClick={handleAplicarFiltro}
              >
                <i className="fa-solid fa-filter me-2"></i>
                Aplicar Filtro
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendações */}
      {recomendacoes.length > 0 && (
        <div className="card mb-4 border-info">
          <div className="card-header bg-info bg-opacity-10">
            <h5 className="card-title mb-0">
              <i className="fa-solid fa-lightbulb me-2 text-info"></i>
              Recomendações
            </h5>
          </div>
          <div className="card-body">
            {recomendacoes.map((rec, idx) => (
              <div key={idx} className="d-flex align-items-start mb-2">
                <i className={`fa-solid ${getRecomendacaoIcon(rec.tipo)} me-2 mt-1`}></i>
                <div>
                  <strong>{rec.tipo}:</strong> {rec.mensagem}
                  <div className="text-muted small">{rec.acao}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cards de Estatísticas */}
      {analise && (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card border-start border-primary border-4">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-primary bg-opacity-10 text-primary rounded p-3 d-flex align-items-center justify-content-center" style={{ width: '3rem', height: '3rem' }}>
                        <i className="fa-solid fa-file-invoice fa-lg"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="text-muted small">Total Cotações</div>
                      <div className="h4 mb-0 fw-bold">{analise.totalCotacoes}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-start border-success border-4">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-success bg-opacity-10 text-success rounded p-3 d-flex align-items-center justify-content-center" style={{ width: '3rem', height: '3rem' }}>
                        <i className="fa-solid fa-check-circle fa-lg"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="text-muted small">Aprovadas</div>
                      <div className="h4 mb-0 fw-bold">{analise.cotacoesAprovadas}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-start border-warning border-4">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-warning bg-opacity-10 text-warning rounded p-3 d-flex align-items-center justify-content-center" style={{ width: '3rem', height: '3rem' }}>
                        <i className="fa-solid fa-clock fa-lg"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="text-muted small">Pendentes</div>
                      <div className="h4 mb-0 fw-bold">{analise.cotacoesPendentes}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-start border-info border-4">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-info bg-opacity-10 text-info rounded p-3 d-flex align-items-center justify-content-center" style={{ width: '3rem', height: '3rem' }}>
                        <i className="fa-solid fa-coins fa-lg"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="text-muted small">Valor Total</div>
                      <div className="h6 mb-0 fw-bold">{formatCurrency(analise.valorTotalCotacoes)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fornecedor Mais Utilizado e Economia */}
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fa-solid fa-award me-2"></i>
                    Fornecedor Mais Utilizado
                  </h5>
                </div>
                <div className="card-body">
                  {analise.fornecedorMaisUtilizado ? (
                    <div className="text-center py-4">
                      <i className="fa-solid fa-trophy fa-3x text-warning mb-3"></i>
                      <h4>{analise.fornecedorMaisUtilizado}</h4>
                      <p className="text-muted mb-0">Fornecedor com mais cotações neste período</p>
                    </div>
                  ) : (
                    <p className="text-muted text-center py-4">Nenhum dado disponível</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 border-success">
                <div className="card-header bg-success text-white">
                  <h5 className="card-title mb-0">
                    <i className="fa-solid fa-piggy-bank me-2"></i>
                    Economia Potencial
                  </h5>
                </div>
                <div className="card-body">
                  <div className="text-center py-4">
                    <i className="fa-solid fa-sack-dollar fa-3x text-success mb-3"></i>
                    <h3 className="text-success">{formatCurrency(analise.economiaPotencial)}</h3>
                    <p className="text-muted mb-0">
                      Economia possível ao escolher melhores preços
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Análise Detalhada */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fa-solid fa-chart-pie me-2"></i>
                Resumo do Período
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <h6 className="text-muted">Período</h6>
                  <p className="fw-bold">
                    {new Date(periodo.inicio).toLocaleDateString('pt-PT')} até {new Date(periodo.fim).toLocaleDateString('pt-PT')}
                  </p>
                </div>
                <div className="col-md-4">
                  <h6 className="text-muted">Taxa de Aprovação</h6>
                  <p className="fw-bold">
                    {analise.totalCotacoes > 0 
                      ? ((analise.cotacoesAprovadas / analise.totalCotacoes) * 100).toFixed(1)
                      : 0}%
                  </p>
                </div>
                <div className="col-md-4">
                  <h6 className="text-muted">Ticket Médio</h6>
                  <p className="fw-bold">
                    {formatCurrency(
                      analise.totalCotacoes > 0 
                        ? analise.valorTotalCotacoes / analise.totalCotacoes 
                        : 0
                    )}
                  </p>
                </div>
              </div>

              {analise.cotacoesPendentes > 0 && (
                <div className="alert alert-warning mt-3 mb-0">
                  <i className="fa-solid fa-exclamation-triangle me-2"></i>
                  <strong>Atenção:</strong> Existem {analise.cotacoesPendentes} cotações pendentes que necessitam de decisão.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AnaliseMercado
