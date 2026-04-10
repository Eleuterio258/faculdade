import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { cotacaoService } from '../services/apiServices'
import api from '../services/api'

const CotacaoForm = () => {
  const { id: obraId, cotacaoId } = useParams()
  const navigate = useNavigate()
  const isEditing = !!cotacaoId
  
  const [loading, setLoading] = useState(false)
  const [fornecedores, setFornecedores] = useState([])
  const [formData, setFormData] = useState({
    fornecedorId: '',
    dataCotacao: new Date().toISOString().split('T')[0],
    dataValidade: '',
    condicoesPagamento: '',
    prazoEntrega: '',
    observacoes: ''
  })
  const [itens, setItens] = useState([])

  useEffect(() => {
    fetchFornecedores()
    if (isEditing) {
      fetchCotacao()
    }
  }, [cotacaoId])

  const fetchFornecedores = async () => {
    try {
      const response = await api.get(`/api/fornecedores/obra/${obraId}`)
      setFornecedores(response.data)
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error)
    }
  }

  const fetchCotacao = async () => {
    try {
      setLoading(true)
      const response = await cotacaoService.obterCotacao(cotacaoId)
      const cotacao = response.data
      
      setFormData({
        fornecedorId: cotacao.fornecedor?.id || '',
        dataCotacao: cotacao.dataCotacao || new Date().toISOString().split('T')[0],
        dataValidade: cotacao.dataValidade || '',
        condicoesPagamento: cotacao.condicoesPagamento || '',
        prazoEntrega: cotacao.prazoEntrega || '',
        observacoes: cotacao.observacoes || ''
      })
      
      setItens(cotacao.itens || [])
    } catch (error) {
      console.error('Erro ao carregar cotação:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddItem = () => {
    setItens([...itens, {
      descricaoMaterial: '',
      quantidade: 0,
      unidade: 'un',
      precoUnitario: 0,
      descontoPercentual: 0,
      especificacoes: '',
      marca: '',
      observacoes: ''
    }])
  }

  const handleRemoveItem = (index) => {
    setItens(itens.filter((_, i) => i !== index))
  }

  const handleItemChange = (index, field, value) => {
    const novosItens = [...itens]
    novosItens[index] = { ...novosItens[index], [field]: value }
    setItens(novosItens)
  }

  const calcularTotalItem = (item) => {
    const subtotal = (item.quantidade || 0) * (item.precoUnitario || 0)
    const desconto = subtotal * ((item.descontoPercentual || 0) / 100)
    return (subtotal - desconto).toFixed(2)
  }

  const calcularTotalGeral = () => {
    return itens.reduce((sum, item) => {
      return sum + parseFloat(calcularTotalItem(item))
    }, 0).toFixed(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.fornecedorId) {
      alert('Selecione um fornecedor')
      return
    }
    
    if (itens.length === 0) {
      alert('Adicione pelo menos um item')
      return
    }

    try {
      setLoading(true)
      
      const data = {
        ...formData,
        itens: itens.map(item => ({
          ...item,
          quantidade: parseFloat(item.quantidade),
          precoUnitario: parseFloat(item.precoUnitario),
          descontoPercentual: parseFloat(item.descontoPercentual || 0)
        }))
      }

      if (isEditing) {
        await cotacaoService.atualizarCotacao(cotacaoId, data)
        alert('Cotação atualizada com sucesso!')
      } else {
        await cotacaoService.criarCotacao(obraId, data)
        alert('Cotação criada com sucesso!')
      }
      
      navigate(`/obras/${obraId}/cotacoes`)
    } catch (error) {
      console.error('Erro ao salvar cotação:', error)
      alert('Erro ao salvar cotação. Verifique os dados e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditing) {
    return <div className="text-center py-12"><i className="fa-solid fa-spinner fa-spin fa-2x text-muted"></i></div>
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">
            <i className="fa-solid fa-file-invoice-dollar me-2"></i>
            {isEditing ? 'Editar Cotação' : 'Nova Cotação'}
          </h1>
          <p className="text-muted mb-0">
            {isEditing ? 'Atualize os dados da cotação' : 'Preencha os dados para criar uma nova cotação'}
          </p>
        </div>
        <Link 
          to={`/obras/${obraId}/cotacoes`}
          className="btn btn-outline-secondary"
        >
          <i className="fa-solid fa-arrow-left me-2"></i>
          Voltar
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Dados Gerais */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title mb-0">
              <i className="fa-solid fa-info-circle me-2"></i>
              Dados Gerais
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Fornecedor *</label>
                <select
                  className="form-select"
                  name="fornecedorId"
                  value={formData.fornecedorId}
                  onChange={handleInputChange}
                  required
                  disabled={isEditing}
                >
                  <option value="">Selecione um fornecedor</option>
                  {fornecedores.map(f => (
                    <option key={f.id} value={f.id}>{f.nome}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Data da Cotação *</label>
                <input
                  type="date"
                  className="form-control"
                  name="dataCotacao"
                  value={formData.dataCotacao}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Data de Validade</label>
                <input
                  type="date"
                  className="form-control"
                  name="dataValidade"
                  value={formData.dataValidade}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Condições de Pagamento</label>
                <input
                  type="text"
                  className="form-control"
                  name="condicoesPagamento"
                  value={formData.condicoesPagamento}
                  onChange={handleInputChange}
                  placeholder="Ex: 30 dias, 50% adiantamento"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Prazo de Entrega</label>
                <input
                  type="text"
                  className="form-control"
                  name="prazoEntrega"
                  value={formData.prazoEntrega}
                  onChange={handleInputChange}
                  placeholder="Ex: 5 dias úteis"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Observações</label>
              <textarea
                className="form-control"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Observações adicionais..."
              />
            </div>
          </div>
        </div>

        {/* Itens */}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">
              <i className="fa-solid fa-list me-2"></i>
              Itens da Cotação
            </h5>
            <button 
              type="button"
              className="btn btn-sm btn-primary"
              onClick={handleAddItem}
            >
              <i className="fa-solid fa-plus me-2"></i>
              Adicionar Item
            </button>
          </div>
          <div className="card-body">
            {itens.length === 0 ? (
              <p className="text-muted text-center py-4">
                Nenhum item adicionado. Clique em "Adicionar Item" para começar.
              </p>
            ) : (
              itens.map((item, index) => (
                <div key={index} className="card mb-3 border-secondary">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <strong>Item {index + 1}</strong>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Descrição do Material *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={item.descricaoMaterial}
                          onChange={(e) => handleItemChange(index, 'descricaoMaterial', e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Quantidade *</label>
                        <input
                          type="number"
                          className="form-control"
                          value={item.quantidade}
                          onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div className="col-md-3 mb-3">
                        <label className="form-label">Unidade *</label>
                        <select
                          className="form-select"
                          value={item.unidade}
                          onChange={(e) => handleItemChange(index, 'unidade', e.target.value)}
                          required
                        >
                          <option value="un">Unidade</option>
                          <option value="kg">Quilograma (kg)</option>
                          <option value="m">Metro (m)</option>
                          <option value="m2">Metro quadrado (m²)</option>
                          <option value="m3">Metro cúbico (m³)</option>
                          <option value="lt">Litro (L)</option>
                          <option value="saco">Saco</option>
                          <option value="caixa">Caixa</option>
                        </select>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Preço Unitário *</label>
                        <input
                          type="number"
                          className="form-control"
                          value={item.precoUnitario}
                          onChange={(e) => handleItemChange(index, 'precoUnitario', e.target.value)}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Desconto (%)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={item.descontoPercentual || 0}
                          onChange={(e) => handleItemChange(index, 'descontoPercentual', e.target.value)}
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Total</label>
                        <div className="form-control-plaintext fw-bold">
                          {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(calcularTotalItem(item))}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Especificações</label>
                        <input
                          type="text"
                          className="form-control"
                          value={item.especificacoes || ''}
                          onChange={(e) => handleItemChange(index, 'especificacoes', e.target.value)}
                          placeholder="Ex: Tipo II, 10mm"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Marca</label>
                        <input
                          type="text"
                          className="form-control"
                          value={item.marca || ''}
                          onChange={(e) => handleItemChange(index, 'marca', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {itens.length > 0 && (
              <div className="mt-3 p-3 bg-light rounded">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Total Geral:</h5>
                  <h4 className="mb-0 text-success">
                    {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(calcularTotalGeral())}
                  </h4>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botões */}
        <div className="d-flex justify-content-end gap-2">
          <Link 
            to={`/obras/${obraId}/cotacoes`}
            className="btn btn-secondary"
          >
            Cancelar
          </Link>
          <button 
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin me-2"></i>
                A guardar...
              </>
            ) : (
              <>
                <i className="fa-solid fa-save me-2"></i>
                {isEditing ? 'Atualizar' : 'Criar Cotação'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CotacaoForm
