import { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalObras: 0,
    obrasEmAndamento: 0,
    custoTotal: 0,
    materiais: 0
  })
  const [recentObras, setRecentObras] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const obrasResponse = await api.get('/api/obras')
      const obras = obrasResponse.data

      const totalObras = obras.length
      const obrasEmAndamento = obras.filter(o => o.status === 'EM_ANDAMENTO').length
      const custoTotal = obras.reduce((sum, o) => sum + (parseFloat(o.custoRealizado) || 0), 0)

      setStats({
        totalObras,
        obrasEmAndamento,
        custoTotal,
        materiais: 0
      })

      setRecentObras(obras.slice(0, 5))
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setLoading(false)
    }
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
      <h1 className="h3 mb-4">Dashboard</h1>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary text-white rounded p-3" style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-success text-white rounded p-3" style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-info text-white rounded p-3" style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-dollar-sign fa-lg"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="text-muted small">Custo Total</div>
                  <div className="h4 mb-0 fw-bold">
                    {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(stats.custoTotal)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-warning text-white rounded p-3" style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-box fa-lg"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="text-muted small">Materiais</div>
                  <div className="h4 mb-0 fw-bold">{stats.materiais}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title mb-0">
            <i className="fa-solid fa-list me-2"></i>
            Obras Recentes
          </h2>
        </div>
        <div className="card-body">
          {recentObras.length === 0 ? (
            <p className="text-muted text-center py-4">Nenhuma obra encontrada.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Localização</th>
                    <th>Status</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {recentObras.map((obra) => (
                    <tr key={obra.id}>
                      <td>
                        <Link to={`/obras/${obra.id}`} className="text-decoration-none fw-medium">
                          {obra.nome}
                        </Link>
                      </td>
                      <td className="text-muted">{obra.localizacao}</td>
                      <td>
                        <span className={`badge ${
                          obra.status === 'EM_ANDAMENTO' ? 'bg-success' :
                          obra.status === 'CONCLUIDA' ? 'bg-primary' :
                          'bg-secondary'
                        }`}>
                          {obra.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <Link to={`/obras/${obra.id}`} className="btn btn-sm btn-outline-primary">
                          <i className="fa-solid fa-eye me-1"></i>
                          Ver
                        </Link>
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

export default Dashboard
