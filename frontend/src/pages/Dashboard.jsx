import { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalObras: 0, obrasEmAndamento: 0, obrasConcluidas: 0,
    custoTotal: 0, orcamentoTotal: 0, totalMateriais: 0,
    materiaisStockBaixo: 0, totalEquipas: 0
  })
  const [obras, setObras] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchDashboardData() }, [])

  const fetchDashboardData = async () => {
    try {
      const obrasRes = await api.get('/api/obras')
      const obrasList = obrasRes.data

      let totalMateriais = 0
      let materiaisStockBaixo = 0
      let totalEquipas = 0

      const materiaisPromises = obrasList.map(o => api.get(`/api/materiais/obra/${o.id}`).catch(() => ({ data: [] })))
      const equipasPromises = obrasList.map(o => api.get(`/api/equipas/obra/${o.id}`).catch(() => ({ data: [] })))

      const [materiaisResults, equipasResults] = await Promise.all([
        Promise.all(materiaisPromises),
        Promise.all(equipasPromises)
      ])

      materiaisResults.forEach(res => {
        totalMateriais += res.data.length
        res.data.forEach(m => {
          if (m.quantidadeMinima > 0 && parseFloat(m.quantidadeEstoque) <= parseFloat(m.quantidadeMinima)) {
            materiaisStockBaixo++
          }
        })
      })

      equipasResults.forEach(res => { totalEquipas += res.data.length })

      setStats({
        totalObras: obrasList.length,
        obrasEmAndamento: obrasList.filter(o => o.status === 'EM_ANDAMENTO').length,
        obrasConcluidas: obrasList.filter(o => o.status === 'CONCLUIDA').length,
        custoTotal: obrasList.reduce((sum, o) => sum + (parseFloat(o.custoRealizado) || 0), 0),
        orcamentoTotal: obrasList.reduce((sum, o) => sum + (parseFloat(o.orcamentoPrevisto) || 0), 0),
        totalMateriais,
        materiaisStockBaixo,
        totalEquipas
      })

      setObras(obrasList)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setLoading(false)
    }
  }

  const formatCurrency = (v) => {
    if (v == null) return '-'
    return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v)
  }

  const statusLabel = (status) => {
    const labels = { PLANEAMENTO: 'Planeamento', EM_ANDAMENTO: 'Em Andamento', CONCLUIDA: 'Concluída', PARALISADA: 'Paralisada', CANCELADA: 'Cancelada' }
    return labels[status] || status
  }

  const statusBadgeClass = (status) => {
    const c = { EM_ANDAMENTO: 'bg-success', CONCLUIDA: 'bg-primary', PARALISADA: 'bg-warning', CANCELADA: 'bg-danger', PLANEAMENTO: 'bg-secondary' }
    return c[status] || 'bg-secondary'
  }

  const statusCounts = () => {
    const counts = {}
    obras.forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1 })
    return counts
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <i className="fa-solid fa-spinner fa-spin fa-2x text-muted"></i>
        <p className="mt-3 text-muted">A carregar...</p>
      </div>
    )
  }

  const counts = statusCounts()
  const statusOrder = ['PLANEAMENTO', 'EM_ANDAMENTO', 'PARALISADA', 'CONCLUIDA', 'CANCELADA']
  const orcamentoUsado = stats.orcamentoTotal > 0 ? ((stats.custoTotal / stats.orcamentoTotal) * 100).toFixed(1) : 0

  return (
    <div>
      <h1 className="h3 mb-4">
        <i className="fa-solid fa-gauge-high me-2"></i>
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card border-start border-primary border-4">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary bg-opacity-10 text-primary rounded p-3 d-flex align-items-center justify-content-center" style={{ width: '3rem', height: '3rem' }}>
                    <i className="fa-solid fa-briefcase fa-lg"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="text-muted small">Total de Obras</div>
                  <div className="h4 mb-0 fw-bold">{stats.totalObras}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-start border-success border-4">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-success bg-opacity-10 text-success rounded p-3 d-flex align-items-center justify-content-center" style={{ width: '3rem', height: '3rem' }}>
                    <i className="fa-solid fa-chart-line fa-lg"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="text-muted small">Em Andamento</div>
                  <div className="h4 mb-0 fw-bold">{stats.obrasEmAndamento}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-start border-info border-4">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-info bg-opacity-10 text-info rounded p-3 d-flex align-items-center justify-content-center" style={{ width: '3rem', height: '3rem' }}>
                    <i className="fa-solid fa-coins fa-lg"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="text-muted small">Custo Total</div>
                  <div className="h5 mb-0 fw-bold">{formatCurrency(stats.custoTotal)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-start border-warning border-4">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-warning bg-opacity-10 text-warning rounded p-3 d-flex align-items-center justify-content-center" style={{ width: '3rem', height: '3rem' }}>
                    <i className="fa-solid fa-box fa-lg"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="text-muted small">Materiais</div>
                  <div className="h4 mb-0 fw-bold">{stats.totalMateriais}</div>
                  {stats.materiaisStockBaixo > 0 && (
                    <small className="text-danger">{stats.materiaisStockBaixo} com stock baixo</small>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second row - Financial + Status Distribution */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fa-solid fa-chart-pie me-2"></i>
                Distribuição por Status
              </h5>
            </div>
            <div className="card-body">
              {stats.totalObras === 0 ? (
                <p className="text-muted text-center py-4">Nenhuma obra registada.</p>
              ) : (
                <div>
                  {statusOrder.map(status => {
                    const count = counts[status] || 0
                    if (count === 0) return null
                    const pct = ((count / stats.totalObras) * 100).toFixed(0)
                    return (
                      <div key={status} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="small fw-medium">{statusLabel(status)}</span>
                          <span className="small text-muted">{count} ({pct}%)</span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div className={`progress-bar ${statusBadgeClass(status)}`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fa-solid fa-coins me-2"></i>
                Resumo Financeiro
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small fw-medium">Orçamento Total</span>
                  <span className="small fw-bold">{formatCurrency(stats.orcamentoTotal)}</span>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small fw-medium">Custo Realizado</span>
                  <span className="small fw-bold">{formatCurrency(stats.custoTotal)}</span>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="small fw-medium">Utilização do Orçamento</span>
                  <span className={`small fw-bold ${orcamentoUsado > 100 ? 'text-danger' : 'text-success'}`}>{orcamentoUsado}%</span>
                </div>
                <div className="progress" style={{ height: '10px' }}>
                  <div className={`progress-bar ${orcamentoUsado > 100 ? 'bg-danger' : orcamentoUsado > 80 ? 'bg-warning' : 'bg-success'}`}
                    style={{ width: `${Math.min(orcamentoUsado, 100)}%` }}></div>
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span className="small fw-medium">Equipas Ativas</span>
                <span className="small fw-bold">{stats.totalEquipas}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Obras with budget comparison */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">
            <i className="fa-solid fa-list me-2"></i>
            Obras - Visão Geral
          </h5>
          <Link to="/obras" className="btn btn-sm btn-outline-primary">Ver Todas</Link>
        </div>
        <div className="card-body">
          {obras.length === 0 ? (
            <p className="text-muted text-center py-4">Nenhuma obra encontrada.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Localização</th>
                    <th>Status</th>
                    <th>Conclusão</th>
                    <th className="text-end">Orçamento</th>
                    <th className="text-end">Custo Real</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {obras.map((obra) => {
                    const orcamento = parseFloat(obra.orcamentoPrevisto) || 0
                    const custo = parseFloat(obra.custoRealizado) || 0
                    const overBudget = orcamento > 0 && custo > orcamento
                    return (
                      <tr key={obra.id}>
                        <td>
                          <Link to={`/obras/${obra.id}`} className="text-decoration-none fw-medium">
                            {obra.nome}
                          </Link>
                        </td>
                        <td className="text-muted">{obra.localizacao}</td>
                        <td>
                          <span className={`badge ${statusBadgeClass(obra.status)}`}>
                            {statusLabel(obra.status)}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress flex-grow-1 me-2" style={{ height: '6px', width: '60px' }}>
                              <div className="progress-bar" style={{ width: `${obra.percentualConclusao || 0}%` }}></div>
                            </div>
                            <small className="text-muted">{obra.percentualConclusao || 0}%</small>
                          </div>
                        </td>
                        <td className="text-end">{formatCurrency(orcamento || null)}</td>
                        <td className={`text-end ${overBudget ? 'text-danger fw-bold' : ''}`}>
                          {formatCurrency(custo || null)}
                          {overBudget && <i className="fa-solid fa-triangle-exclamation ms-1 text-danger"></i>}
                        </td>
                        <td className="text-end">
                          <Link to={`/obras/${obra.id}`} className="btn btn-sm btn-outline-primary">
                            <i className="fa-solid fa-eye me-1"></i>Ver
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
