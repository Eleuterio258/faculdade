import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const ObraDetail = () => {
  const { id } = useParams()
  const [obra, setObra] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchObra()
  }, [id])

  const fetchObra = async () => {
    try {
      const response = await axios.get(`/api/obras/${id}`)
      setObra(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar obra:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">A carregar...</div>
  }

  if (!obra) {
    return <div className="text-center py-12">Obra não encontrada</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{obra.nome}</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Localização</dt>
            <dd className="mt-1 text-sm text-gray-900">{obra.localizacao}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900">{obra.status}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Data de Início</dt>
            <dd className="mt-1 text-sm text-gray-900">{obra.dataInicio}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Orçamento Previsto</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {obra.orcamentoPrevisto ? 
                new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(obra.orcamentoPrevisto) :
                'Não definido'
              }
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Custo Realizado</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(obra.custoRealizado || 0)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Percentual de Conclusão</dt>
            <dd className="mt-1 text-sm text-gray-900">{obra.percentualConclusao}%</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default ObraDetail

