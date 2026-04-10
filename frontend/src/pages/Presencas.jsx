import { useState, useEffect } from 'react'
import api from '../services/api'

const Presencas = () => {
  const [equipas, setEquipas] = useState([])
  const [obras, setObras] = useState([])
  const [selectedObra, setSelectedObra] = useState('')
  const [selectedEquipa, setSelectedEquipa] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [presencas, setPresencas] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    trabalhadorId: '', data: selectedDate, horasTrabalhadas: '',
    presente: true, observacoes: ''
  })
  const [usuarios, setUsuarios] = useState([])

  useEffect(() => { fetchObras() }, [])
  useEffect(() => { if (selectedObra) fetchEquipas() }, [selectedObra])
  useEffect(() => { if (selectedEquipa && selectedDate) fetchPresencas() }, [selectedEquipa, selectedDate])

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

  const fetchEquipas = async () => {
    try {
      const response = await api.get(`/api/equipas/obra/${selectedObra}`)
      setEquipas(response.data)
      setSelectedEquipa('')
      setPresencas([])
    } catch (error) {
      console.error('Erro ao carregar equipas:', error)
    }
  }

  const fetchPresencas = async () => {
    if (!selectedEquipa) return
    try {
      const response = await api.get(`/api/presencas/equipa/${selectedEquipa}/data?data=${selectedDate}`)
      setPresencas(response.data)
    } catch (error) {
      console.error('Erro ao carregar presenças:', error)
    }
  }

  const fetchUsuarios = async () => {
    try {
      // Fetch only TECNICO_OBRA users for attendance
      const response = await api.get('/api/usuarios?perfil=TECNICO_OBRA')
      setUsuarios(response.data)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedEquipa || !formData.trabalhadorId) {
      alert('Selecione uma equipa e um trabalhador.')
      return
    }
    try {
      const payload = {
        data: formData.data,
        horasTrabalhadas: formData.horasTrabalhadas ? parseFloat(formData.horasTrabalhadas) : null,
        presente: formData.presente,
        observacoes: formData.observacoes
      }
      await api.post(`/api/presencas/equipa/${selectedEquipa}/trabalhador/${formData.trabalhadorId}`, payload)
      setShowModal(false)
      setFormData({ trabalhadorId: '', data: selectedDate, horasTrabalhadas: '', presente: true, observacoes: '' })
      fetchPresencas()
    } catch (error) {
      console.error('Erro ao registar presença:', error)
      alert('Erro ao registar presença.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Excluir esta presença?')) {
      try {
        await api.delete(`/api/presencas/${id}`)
        fetchPresencas()
      } catch (error) {
        console.error('Erro ao excluir presença:', error)
        alert('Erro ao excluir presença.')
      }
    }
  }

  const handleTogglePresenca = async (presenca) => {
    try {
      await api.put(`/api/presencas/${presenca.id}`, {
        ...presenca,
        presente: !presenca.presente
      })
      fetchPresencas()
    } catch (error) {
      console.error('Erro ao atualizar presença:', error)
      alert('Erro ao atualizar presença.')
    }
  }

  const totalPresentes = presencas.filter(p => p.presente).length
  const totalAusentes = presencas.filter(p => !p.presente).length
  const totalHoras = presencas.reduce((sum, p) => sum + (p.horasTrabalhadas || 0), 0)

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
          <i className="fa-solid fa-clipboard-check me-2"></i>
          Controlo de Presenças
        </h1>
        {selectedEquipa && (
          <button onClick={() => { fetchUsuarios(); setShowModal(true) }} className="btn btn-primary">
            <i className="fa-solid fa-plus me-2"></i>Registar Presença
          </button>
        )}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <label className="form-label fw-medium">Selecionar Obra</label>
              <select value={selectedObra} onChange={(e) => setSelectedObra(e.target.value)} className="form-select">
                {obras.map((obra) => (
                  <option key={obra.id} value={obra.id}>{obra.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <label className="form-label fw-medium">Selecionar Equipa</label>
              <select value={selectedEquipa} onChange={(e) => setSelectedEquipa(e.target.value)} className="form-select">
                <option value="">Todas as equipas</option>
                {equipas.map((equipa) => (
                  <option key={equipa.id} value={equipa.id}>{equipa.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <label className="form-label fw-medium">Data</label>
              <input type="date" className="form-control" value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {selectedEquipa && (
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card border-start border-success border-4">
              <div className="card-body">
                <div className="text-muted small">Presentes</div>
                <div className="h4 mb-0 fw-bold text-success">{totalPresentes}</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-start border-danger border-4">
              <div className="card-body">
                <div className="text-muted small">Ausentes</div>
                <div className="h4 mb-0 fw-bold text-danger">{totalAusentes}</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-start border-info border-4">
              <div className="card-body">
                <div className="text-muted small">Total Horas</div>
                <div className="h4 mb-0 fw-bold text-info">{totalHoras.toFixed(1)}h</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="fa-solid fa-list me-2"></i>
            Registos de Presenças - {new Date(selectedDate).toLocaleDateString('pt-MZ')}
          </h5>
        </div>
        <div className="card-body">
          {presencas.length === 0 ? (
            <p className="text-muted text-center py-4">Nenhuma presença registada para esta data.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Trabalhador</th>
                    <th>Status</th>
                    <th>Horas</th>
                    <th>Observações</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {presencas.map((p) => (
                    <tr key={p.id} className={!p.presente ? 'table-danger' : ''}>
                      <td className="fw-medium">{p.trabalhador?.nome || p.trabalhador?.username || '-'}</td>
                      <td>
                        <button onClick={() => handleTogglePresenca(p)}
                          className={`badge ${p.presente ? 'bg-success' : 'bg-danger'} border-0`}
                          style={{ cursor: 'pointer' }}>
                          {p.presente ? 'Presente' : 'Ausente'}
                        </button>
                      </td>
                      <td>{p.horasTrabalhadas ? `${p.horasTrabalhadas}h` : '-'}</td>
                      <td className="text-muted small">{p.observacoes || '-'}</td>
                      <td className="text-end">
                        <button onClick={() => handleDelete(p.id)} className="btn btn-sm btn-outline-danger">
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
                <h5 className="modal-title"><i className="fa-solid fa-plus me-2"></i>Registar Presença</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Trabalhador *</label>
                    <select className="form-select" value={formData.trabalhadorId} required
                      onChange={(e) => setFormData({ ...formData, trabalhadorId: e.target.value })}>
                      <option value="">Selecionar...</option>
                      {usuarios.map((u) => (
                        <option key={u.id} value={u.id}>{u.nome || u.username} ({u.perfil})</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Data *</label>
                    <input type="date" className="form-control" required value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Horas Trabalhadas</label>
                    <input type="number" step="0.5" min="0" className="form-control" value={formData.horasTrabalhadas}
                      onChange={(e) => setFormData({ ...formData, horasTrabalhadas: e.target.value })} />
                  </div>
                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="presente"
                      checked={formData.presente}
                      onChange={(e) => setFormData({ ...formData, presente: e.target.checked })} />
                    <label className="form-check-label" htmlFor="presente">Presente</label>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Observações</label>
                    <textarea className="form-control" rows="2" value={formData.observacoes}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
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

export default Presencas
