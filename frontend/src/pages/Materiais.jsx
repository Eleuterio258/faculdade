import { useState, useEffect } from 'react'
import api from '../services/api'

const Materiais = () => {
  const [materiais, setMateriais] = useState([])
  const [obras, setObras] = useState([])
  const [selectedObra, setSelectedObra] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchObras()
  }, [])

  useEffect(() => {
    if (selectedObra) {
      fetchMateriais()
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

  const fetchMateriais = async () => {
    try {
      const response = await api.get(`/api/materiais/obra/${selectedObra}`)
      setMateriais(response.data)
    } catch (error) {
      console.error('Erro ao carregar materiais:', error)
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
        <i className="fa-solid fa-box me-2"></i>
        Materiais
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
            Materiais da Obra
          </h2>
        </div>
        <div className="card-body">
          {materiais.length === 0 ? (
            <p className="text-muted text-center py-4">Nenhum material encontrado para esta obra.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Quantidade</th>
                    <th className="text-end">Preço Unitário</th>
                  </tr>
                </thead>
                <tbody>
                  {materiais.map((material) => (
                    <tr key={material.id}>
                      <td className="fw-medium">{material.nome}</td>
                      <td className="text-muted">{material.descricao || '-'}</td>
                      <td>
                        <span className="badge bg-info">
                          {material.quantidadeEstoque} {material.unidade}
                        </span>
                      </td>
                      <td className="text-end">
                        {material.precoUnitario ? 
                          new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(material.precoUnitario) :
                          <span className="text-muted">-</span>
                        }
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

export default Materiais
