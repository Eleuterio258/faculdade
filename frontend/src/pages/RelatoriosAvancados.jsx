import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { relatorioService, exportService } from '../services/apiServices'
import api from '../services/api'

const RelatoriosAvancados = () => {
  const { id: obraId } = useParams()
  const [obra, setObra] = useState(null)
  const [relatorio, setRelatorio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (obraId) {
      fetchRelatorio()
    }
  }, [obraId])

  const fetchRelatorio = async () => {
    try {
      setLoading(true)
      const response = await relatorioService.relatorioObra(obraId)
      setRelatorio(response.data)
      setObra(response.data.obra)
    } catch (error) {
      console.error('Erro ao carregar relatório:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      setExporting(true)
      const response = await exportService.exportObraPDF(obraId)
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `relatorio_obra_${obraId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Erro ao exportar PDF:', error)
      alert('Erro ao exportar PDF')
    } finally {
      setExporting(false)
    }
  }

  const handleExportCustosExcel = async () => {
    try {
      setExporting(true)
      const response = await exportService.exportCustosExcel(obraId)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `custos_obra_${obraId}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Erro ao exportar Excel:', error)
      alert('Erro ao exportar Excel')
    } finally {
      setExporting(false)
    }
  }

  const handleExportMateriaisExcel = async () => {
    try {
      setExporting(true)
      const response = await exportService.exportMateriaisExcel(obraId)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `materiais_obra_${obraId}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Erro ao exportar Excel:', error)
      alert('Erro ao exportar Excel')
    } finally {
      setExporting(false)
    }
  }

  const formatCurrency = (v) => {
    if (v == null) return '-'
    return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v)
  }

  const statusLabel = (status) => {
    const labels = {
      PLANEAMENTO: 'Planeamento',
      EM_ANDAMENTO: 'Em Andamento',
      CONCLUIDA: 'Concluída',
      PARALISADA: 'Paralisada',
      CANCELADA: 'Cancelada'
    }
    return labels[status] || status
  }

  if (loading) {
    return <div className="text-center py-12"><i className="fa-solid fa-spinner fa-spin fa-2x text-muted"></i></div>
  }

  if (!relatorio || !obra) {
    return (
      <div className="text-center py-12">
        <i className="fa-solid fa-exclamation-triangle fa-3x text-muted mb-3"></i>
        <p className="text-muted">Erro ao carregar relatório</p>
        <Link to="/obras" className="btn btn-primary">Voltar às Obras</Link>
      </div>
    )
  }

  const { dadosGerais, progresso, financas, materiais, equipas, ocorrencias } = relatorio

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">
            <i className="fa-solid fa-chart-bar me-2"></i>
            Relatório da Obra
          </h1>
          <p className="text-muted mb-0">{obra.nome}</p>
        </div>
        <div className="btn-group">
          <button 
            className="btn btn-danger"
            onClick={handleExportPDF}
            disabled={exporting}
          >
            <i className="fa-solid fa-file-pdf me-2"></i>
            Exportar PDF
          </button>
          <button 
            className="btn btn-success"
            onClick={handleExportCustosExcel}
            disabled={exporting}
          >
            <i className="fa-solid fa-file-excel me-2"></i>
            Custos Excel
          </button>
          <button 
            className="btn btn-info"
            onClick={handleExportMateriaisExcel}
            disabled={exporting}
          >
            <i className="fa-solid fa-file-excel me-2"></i>
            Materiais Excel
          </button>
        </div>
      </div>

      {/* Dados Gerais */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="fa-solid fa-info-circle me-2"></i>
            Dados Gerais
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Nome:</strong> {dadosGerais.nome}</p>
              <p><strong>Descrição:</strong> {dadosGerais.descricao || '-'}</p>
              <p><strong>Endereço:</strong> {dadosGerais.endereco}</p>
              <p><strong>Localização:</strong> {dadosGerais.localizacao}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Status:</strong> <span className="badge bg-primary">{statusLabel(dadosGerais.status)}</span></p>
              <p><strong>Início:</strong> {new Date(dadosGerais.dataInicio).toLocaleDateString('pt-PT')}</p>
              <p><strong>Término Previsto:</strong> {dadosGerais.dataFimPrevista ? new Date(dadosGerais.dataFimPrevista).toLocaleDateString('pt-PT') : '-'}</p>
              <p><strong>Dias Decorridos:</strong> {dadosGerais.diasDecorridos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progresso e Finanças */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fa-solid fa-tasks me-2"></i>
                Progresso
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Conclusão Geral</span>
                  <strong>{obra.percentualConclusao}%</strong>
                </div>
                <div className="progress" style={{ height: '20px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: `${obra.percentualConclusao}%` }}
                  >
                    {obra.percentualConclusao}%
                  </div>
                </div>
              </div>
              <hr />
              <div className="row text-center">
                <div className="col-4">
                  <div className="text-muted small">Total Atividades</div>
                  <div className="h4">{progresso.totalAtividades}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">Concluídas</div>
                  <div className="h4 text-success">{progresso.atividadesConcluidas}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">Atrasadas</div>
                  <div className="h4 text-danger">{progresso.atividadesAtrasadas}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fa-solid fa-dollar-sign me-2"></i>
                Finanças
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Orçamento Previsto</span>
                  <strong>{formatCurrency(financas.orcamentoPrevisto)}</strong>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Custo Realizado</span>
                  <strong>{formatCurrency(financas.custoRealizado)}</strong>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Desvio</span>
                  <strong className={financas.desvio > 0 ? 'text-danger' : 'text-success'}>
                    {formatCurrency(financas.desvio)}
                  </strong>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>% Desvio</span>
                  <strong className={financas.percentualDesvio > 0 ? 'text-danger' : 'text-success'}>
                    {financas.percentualDesvio.toFixed(2)}%
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Materiais e Ocorrências */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fa-solid fa-box me-2"></i>
                Materiais
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center mb-3">
                <div className="col-4">
                  <div className="text-muted small">Total</div>
                  <div className="h4">{materiais.totalMateriais}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">Stock Crítico</div>
                  <div className="h4 text-danger">{materiais.materiaisStockCritico}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">Valor Stock</div>
                  <div className="h6">{formatCurrency(materiais.valorTotalStock)}</div>
                </div>
              </div>
              {materiais.materiaisStockCritico > 0 && (
                <div className="alert alert-warning">
                  <i className="fa-solid fa-exclamation-triangle me-2"></i>
                  <strong>Atenção:</strong> Existem {materiais.materiaisStockCritico} materiais com stock crítico!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fa-solid fa-exclamation-triangle me-2"></i>
                Ocorrências
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center mb-3">
                <div className="col-3">
                  <div className="text-muted small">Total</div>
                  <div className="h4">{ocorrencias.totalOcorrencias}</div>
                </div>
                <div className="col-3">
                  <div className="text-muted small">Abertas</div>
                  <div className="h4 text-warning">{ocorrencias.abertas}</div>
                </div>
                <div className="col-3">
                  <div className="text-muted small">Em Resolução</div>
                  <div className="h4 text-info">{ocorrencias.emAnalise}</div>
                </div>
                <div className="col-3">
                  <div className="text-muted small">Resolvidas</div>
                  <div className="h4 text-success">{ocorrencias.resolvidas}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equipas */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="fa-solid fa-users me-2"></i>
            Equipas
          </h5>
        </div>
        <div className="card-body">
          <p className="h4 text-center">{equipas.totalEquipas} equipa(s) registada(s)</p>
        </div>
      </div>

      {/* Voltar */}
      <div className="text-center">
        <Link to={`/obras/${obraId}`} className="btn btn-secondary">
          <i className="fa-solid fa-arrow-left me-2"></i>
          Voltar à Obra
        </Link>
      </div>
    </div>
  )
}

export default RelatoriosAvancados
