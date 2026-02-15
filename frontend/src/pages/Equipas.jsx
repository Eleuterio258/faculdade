import { useState, useEffect } from 'react'
import axios from 'axios'

const Equipas = () => {
  const [equipas, setEquipas] = useState([])
  const [obras, setObras] = useState([])
  const [selectedObra, setSelectedObra] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchObras()
  }, [])

  useEffect(() => {
    if (selectedObra) {
      fetchEquipas()
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

  const fetchEquipas = async () => {
    try {
      const response = await axios.get(`/api/equipas/obra/${selectedObra}`)
      setEquipas(response.data)
    } catch (error) {
      console.error('Erro ao carregar equipas:', error)
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
        <i className="fa-solid fa-users me-2"></i>
        Equipas
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
        {equipas.length === 0 ? (
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <p className="text-muted text-center py-4 mb-0">Nenhuma equipa encontrada para esta obra.</p>
              </div>
            </div>
          </div>
        ) : (
          equipas.map((equipa) => (
            <div key={equipa.id} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="fa-solid fa-users me-2 text-primary"></i>
                    {equipa.nome}
                  </h5>
                  {equipa.descricao && (
                    <p className="card-text text-muted">{equipa.descricao}</p>
                  )}
                  {equipa.lider && (
                    <div className="mt-3">
                      <span className="badge bg-info">
                        <i className="fa-solid fa-user-tie me-1"></i>
                        Líder: {equipa.lider.nome}
                      </span>
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

export default Equipas
