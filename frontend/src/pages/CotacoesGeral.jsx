import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const CotacoesGeral = () => {
  const [obras, setObras] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/api/obras')
      .then(r => setObras(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" />
      </div>
    )
  }

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h2 className="fw-bold">Cotações</h2>
        <p className="text-muted">Seleccione uma obra para ver as suas cotações</p>
      </div>

      {obras.length === 0 ? (
        <div className="alert alert-info">Nenhuma obra disponível.</div>
      ) : (
        <div className="row g-3">
          {obras.map(obra => (
            <div key={obra.id} className="col-md-4">
              <div
                className="card h-100 shadow-sm border-0 cursor-pointer"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/obras/${obra.id}/cotacoes`)}
              >
                <div className="card-body">
                  <h5 className="card-title fw-semibold">{obra.nome}</h5>
                  <p className="text-muted small mb-2">{obra.localizacao || 'Sem localização'}</p>
                  <span className={`badge ${
                    obra.status === 'EM_ANDAMENTO' ? 'bg-success' :
                    obra.status === 'CONCLUIDA' ? 'bg-secondary' :
                    obra.status === 'PLANEAMENTO' ? 'bg-primary' :
                    obra.status === 'PARALISADA' ? 'bg-warning text-dark' : 'bg-danger'
                  }`}>
                    {obra.status?.replace('_', ' ')}
                  </span>
                </div>
                <div className="card-footer bg-transparent border-0">
                  <small className="text-primary">
                    <i className="fa-solid fa-file-invoice-dollar me-1" />
                    Ver cotações →
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CotacoesGeral
