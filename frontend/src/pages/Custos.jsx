import { useState, useEffect } from 'react'
import api from '../services/api'

const Custos = () => {
  const [custos, setCustos] = useState([])
  const [obras, setObras] = useState([])
  const [selectedObra, setSelectedObra] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    descricao: '',
    tipo: 'MATERIAL',
    valor: '',
    data: '',
    observacoes: ''
  })

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
      const response = await api.get(`/api/custos/obra/${selectedObra}`)
      setCustos(response.data)
    } catch (error) {
      console.error('Erro ao carregar custos:', error)
    }
  }

  const resetForm = () => {
    setFormData({ descricao: '', tipo: 'MATERIAL', valor: '', data: '', observacoes: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/api/custos/obra/${selectedObra}`, formData)
      setShowModal(false)
      resetForm()
      fetchCustos()
    } catch (error) {
      console.error('Erro ao criar custo:', error)
      alert('Erro ao criar custo.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este custo?')) {
      try {
        await api.delete(`/api/custos/${id}`)
        fetchCustos()
      } catch (error) {
        console.error('Erro ao excluir custo:', error)
        alert('Erro ao excluir custo.')
      }
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
  const formatCurrency = (v) => new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v)

  const tipoBadge = {
    MATERIAL: 'bg-info',
    MAO_DE_OBRA: 'bg-success',
    EQUIPAMENTO: 'bg-warning',
    SERVICO: 'bg-primary',
    OUTROS: 'bg-secondary'
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <i className="fa-solid fa-dollar-sign me-2"></i>
          Custos
        </h1>
        {selectedObra && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <i className="fa-solid fa-plus me-2"></i>
            Novo Custo
          </button>
        )}
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <label className="form-label fw-medium">Selecionar Obra</label>
          <select
            value={selectedObra}
            onChange={(e) => setSelectedObra(e.target.value)}
            className="form-select"
          >
            {obras.map((obra) => (
              <option key={obra.id} value={obra.id}>{obra.nome}</option>
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
              <div className="h4 mb-0 fw-bold text-primary">{formatCurrency(totalCustos)}</div>
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
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {custos.map((custo) => (
                    <tr key={custo.id}>
                      <td className="fw-medium">{custo.descricao}</td>
                      <td>
                        <span className={`badge ${tipoBadge[custo.tipo] || 'bg-secondary'}`}>{custo.tipo}</span>
                      </td>
                      <td className="text-muted">{custo.data}</td>
                      <td className="text-end fw-bold">{formatCurrency(custo.valor)}</td>
                      <td className="text-end">
                        <button onClick={() => handleDelete(custo.id)} className="btn btn-sm btn-outline-danger">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fa-solid fa-plus me-2"></i>
                  Novo Custo
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Descrição *</label>
                    <input type="text" className="form-control" required value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tipo *</label>
                    <select className="form-select" value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}>
                      <option value="MATERIAL">Material</option>
                      <option value="MAO_DE_OBRA">Mão de Obra</option>
                      <option value="EQUIPAMENTO">Equipamento</option>
                      <option value="SERVICO">Serviço</option>
                      <option value="OUTROS">Outros</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Valor (MZN) *</label>
                    <input type="number" step="0.01" className="form-control" required value={formData.valor}
                      onChange={(e) => setFormData({ ...formData, valor: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Data *</label>
                    <input type="date" className="form-control" required value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Observações</label>
                    <textarea className="form-control" rows="2" value={formData.observacoes}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fa-solid fa-check me-2"></i>Criar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Custos
