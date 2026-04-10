import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { cotacaoService } from '../services/apiServices'

const Cotacoes = () => {
  const { id: obraId } = useParams()
  const [cotacoes, setCotacoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('TODAS')
  const [showRecomendacoes, setShowRecomendacoes] = useState(false)
  const [recomendacoes, setRecomendacoes] = useState([])

  useEffect(() => {
    fetchCotacoes()
    fetchRecomendacoes()
  }, [obraId, filter])

  const fetchCotacoes = async () => {
    try {
      setLoading(true)
      const response = await cotacaoService.listarCotacoes(obraId)
      let data = response.data
      
      if (filter !== 'TODAS') {
        data = data.filter(c => c.status === filter)
      }
      
      setCotacoes(data)
    } catch (error) {
      console.error('Erro ao carregar cotações:', error)
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

  const handleAtualizarStatus = async (id, status, decisao = null) => {
    try {
      await cotacaoService.atualizarStatus(id, status, decisao)
      fetchCotacoes()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status da cotação')
    }
  }

  const handleEliminar = async (id) => {
    if (window.confirm('Tem certeza que deseja eliminar esta cotação?')) {
      try {
        await cotacaoService.eliminarCotacao(id)
        fetchCotacoes()
      } catch (error) {
        console.error('Erro ao eliminar cotação:', error)
        alert('Erro ao eliminar cotação')
      }
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      PENDENTE: 'bg-warning',
      ENVIADA: 'bg-info',
      RECEBIDA: 'bg-primary',
      EM_ANALISE: 'bg-secondary',
      APROVADA: 'bg-success',
      REJEITADA: 'bg-danger',
      EXPIRADA: 'bg-dark'
    }
    return badges[status] || 'bg-secondary'
  }

  const getStatusLabel = (status) => {
    const labels = {
      PENDENTE: 'Pendente',
      ENVIADA: 'Enviada',
      RECEBIDA: 'Recebida',
      EM_ANALISE: 'Em Análise',
      APROVADA: 'Aprovada',
      REJEITADA: 'Rejeitada',
      EXPIRADA: 'Expirada'
    }
    return labels[status] || status
  }

  const getRecomendacaoIcon = (tipo) => {
    const icons = {
      URGENTE: 'fa-exclamation-circle text-danger',
      ALERTA: 'fa-exclamation-triangle text-warning',
      ECONOMIA: 'fa-piggy-bank text-success'
    }
    return icons[tipo] || 'fa-info-circle text-info'
  }

  const formatCurrency = (v) => {
    if (v == null) return '-'
    return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v)
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('pt-PT')
  }

  const statusCounts = () => {
    const counts = {}
    cotacoes.forEach(c => {
      counts[c.status] = (counts[c.status] || 0) + 1
    })
    return counts
  }

  if (loading) {
    return <div className="text-center py-12"><i className="fa-solid fa-spinner fa-spin fa-2x text-muted"></i></div>
  }

  const counts = statusCounts()

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">
            <i className="fa-solid fa-file-invoice-dollar me-2"></i>
            Cotações
          </h1>
          <p className="text-muted mb-0">Gestão e comparação de cotações de fornecedores</p>
        </div>
        <div>
          <Link 
            to={`/obras/${obraId}/cotacoes/nova`}
            className="btn btn-primary me-2"
          >
            <i className="fa-solid fa-plus me-2"></i>
            Nova Cotação
          </Link>
          <Link 
            to={`/obras/${obraId}/cotacoes/comparar`}
            className="btn btn-success me-2"
          >
            <i className="fa-solid fa-balance-scale me-2"></i>
            Comparar Preços
          </Link>
          <Link 
            to={`/obras/${obraId}/cotacoes/analise`}
            className="btn btn-info"
          >
            <i className="fa-solid fa-chart-line me-2"></i>
            Análise Mercado
          </Link>
        </div>
      </div>

      {/* Recomendações */}
      {recomendacoes.length > 0 && (
        <div className="card mb-4 border-warning">
          <div className="card-header bg-warning bg-opacity-10">
            <h5 className="card-title mb-0">
              <i className="fa-solid fa-lightbulb me-2 text-warning"></i>
              Recomendações Inteligentes
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

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn ${filter === 'TODAS' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('TODAS')}
                >
                  Todas ({counts['TODAS'] || cotacoes.length})
                </button>
                <button
                  type="button"
                  className={`btn ${filter === 'PENDENTE' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => setFilter('PENDENTE')}
                >
                  Pendentes ({counts['PENDENTE'] || 0})
                </button>
                <button
                  type="button"
                  className={`btn ${filter === 'EM_ANALISE' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                  onClick={() => setFilter('EM_ANALISE')}
                >
                  Em Análise ({counts['EM_ANALISE'] || 0})
                </button>
                <button
                  type="button"
                  className={`btn ${filter === 'APROVADA' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFilter('APROVADA')}
                >
                  Aprovadas ({counts['APROVADA'] || 0})
                </button>
              </div>
            </div>
            <div className="col-md-4 text-end">
              <span className="text-muted">Total: {cotacoes.length} cotações</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Cotações */}
      <div className="card">
        <div className="card-body">
          {cotacoes.length === 0 ? (
            <div className="text-center py-5">
              <i className="fa-solid fa-file-invoice fa-3x text-muted mb-3"></i>
              <p className="text-muted">Nenhuma cotação encontrada</p>
              <Link to={`/obras/${obraId}/cotacoes/nova`} className="btn btn-primary">
                <i className="fa-solid fa-plus me-2"></i>
                Criar Primeira Cotação
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Fornecedor</th>
                    <th>Data</th>
                    <th>Validade</th>
                    <th className="text-end">Valor Total</th>
                    <th>Status</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cotacoes.map(cotacao => (
                    <tr key={cotacao.id}>
                      <td>
                        <strong>{cotacao.numeroCotacao}</strong>
                      </td>
                      <td>{cotacao.fornecedor?.nome || '-'}</td>
                      <td>{formatDate(cotacao.dataCotacao)}</td>
                      <td>
                        {cotacao.dataValidade ? (
                          <span className={new Date(cotacao.dataValidade) < new Date() ? 'text-danger' : ''}>
                            {formatDate(cotacao.dataValidade)}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="text-end fw-bold">{formatCurrency(cotacao.valorTotal)}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(cotacao.status)}`}>
                          {getStatusLabel(cotacao.status)}
                        </span>
                      </td>
                      <td className="text-end">
                        <Link 
                          to={`/obras/${obraId}/cotacoes/${cotacao.id}`}
                          className="btn btn-sm btn-outline-primary me-1"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </Link>
                        <Link 
                          to={`/obras/${obraId}/cotacoes/${cotacao.id}/editar`}
                          className="btn btn-sm btn-outline-secondary me-1"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </Link>
                        {cotacao.status === 'PENDENTE' && (
                          <button 
                            className="btn btn-sm btn-outline-success me-1"
                            onClick={() => handleAtualizarStatus(cotacao.id, 'EM_ANALISE')}
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                        )}
                        {(cotacao.status === 'EM_ANALISE' || cotacao.status === 'RECEBIDA') && (
                          <>
                            <button 
                              className="btn btn-sm btn-success me-1"
                              onClick={() => handleAtualizarStatus(cotacao.id, 'APROVADA', 'APROVADA')}
                            >
                              <i className="fa-solid fa-check-double"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-danger me-1"
                              onClick={() => handleAtualizarStatus(cotacao.id, 'REJEITADA', 'REJEITADA_PRECO')}
                            >
                              <i className="fa-solid fa-times"></i>
                            </button>
                          </>
                        )}
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleEliminar(cotacao.id)}
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
    </div>
  )
}

export default Cotacoes
