import { useEffect, useState } from 'react'
import { notificacaoService } from '../services/apiServices'

const Notificacoes = () => {
  const [notificacoes, setNotificacoes] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todas') // todas, nao-lidas

  useEffect(() => {
    fetchNotificacoes()
    fetchCount()
  }, [filter])

  const fetchNotificacoes = async () => {
    try {
      setLoading(true)
      let response
      if (filter === 'nao-lidas') {
        response = await notificacaoService.listarNaoLidas()
      } else {
        response = await notificacaoService.listarNotificacoes(0, 50)
      }
      setNotificacoes(response.data.content || response.data || [])
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCount = async () => {
    try {
      const response = await notificacaoService.contarNaoLidas()
      setCount(response.data.count)
    } catch (error) {
      console.error('Erro ao contar notificações:', error)
    }
  }

  const handleMarcarLida = async (id) => {
    try {
      await notificacaoService.marcarComoLida(id)
      fetchNotificacoes()
      fetchCount()
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  const handleMarcarTodasLidas = async () => {
    try {
      await notificacaoService.marcarTodasComoLidas()
      fetchNotificacoes()
      fetchCount()
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error)
    }
  }

  const getPrioridadeColor = (prioridade) => {
    const colors = {
      BAIXA: 'secondary',
      MEDIA: 'info',
      ALTA: 'warning',
      URGENTE: 'danger'
    }
    return colors[prioridade] || 'secondary'
  }

  const getTipoIcon = (tipo) => {
    const icons = {
      PRAZO: 'fa-calendar-check',
      DESVIO_CUSTO: 'fa-dollar-sign',
      STOCK_CRITICO: 'fa-box-open',
      ATRASO_ATIVIDADE: 'fa-clock',
      OCORRENCIA: 'fa-exclamation-triangle',
      GENERICA: 'fa-bell'
    }
    return icons[tipo] || 'fa-bell'
  }

  const formatData = (data) => {
    if (!data) return '-'
    const date = new Date(data)
    return date.toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <div className="text-center py-12"><i className="fa-solid fa-spinner fa-spin fa-2x text-muted"></i></div>
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">
          <i className="fa-solid fa-bell me-2"></i>
          Notificações
          {count > 0 && (
            <span className="badge bg-danger ms-2">{count}</span>
          )}
        </h1>
        <button 
          className="btn btn-outline-primary"
          onClick={handleMarcarTodasLidas}
          disabled={count === 0}
        >
          <i className="fa-solid fa-check-double me-2"></i>
          Marcar Todas como Lidas
        </button>
      </div>

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${filter === 'todas' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('todas')}
            >
              Todas
            </button>
            <button
              type="button"
              className={`btn ${filter === 'nao-lidas' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('nao-lidas')}
            >
              Não Lidas
              {count > 0 && <span className="badge bg-danger ms-2">{count}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Notificações */}
      <div className="card">
        <div className="card-body">
          {notificacoes.length === 0 ? (
            <div className="text-center py-5">
              <i className="fa-solid fa-bell-slash fa-3x text-muted mb-3"></i>
              <p className="text-muted">Nenhuma notificação encontrada</p>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {notificacoes.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`list-group-item ${!notif.lida ? 'bg-light' : ''}`}
                >
                  <div className="d-flex w-100 justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <span className={`badge bg-${getPrioridadeColor(notif.prioridade)} me-2`}>
                          {notif.prioridade}
                        </span>
                        <h6 className="mb-0 fw-bold">
                          <i className={`fa-solid ${getTipoIcon(notif.tipo)} me-2`}></i>
                          {notif.titulo}
                        </h6>
                      </div>
                      <p className="mb-2">{notif.mensagem}</p>
                      <small className="text-muted">
                        <i className="fa-solid fa-clock me-1"></i>
                        {formatData(notif.dataCriacao)}
                        {notif.obra && (
                          <span className="ms-3">
                            <i className="fa-solid fa-briefcase me-1"></i>
                            {notif.obra.nome}
                          </span>
                        )}
                      </small>
                    </div>
                    {!notif.lida && (
                      <button
                        className="btn btn-sm btn-outline-primary ms-3"
                        onClick={() => handleMarcarLida(notif.id)}
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>
                    )}
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

export default Notificacoes
