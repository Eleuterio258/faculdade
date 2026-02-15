import { useState, useEffect } from 'react'
import api from '../services/api'

const Custos = () => {
  const [custos, setCustos] = useState([])
  const [obras, setObras] = useState([])
  const [selectedObra, setSelectedObra] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchObras()
  }, [])

  useEffect(() => {
    if (selectedObra) {
      fetchCustos()
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

  const fetchCustos = async () => {
    try {
      const response = await axios.get(`/api/custos/obra/${selectedObra}`)
      setCustos(response.data)
    } catch (error) {
      console.error('Erro ao carregar custos:', error)
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

  const totalCustos = custos.reduce((sum, custo) => sum + (parseFloat(custo.valor) || 0), 0)

  return (
    <div>
      <h1 className="h3 mb-4">
        <i className="fa-solid fa-dollar-sign me-2"></i>
        Custos
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

      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0">
              <div className="bg-primary text-white rounded p-3" style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-calculator fa-lg"></i>
              </div>
            </div>
            <div className="flex-grow-1 ms-3">
              <div className="text-muted small">Total de Custos</div>
              <div className="h4 mb-0 fw-bold text-primary">
                {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(totalCustos)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title mb-0">
            <i className="fa-solid fa-list me-2"></i>
            Lista de Custos
          </h2>
        </div>
        <div className="card-body">
          {custos.length === 0 ? (
            <p className="text-muted text-center py-4">Nenhum custo encontrado para esta obra.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Tipo</th>
                    <th>Data</th>
                    <th className="text-end">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {custos.map((custo) => (
                    <tr key={custo.id}>
                      <td className="fw-medium">{custo.descricao}</td>
                      <td>
                        <span className="badge bg-secondary">{custo.tipo}</span>
                      </td>
                      <td className="text-muted">{custo.data}</td>
                      <td className="text-end fw-bold">
                        {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(custo.valor)}
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

export default Custos
