import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { cotacaoService, materialService } from '../services/apiServices'

const ComparacaoCotacoes = () => {
  const { id: obraId } = useParams()
  const [materiais, setMateriais] = useState([])
  const [materiaisSelecionados, setMateriaisSelecionados] = useState([])
  const [comparacoes, setComparacoes] = useState([])
  const [loading, setLoading] = useState(false)
  const [comparando, setComparando] = useState(false)

  useEffect(() => {
    fetchMateriais()
  }, [obraId])

  const fetchMateriais = async () => {
    try {
      const response = await materialService.resumoMateriais(obraId)
      // Assumindo que materiais vêm no response
      setMateriais(response.data.listaMateriais || [])
    } catch (error) {
      console.error('Erro ao carregar materiais:', error)
    }
  }

  const handleToggleMaterial = (materialId) => {
    setMateriaisSelecionados(prev => 
      prev.includes(materialId)
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    )
  }

  const handleComparar = async () => {
    if (materiaisSelecionados.length === 0) {
      alert('Selecione pelo menos um material para comparar')
      return
    }

    try {
      setLoading(true)
      setComparando(true)
      const response = await cotacaoService.compararCotacoes(obraId, materiaisSelecionados)
      setComparacoes(response.data)
    } catch (error) {
      console.error('Erro ao comparar cotações:', error)
      alert('Erro ao comparar cotações. Verifique se existem cotações para os materiais selecionados.')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (v) => {
    if (v == null || v === 0) return '-'
    return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v)
  }

  const getEconomiaClass = (valor) => {
    if (valor > 5000) return 'text-success fw-bold'
    if (valor > 1000) return 'text-success'
    return 'text-muted'
  }

  if (comparando && comparacoes.length === 0) {
    return <div className="text-center py-12"><i className="fa-solid fa-spinner fa-spin fa-2x text-muted"></i></div>
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">
            <i className="fa-solid fa-balance-scale me-2"></i>
            Comparação de Preços
          </h1>
          <p className="text-muted mb-0">Compare preços entre diferentes fornecedores</p>
        </div>
        <a href={`/obras/${obraId}/cotacoes`} className="btn btn-outline-secondary">
          <i className="fa-solid fa-arrow-left me-2"></i>
          Voltar
        </a>
      </div>

      {!comparando ? (
        <>
          {/* Seleção de Materiais */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fa-solid fa-box me-2"></i>
                Selecione os Materiais para Comparar
              </h5>
            </div>
            <div className="card-body">
              {materiais.length === 0 ? (
                <p className="text-muted text-center py-4">Nenhum material encontrado</p>
              ) : (
                <div className="row">
                  {materiais.map(material => (
                    <div className="col-md-4 mb-3" key={material.id}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={materiaisSelecionados.includes(material.id)}
                          onChange={() => handleToggleMaterial(material.id)}
                          id={`material-${material.id}`}
                        />
                        <label className="form-check-label" htmlFor={`material-${material.id}`}>
                          <strong>{material.nome}</strong>
                          <div className="small text-muted">
                            Stock: {material.quantidadeEstoque} {material.unidade}
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3">
                <small className="text-muted">
                  {materiaisSelecionados.length} material(is) selecionado(s)
                </small>
              </div>

              <div className="mt-4">
                <button 
                  className="btn btn-primary"
                  onClick={handleComparar}
                  disabled={loading || materiaisSelecionados.length === 0}
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin me-2"></i>
                      A comparar...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-balance-scale me-2"></i>
                      Comparar Preços
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Botão Nova Comparação */}
          <div className="mb-4">
            <button 
              className="btn btn-outline-primary"
              onClick={() => {
                setComparando(false)
                setComparacoes([])
              }}
            >
              <i className="fa-solid fa-redo me-2"></i>
              Nova Comparação
            </button>
          </div>

          {/* Resultados da Comparação */}
          {comparacoes.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="fa-solid fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <p className="text-muted">Não foram encontradas cotações para os materiais selecionados</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setComparando(false)
                    setComparacoes([])
                  }}
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          ) : (
            comparacoes.map((comp, idx) => (
              <div key={idx} className="card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title mb-0">
                    <i className="fa-solid fa-box me-2"></i>
                    {comp.materialNome}
                  </h5>
                </div>
                <div className="card-body">
                  {/* Tabela de Comparação */}
                  <div className="table-responsive mb-4">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Fornecedor</th>
                          <th className="text-end">Preço Unitário</th>
                          <th className="text-end">Preço Total</th>
                          <th>Condições Pagamento</th>
                          <th>Prazo Entrega</th>
                          <th className="text-end">Diferença</th>
                          <th className="text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comp.comparacoes.map((c, cIdx) => (
                          <tr key={cIdx} className={c.menorPreco ? 'table-success' : ''}>
                            <td>
                              <strong>{c.fornecedorNome}</strong>
                              {c.menorPreco && (
                                <span className="badge bg-success ms-2">Menor Preço</span>
                              )}
                            </td>
                            <td className="text-end fw-bold">{formatCurrency(c.precoUnitario)}</td>
                            <td className="text-end">{formatCurrency(c.precoTotal)}</td>
                            <td>{c.condicoesPagamento || '-'}</td>
                            <td>{c.prazoEntrega || '-'}</td>
                            <td className={`text-end ${c.percentualDiferenca > 0 ? 'text-danger' : 'text-success'}`}>
                              {c.percentualDiferenca > 0 ? `+${c.percentualDiferenca}%` : '0%'}
                            </td>
                            <td className="text-center">
                              {c.menorPreco ? (
                                <i className="fa-solid fa-check-circle text-success fa-lg"></i>
                              ) : (
                                <i className="fa-solid fa-minus-circle text-muted"></i>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Melhor Preço e Estatísticas */}
                  {comp.melhorPreco && (
                    <div className="row">
                      <div className="col-md-6">
                        <div className="alert alert-success">
                          <h6 className="alert-heading">
                            <i className="fa-solid fa-trophy me-2"></i>
                            Melhor Oferta
                          </h6>
                          <p className="mb-1">
                            <strong>Fornecedor:</strong> {comp.melhorPreco.fornecedorNome}
                          </p>
                          <p className="mb-1">
                            <strong>Preço:</strong> {formatCurrency(comp.melhorPreco.precoUnitario)}
                          </p>
                          <p className="mb-0">
                            <strong>Economia Potencial:</strong> 
                            <span className={getEconomiaClass(comp.melhorPreco.economiaPotencial)}>
                              {' '}{formatCurrency(comp.melhorPreco.economiaPotencial)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card bg-light">
                          <div className="card-body">
                            <h6 className="card-title">
                              <i className="fa-solid fa-chart-bar me-2"></i>
                              Estatísticas
                            </h6>
                            <div className="row text-center">
                              <div className="col-4">
                                <div className="small text-muted">Menor</div>
                                <div className="fw-bold text-success">
                                  {formatCurrency(comp.estatisticas.menorPreco)}
                                </div>
                              </div>
                              <div className="col-4">
                                <div className="small text-muted">Médio</div>
                                <div className="fw-bold text-primary">
                                  {formatCurrency(comp.estatisticas.precoMedio)}
                                </div>
                              </div>
                              <div className="col-4">
                                <div className="small text-muted">Maior</div>
                                <div className="fw-bold text-danger">
                                  {formatCurrency(comp.estatisticas.maiorPreco)}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 small text-muted text-center">
                              {comp.estatisticas.totalFornecedores} fornecedor(es)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  )
}

export default ComparacaoCotacoes
