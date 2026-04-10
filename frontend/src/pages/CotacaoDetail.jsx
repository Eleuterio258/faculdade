import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { cotacaoService } from '../services/apiServices'

const CotacaoDetail = () => {
  const { id: obraId, cotacaoId } = useParams()
  const [cotacao, setCotacao] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCotacao()
  }, [cotacaoId])

  const fetchCotacao = async () => {
    try {
      setLoading(true)
      const response = await cotacaoService.obterCotacao(cotacaoId)
      setCotacao(response.data)
    } catch (error) {
      console.error('Erro ao carregar cotação:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (v) => {
    if (v == null) return '-'
    return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v)
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('pt-PT')
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

  if (loading) {
    return <div className="text-center py-12"><i className="fa-solid fa-spinner fa-spin fa-2x text-muted"></i></div>
  }

  if (!cotacao) {
    return (
      <div className="text-center py-12">
        <i className="fa-solid fa-exclamation-triangle fa-3x text-muted mb-3"></i>
        <p className="text-muted">Cotação não encontrada</p>
        <Link to={`/obras/${obraId}/cotacoes`} className="btn btn-primary">Voltar</Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">
            <i className="fa-solid fa-file-invoice-dollar me-2"></i>
            Cotação {cotacao.numeroCotacao}
          </h1>
          <p className="text-muted mb-0">{cotacao.fornecedor?.nome || '-'}</p>
        </div>
        <div>
          <Link 
            to={`/obras/${obraId}/cotacoes/${cotacaoId}/editar`}
            className="btn btn-primary me-2"
          >
            <i className="fa-solid fa-edit me-2"></i>
            Editar
          </Link>
          <Link 
            to={`/obras/${obraId}/cotacoes`}
            className="btn btn-outline-secondary"
          >
            <i className="fa-solid fa-arrow-left me-2"></i>
            Voltar
          </Link>
        </div>
      </div>

      {/* Informações Gerais */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="fa-solid fa-info-circle me-2"></i>
            Informações Gerais
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Fornecedor:</strong> {cotacao.fornecedor?.nome || '-'}</p>
              <p><strong>Data da Cotação:</strong> {formatDate(cotacao.dataCotacao)}</p>
              <p><strong>Data de Validade:</strong> {formatDate(cotacao.dataValidade)}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Status:</strong> <span className={`badge ${getStatusBadge(cotacao.status)}`}>{cotacao.status}</span></p>
              <p><strong>Condições de Pagamento:</strong> {cotacao.condicoesPagamento || '-'}</p>
              <p><strong>Prazo de Entrega:</strong> {cotacao.prazoEntrega || '-'}</p>
            </div>
          </div>
          {cotacao.observacoes && (
            <div className="mt-3">
              <strong>Observações:</strong>
              <p className="text-muted">{cotacao.observacoes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Itens da Cotação */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">
            <i className="fa-solid fa-list me-2"></i>
            Itens da Cotação
          </h5>
          <span className="badge bg-primary">{cotacao.itens?.length || 0} itens</span>
        </div>
        <div className="card-body">
          {cotacao.itens && cotacao.itens.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Material</th>
                    <th>Descrição</th>
                    <th>Qtd</th>
                    <th>Unidade</th>
                    <th>Preço Unit.</th>
                    <th>Desconto</th>
                    <th className="text-end">Preço Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cotacao.itens.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td>{idx + 1}</td>
                      <td>{item.material?.nome || '-'}</td>
                      <td>{item.descricaoMaterial}</td>
                      <td>{item.quantidade}</td>
                      <td>{item.unidade}</td>
                      <td>{formatCurrency(item.precoUnitario)}</td>
                      <td>{item.descontoPercentual ? `${item.descontoPercentual}%` : '-'}</td>
                      <td className="text-end fw-bold">{formatCurrency(item.precoTotal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-primary">
                    <td colSpan="7" className="text-end fw-bold">TOTAL:</td>
                    <td className="text-end fw-bold fs-5">{formatCurrency(cotacao.valorTotal)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p className="text-muted text-center py-4">Nenhum item nesta cotação</p>
          )}
        </div>
      </div>

      {/* Decisão */}
      {cotacao.decisao && (
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">
              <i className="fa-solid fa-gavel me-2"></i>
              Decisão
            </h5>
          </div>
          <div className="card-body">
            <p><strong>Data da Decisão:</strong> {formatDate(cotacao.dataDecisao)}</p>
            <p><strong>Decisão:</strong> <span className="badge bg-info">{cotacao.decisao}</span></p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CotacaoDetail
