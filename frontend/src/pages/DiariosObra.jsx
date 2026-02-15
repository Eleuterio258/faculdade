import { useState, useEffect } from 'react'
import axios from 'axios'

const DiariosObra = () => {
  const [diarios, setDiarios] = useState([])
  const [obras, setObras] = useState([])
  const [selectedObra, setSelectedObra] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchObras()
  }, [])

  useEffect(() => {
    if (selectedObra) {
      fetchDiarios()
    }
  }, [selectedObra])

  const fetchObras = async () => {
    try {
      const response = await axios.get('/api/obras')
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

  const fetchDiarios = async () => {
    try {
      const response = await axios.get(`/api/diarios-obra/obra/${selectedObra}`)
      setDiarios(response.data)
    } catch (error) {
      console.error('Erro ao carregar diários:', error)
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
        <i className="fa-solid fa-book me-2"></i>
        Diários de Obra
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

      <div className="row g-4">
        {diarios.length === 0 ? (
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <p className="text-muted text-center py-4 mb-0">Nenhum diário encontrado para esta obra.</p>
              </div>
            </div>
          </div>
        ) : (
          diarios.map((diario) => (
            <div key={diario.id} className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fa-solid fa-calendar-day me-2 text-primary"></i>
                    {diario.data}
                  </h5>
                </div>
                <div className="card-body">
                  {diario.descricao && (
                    <p className="card-text mb-3">{diario.descricao}</p>
                  )}
                  <div className="row g-3">
                    {diario.condicoesClimaticas && (
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <i className="fa-solid fa-cloud me-2 text-muted"></i>
                          <span className="text-muted small">
                            <strong>Condições Climáticas:</strong> {diario.condicoesClimaticas}
                          </span>
                        </div>
                      </div>
                    )}
                    {diario.numeroTrabalhadores && (
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <i className="fa-solid fa-users me-2 text-muted"></i>
                          <span className="text-muted small">
                            <strong>Trabalhadores:</strong> {diario.numeroTrabalhadores}
                          </span>
                        </div>
                      </div>
                    )}
                    {diario.horasTrabalhadas && (
                      <div className="col-md-6">
                        <div className="d-flex align-items-center">
                          <i className="fa-solid fa-clock me-2 text-muted"></i>
                          <span className="text-muted small">
                            <strong>Horas Trabalhadas:</strong> {diario.horasTrabalhadas}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  {diario.observacoes && (
                    <div className="mt-3 pt-3 border-top">
                      <p className="text-muted small mb-0">
                        <strong>Observações:</strong> {diario.observacoes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DiariosObra
