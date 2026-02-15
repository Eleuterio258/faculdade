import { useState, useEffect } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

const Cronogramas = () => {
  const [cronogramas, setCronogramas] = useState([])
  const [obras, setObras] = useState([])
  const [selectedObra, setSelectedObra] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchObras()
  }, [])

  useEffect(() => {
    if (selectedObra) {
      fetchCronogramas()
    }
  }, [selectedObra])

  const fetchObras = async () => {
    try {
      const response = await api.get('/api/obras')
      setObras(response.data)
      if (response.data.length > 0) {
        setSelectedObra(response.data[0].id)
      }
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar obras:', error)
      setLoading(false)
    }
  }

  const fetchCronogramas = async () => {
    try {
      const response = await api.get(`/api/cronogramas/obra/${selectedObra}`)
      setCronogramas(response.data)
    } catch (error) {
      console.error('Erro ao carregar cronogramas:', error)
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
      <h1 className="h3 mb-4">
        <i className="fa-solid fa-calendar me-2"></i>
        Cronogramas
      </h1>

      <div className="card mb-4">
        <div className="card-body">
          <label className="form-label fw-medium">Selecionar Obra</label>
          <select
            value={selectedObra}
            onChange={(e) => setSelectedObra(e.target.value)}
            className="form-select"
          >
            {obras.map((obra) => (
              <option key={obra.id} value={obra.id}>
                {obra.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title mb-0">
            <i className="fa-solid fa-list me-2"></i>
            Cronogramas da Obra
          </h2>
        </div>
        <div className="card-body">
          {cronogramas.length === 0 ? (
            <p className="text-muted text-center py-4">Nenhum cronograma encontrado para esta obra.</p>
          ) : (
            <div className="row g-3">
              {cronogramas.map((cronograma) => (
                <div key={cronograma.id} className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">
                        <i className="fa-solid fa-calendar-days me-2 text-primary"></i>
                        {cronograma.nome}
                      </h5>
                      {cronograma.descricao && (
                        <p className="card-text text-muted small">{cronograma.descricao}</p>
                      )}
                    </div>
                    <div className="card-footer bg-transparent">
                      <Link to={`/cronogramas/${cronograma.id}`} className="btn btn-sm btn-primary w-100">
                        <i className="fa-solid fa-eye me-2"></i>
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cronogramas
