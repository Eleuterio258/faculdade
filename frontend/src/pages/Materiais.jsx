import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import { materialService, exportService } from '../services/apiServices'

const Materiais = () => {
  const [materiais, setMateriais] = useState([])
  const [obras, setObras] = useState([])
  const [selectedObra, setSelectedObra] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showMovModal, setShowMovModal] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [formData, setFormData] = useState({
    id: null, nome: '', descricao: '', unidade: 'unidades', quantidadeEstoque: 0,
    quantidadeMinima: 0, precoUnitario: ''
  })
  const [movForm, setMovForm] = useState({
    tipo: 'ENTRADA', quantidade: '', precoUnitario: '', observacoes: ''
  })
  const [stockCritico, setStockCritico] = useState([])
  const [exporting, setExporting] = useState(false)

  useEffect(() => { fetchObras() }, [])
  useEffect(() => { if (selectedObra) { fetchMateriais(); fetchStockCritico() } }, [selectedObra])

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

  const fetchMateriais = async () => {
    try {
      const response = await api.get(`/api/materiais/obra/${selectedObra}`)
      setMateriais(response.data)
    } catch (error) {
      console.error('Erro ao carregar materiais:', error)
    }
  }

  const fetchStockCritico = async () => {
    try {
      const response = await materialService.stockCritico(selectedObra)
      setStockCritico(response.data || [])
    } catch (error) {
      console.error('Erro ao carregar stock crítico:', error)
    }
  }

  const handleExportExcel = async () => {
    try {
      setExporting(true)
      const response = await exportService.exportMateriaisExcel(selectedObra)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `materiais_obra_${selectedObra}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Erro ao exportar Excel:', error)
      alert('Erro ao exportar Excel')
    } finally {
      setExporting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formData.id) {
        // Update
        await api.put(`/api/materiais/${formData.id}`, formData)
      } else {
        // Create
        await api.post(`/api/materiais/obra/${selectedObra}`, formData)
      }
      setShowModal(false)
      setFormData({ id: null, nome: '', descricao: '', unidade: 'unidades', quantidadeEstoque: 0, quantidadeMinima: 0, precoUnitario: '' })
      fetchMateriais()
    } catch (error) {
      console.error('Erro ao salvar material:', error)
      alert('Erro ao salvar material.')
    }
  }

  const handleEdit = (material) => {
    setFormData({
      id: material.id,
      nome: material.nome || '',
      descricao: material.descricao || '',
      unidade: material.unidade || 'unidades',
      quantidadeEstoque: material.quantidadeEstoque || 0,
      quantidadeMinima: material.quantidadeMinima || 0,
      precoUnitario: material.precoUnitario || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Excluir este material?')) {
      try {
        await api.delete(`/api/materiais/${id}`)
        fetchMateriais()
      } catch (error) {
        console.error('Erro ao excluir material:', error)
        alert('Erro ao excluir material.')
      }
    }
  }

  const openMovModal = (material) => {
    setSelectedMaterial(material)
    setMovForm({ tipo: 'ENTRADA', quantidade: '', precoUnitario: '', observacoes: '' })
    setShowMovModal(true)
  }

  const handleMovSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/api/materiais/${selectedMaterial.id}/movimentos`, movForm)
      setShowMovModal(false)
      fetchMateriais()
    } catch (error) {
      console.error('Erro ao registar movimento:', error)
      alert('Erro ao registar movimento.')
    }
  }

  const formatCurrency = (v) => {
    if (v == null) return '-'
    return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v)
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
          <i className="fa-solid fa-box me-2"></i>
          Materiais
        </h1>
        {selectedObra && (
          <div>
            <button onClick={handleExportExcel} className="btn btn-success me-2" disabled={exporting}>
              <i className="fa-solid fa-file-excel me-2"></i>
              {exporting ? 'A exportar...' : 'Exportar Excel'}
            </button>
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              <i className="fa-solid fa-plus me-2"></i>Novo Material
            </button>
          </div>
        )}
      </div>

      {/* Painel de Stock Crítico */}
      {stockCritico.length > 0 && (
        <div className="card mb-4 border-danger">
          <div className="card-header bg-danger text-white">
            <h5 className="card-title mb-0">
              <i className="fa-solid fa-exclamation-triangle me-2"></i>
              Alerta de Stock Crítico - {stockCritico.length} material(is)
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              {stockCritico.map(material => (
                <div key={material.id} className="col-md-4 mb-3">
                  <div className="card border-warning">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{material.nome}</h6>
                          <p className="mb-1 small text-muted">
                            Stock: <strong className="text-danger">{material.quantidadeEstoque}</strong> {material.unidade}
                          </p>
                          <p className="mb-0 small">
                            Mínimo: {material.quantidadeMinima} {material.unidade}
                          </p>
                        </div>
                        <i className="fa-solid fa-box-open fa-2x text-warning"></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <label className="form-label fw-medium">Selecionar Obra</label>
          <select value={selectedObra} onChange={(e) => setSelectedObra(e.target.value)} className="form-select">
            {obras.map((obra) => (
              <option key={obra.id} value={obra.id}>{obra.nome}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title mb-0">
            <i className="fa-solid fa-list me-2"></i>Materiais da Obra
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
                    <th>Stock</th>
                    <th>Mínimo</th>
                    <th className="text-end">Preço Unit.</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {materiais.map((m) => {
                    const lowStock = m.quantidadeMinima > 0 && parseFloat(m.quantidadeEstoque) <= parseFloat(m.quantidadeMinima)
                    return (
                      <tr key={m.id} className={lowStock ? 'table-danger' : ''}>
                        <td>
                          <div className="fw-medium">{m.nome}</div>
                          {m.descricao && <small className="text-muted">{m.descricao}</small>}
                        </td>
                        <td>
                          <span className={`badge ${lowStock ? 'bg-danger' : 'bg-info'}`}>
                            {m.quantidadeEstoque} {m.unidade}
                          </span>
                          {lowStock && <small className="text-danger ms-2">Stock baixo!</small>}
                        </td>
                        <td className="text-muted">{m.quantidadeMinima} {m.unidade}</td>
                        <td className="text-end">{formatCurrency(m.precoUnitario)}</td>
                        <td className="text-end">
                          <button onClick={() => openMovModal(m)} className="btn btn-sm btn-outline-success me-1" title="Movimento de stock">
                            <i className="fa-solid fa-exchange-alt"></i>
                          </button>
                          <button onClick={() => handleEdit(m)} className="btn btn-sm btn-outline-primary me-1" title="Editar">
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button onClick={() => handleDelete(m.id)} className="btn btn-sm btn-outline-danger" title="Excluir">
                            <i className="fa-solid fa-trash"></i>
                          </button>
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

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="fa-solid fa-plus me-2"></i>{formData.id ? 'Editar Material' : 'Novo Material'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nome *</label>
                    <input type="text" className="form-control" required value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Unidade *</label>
                    <select className="form-select" value={formData.unidade}
                      onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}>
                      <option value="unidades">Unidades</option>
                      <option value="kg">Kg</option>
                      <option value="m³">m³</option>
                      <option value="m²">m²</option>
                      <option value="m">Metros</option>
                      <option value="litros">Litros</option>
                      <option value="sacos">Sacos</option>
                    </select>
                  </div>
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label">Qtd. Inicial</label>
                      <input type="number" step="0.01" className="form-control" value={formData.quantidadeEstoque}
                        onChange={(e) => setFormData({ ...formData, quantidadeEstoque: e.target.value })} />
                    </div>
                    <div className="col-6">
                      <label className="form-label">Qtd. Mínima</label>
                      <input type="number" step="0.01" className="form-control" value={formData.quantidadeMinima}
                        onChange={(e) => setFormData({ ...formData, quantidadeMinima: e.target.value })} />
                    </div>
                  </div>
                  <div className="mb-3 mt-3">
                    <label className="form-label">Preço Unitário (MZN)</label>
                    <input type="number" step="0.01" className="form-control" value={formData.precoUnitario}
                      onChange={(e) => setFormData({ ...formData, precoUnitario: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descrição</label>
                    <textarea className="form-control" rows="2" value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary"><i className="fa-solid fa-check me-2"></i>Criar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showMovModal && selectedMaterial && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowMovModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fa-solid fa-exchange-alt me-2"></i>
                  Movimento - {selectedMaterial.nome}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowMovModal(false)}></button>
              </div>
              <form onSubmit={handleMovSubmit}>
                <div className="modal-body">
                  <div className="alert alert-info mb-3">
                    Stock atual: <strong>{selectedMaterial.quantidadeEstoque} {selectedMaterial.unidade}</strong>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tipo de Movimento *</label>
                    <select className="form-select" value={movForm.tipo}
                      onChange={(e) => setMovForm({ ...movForm, tipo: e.target.value })}>
                      <option value="ENTRADA">Entrada</option>
                      <option value="SAIDA">Saída</option>
                      <option value="AJUSTE">Ajuste</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quantidade *</label>
                    <input type="number" step="0.01" className="form-control" required value={movForm.quantidade}
                      onChange={(e) => setMovForm({ ...movForm, quantidade: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Preço Unitário (MZN)</label>
                    <input type="number" step="0.01" className="form-control" value={movForm.precoUnitario}
                      onChange={(e) => setMovForm({ ...movForm, precoUnitario: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Observações</label>
                    <textarea className="form-control" rows="2" value={movForm.observacoes}
                      onChange={(e) => setMovForm({ ...movForm, observacoes: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowMovModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary"><i className="fa-solid fa-check me-2"></i>Registar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Materiais
