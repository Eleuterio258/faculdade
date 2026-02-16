import { useState, useEffect } from 'react'
import api from '../services/api'

const Relatorios = () => {
  const [obras, setObras] = useState([])
  const [selectedObra, setSelectedObra] = useState('')
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => { fetchObras() }, [])

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

  const generateReport = async () => {
    if (!selectedObra) return
    setGenerating(true)
    try {
      const obra = obras.find(o => o.id == selectedObra)
      const [custosRes, materiaisRes, cronogramasRes, equipasRes, ocorrenciasRes, diariosRes] = await Promise.all([
        api.get(`/api/custos/obra/${selectedObra}`).catch(() => ({ data: [] })),
        api.get(`/api/materiais/obra/${selectedObra}`).catch(() => ({ data: [] })),
        api.get(`/api/cronogramas/obra/${selectedObra}`).catch(() => ({ data: [] })),
        api.get(`/api/equipas/obra/${selectedObra}`).catch(() => ({ data: [] })),
        api.get(`/api/ocorrencias/obra/${selectedObra}`).catch(() => ({ data: [] })),
        api.get(`/api/diarios-obra/obra/${selectedObra}`).catch(() => ({ data: [] }))
      ])

      const custoTotal = custosRes.data.reduce((sum, c) => sum + (parseFloat(c.valor) || 0), 0)
      const materiaisLowStock = materiaisRes.data.filter(m => m.quantidadeMinima > 0 && parseFloat(m.quantidadeEstoque) <= parseFloat(m.quantidadeMinima))
      const ocorrenciasAbertas = ocorrenciasRes.data.filter(o => o.status === 'ABERTA' || o.status === 'EM_ANALISE')

      setReportData({
        obra,
        custos: custosRes.data,
        custoTotal,
        materiais: materiaisRes.data,
        materiaisLowStock,
        cronogramas: cronogramasRes.data,
        equipas: equipasRes.data,
        ocorrencias: ocorrenciasRes.data,
        ocorrenciasAbertas,
        diarios: diariosRes.data
      })
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
    }
    setGenerating(false)
  }

  const formatCurrency = (v) => {
    if (v == null) return '-'
    return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v)
  }

  const exportCSV = (data, headers, filename) => {
    if (!data || data.length === 0) { alert('Sem dados para exportar.'); return }
    const csvRows = [headers.map(h => h.label).join(',')]
    data.forEach(row => {
      csvRows.push(headers.map(h => {
        let val = h.key.split('.').reduce((o, k) => o?.[k], row)
        if (val == null) val = ''
        val = String(val).replace(/"/g, '""')
        return `"${val}"`
      }).join(','))
    })
    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportCustos = () => {
    exportCSV(reportData.custos, [
      { label: 'Descrição', key: 'descricao' },
      { label: 'Tipo', key: 'tipo' },
      { label: 'Valor', key: 'valor' },
      { label: 'Data', key: 'data' },
      { label: 'Observações', key: 'observacoes' }
    ], `custos_${reportData.obra.nome}.csv`)
  }

  const exportMateriais = () => {
    exportCSV(reportData.materiais, [
      { label: 'Nome', key: 'nome' },
      { label: 'Unidade', key: 'unidade' },
      { label: 'Stock', key: 'quantidadeEstoque' },
      { label: 'Mínimo', key: 'quantidadeMinima' },
      { label: 'Preço Unitário', key: 'precoUnitario' }
    ], `materiais_${reportData.obra.nome}.csv`)
  }

  const exportOcorrencias = () => {
    exportCSV(reportData.ocorrencias, [
      { label: 'Data', key: 'data' },
      { label: 'Título', key: 'titulo' },
      { label: 'Tipo', key: 'tipo' },
      { label: 'Gravidade', key: 'gravidade' },
      { label: 'Status', key: 'status' },
      { label: 'Descrição', key: 'descricao' }
    ], `ocorrencias_${reportData.obra.nome}.csv`)
  }

  const printReport = () => {
    window.print()
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
          <i className="fa-solid fa-chart-bar me-2"></i>
          Relatórios
        </h1>
        {reportData && (
          <button onClick={printReport} className="btn btn-outline-secondary">
            <i className="fa-solid fa-print me-2"></i>Imprimir
          </button>
        )}
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-8">
              <label className="form-label fw-medium">Selecionar Obra</label>
              <select value={selectedObra} onChange={(e) => { setSelectedObra(e.target.value); setReportData(null) }} className="form-select">
                {obras.map((obra) => (
                  <option key={obra.id} value={obra.id}>{obra.nome}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <button onClick={generateReport} className="btn btn-primary w-100" disabled={generating}>
                {generating ? <><i className="fa-solid fa-spinner fa-spin me-2"></i>A gerar...</> : <><i className="fa-solid fa-chart-bar me-2"></i>Gerar Relatório</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {reportData && (
        <div id="report-content">
          {/* Resumo Geral */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fa-solid fa-clipboard me-2"></i>
                Resumo - {reportData.obra.nome}
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="border rounded p-3 text-center">
                    <div className="text-muted small">Status</div>
                    <div className="fw-bold">{reportData.obra.status}</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border rounded p-3 text-center">
                    <div className="text-muted small">Conclusão</div>
                    <div className="fw-bold">{reportData.obra.percentualConclusao || 0}%</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border rounded p-3 text-center">
                    <div className="text-muted small">Orçamento</div>
                    <div className="fw-bold">{formatCurrency(reportData.obra.orcamentoPrevisto)}</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border rounded p-3 text-center">
                    <div className="text-muted small">Custo Real</div>
                    <div className={`fw-bold ${reportData.custoTotal > (parseFloat(reportData.obra.orcamentoPrevisto) || Infinity) ? 'text-danger' : ''}`}>
                      {formatCurrency(reportData.custoTotal)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row g-3 mt-1">
                <div className="col-md-3">
                  <div className="border rounded p-3 text-center">
                    <div className="text-muted small">Materiais</div>
                    <div className="fw-bold">{reportData.materiais.length}</div>
                    {reportData.materiaisLowStock.length > 0 && <small className="text-danger">{reportData.materiaisLowStock.length} stock baixo</small>}
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border rounded p-3 text-center">
                    <div className="text-muted small">Equipas</div>
                    <div className="fw-bold">{reportData.equipas.length}</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border rounded p-3 text-center">
                    <div className="text-muted small">Cronogramas</div>
                    <div className="fw-bold">{reportData.cronogramas.length}</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border rounded p-3 text-center">
                    <div className="text-muted small">Ocorrências Abertas</div>
                    <div className={`fw-bold ${reportData.ocorrenciasAbertas.length > 0 ? 'text-danger' : ''}`}>{reportData.ocorrenciasAbertas.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Custos */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0"><i className="fa-solid fa-coins me-2"></i>Custos</h5>
              <button onClick={exportCustos} className="btn btn-sm btn-outline-success">
                <i className="fa-solid fa-file-csv me-1"></i>Exportar CSV
              </button>
            </div>
            <div className="card-body">
              {reportData.custos.length === 0 ? (
                <p className="text-muted text-center">Sem custos registados.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr><th>Descrição</th><th>Tipo</th><th className="text-end">Valor</th><th>Data</th></tr>
                    </thead>
                    <tbody>
                      {reportData.custos.map(c => (
                        <tr key={c.id}><td>{c.descricao}</td><td><span className="badge bg-secondary">{c.tipo}</span></td><td className="text-end">{formatCurrency(c.valor)}</td><td className="text-muted small">{c.data}</td></tr>
                      ))}
                      <tr className="table-dark"><td colSpan="2" className="fw-bold">Total</td><td className="text-end fw-bold">{formatCurrency(reportData.custoTotal)}</td><td></td></tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Materiais */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0"><i className="fa-solid fa-box me-2"></i>Materiais</h5>
              <button onClick={exportMateriais} className="btn btn-sm btn-outline-success">
                <i className="fa-solid fa-file-csv me-1"></i>Exportar CSV
              </button>
            </div>
            <div className="card-body">
              {reportData.materiais.length === 0 ? (
                <p className="text-muted text-center">Sem materiais registados.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr><th>Nome</th><th>Stock</th><th>Mínimo</th><th className="text-end">Preço Unit.</th></tr>
                    </thead>
                    <tbody>
                      {reportData.materiais.map(m => {
                        const low = m.quantidadeMinima > 0 && parseFloat(m.quantidadeEstoque) <= parseFloat(m.quantidadeMinima)
                        return (
                          <tr key={m.id} className={low ? 'table-danger' : ''}>
                            <td>{m.nome}</td>
                            <td>{m.quantidadeEstoque} {m.unidade} {low && <span className="badge bg-danger ms-1">Baixo</span>}</td>
                            <td>{m.quantidadeMinima} {m.unidade}</td>
                            <td className="text-end">{formatCurrency(m.precoUnitario)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Ocorrências */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0"><i className="fa-solid fa-triangle-exclamation me-2"></i>Ocorrências</h5>
              <button onClick={exportOcorrencias} className="btn btn-sm btn-outline-success">
                <i className="fa-solid fa-file-csv me-1"></i>Exportar CSV
              </button>
            </div>
            <div className="card-body">
              {reportData.ocorrencias.length === 0 ? (
                <p className="text-muted text-center">Sem ocorrências registadas.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr><th>Data</th><th>Título</th><th>Tipo</th><th>Gravidade</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {reportData.ocorrencias.map(o => (
                        <tr key={o.id} className={o.gravidade === 'CRITICA' ? 'table-danger' : ''}>
                          <td className="text-muted small">{o.data}</td>
                          <td>{o.titulo}</td>
                          <td><span className="badge bg-secondary">{o.tipo}</span></td>
                          <td><span className={`badge ${o.gravidade === 'CRITICA' ? 'bg-dark' : o.gravidade === 'ALTA' ? 'bg-danger' : 'bg-warning'}`}>{o.gravidade}</span></td>
                          <td><span className={`badge ${o.status === 'ABERTA' ? 'bg-danger' : o.status === 'RESOLVIDA' ? 'bg-success' : 'bg-secondary'}`}>{o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Relatorios
