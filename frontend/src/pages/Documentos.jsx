import { useState, useEffect } from 'react'
import api from '../services/api'

const Documentos = () => {
  const [documentos, setDocumentos] = useState([])
  const [obras, setObras] = useState([])
  const [selectedObra, setSelectedObra] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [file, setFile] = useState(null)
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => { fetchObras() }, [])
  useEffect(() => { if (selectedObra) fetchDocumentos() }, [selectedObra])

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

  const fetchDocumentos = async () => {
    try {
      const response = await api.get(`/api/documentos/obra/${selectedObra}`)
      setDocumentos(response.data)
    } catch (error) {
      console.error('Erro ao carregar documentos:', error)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) { alert('Selecione um ficheiro.'); return }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (nome) formData.append('nome', nome)
      if (descricao) formData.append('descricao', descricao)
      await api.post(`/api/documentos/obra/${selectedObra}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setShowModal(false)
      setFile(null)
      setNome('')
      setDescricao('')
      fetchDocumentos()
    } catch (error) {
      console.error('Erro ao carregar documento:', error)
      alert('Erro ao carregar documento.')
    }
    setUploading(false)
  }

  const handleDownload = async (doc) => {
    try {
      const response = await api.get(`/api/documentos/download/${doc.id}`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', doc.nome || 'documento')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao descarregar documento:', error)
      alert('Erro ao descarregar documento.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Excluir este documento?')) {
      try {
        await api.delete(`/api/documentos/${id}`)
        fetchDocumentos()
      } catch (error) {
        console.error('Erro ao excluir documento:', error)
      }
    }
  }

  const formatSize = (bytes) => {
    if (!bytes) return '-'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const fileIcon = (tipo) => {
    const icons = { pdf: 'fa-file-pdf text-danger', doc: 'fa-file-word text-primary', docx: 'fa-file-word text-primary', xls: 'fa-file-excel text-success', xlsx: 'fa-file-excel text-success', jpg: 'fa-file-image text-info', jpeg: 'fa-file-image text-info', png: 'fa-file-image text-info' }
    return icons[tipo?.toLowerCase()] || 'fa-file text-secondary'
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
          <i className="fa-solid fa-folder-open me-2"></i>
          Documentos
        </h1>
        {selectedObra && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <i className="fa-solid fa-upload me-2"></i>Carregar Documento
          </button>
        )}
      </div>

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
            <i className="fa-solid fa-list me-2"></i>Documentos da Obra
          </h2>
        </div>
        <div className="card-body">
          {documentos.length === 0 ? (
            <p className="text-muted text-center py-4">Nenhum documento carregado.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Tamanho</th>
                    <th>Data</th>
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {documentos.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <i className={`fa-solid ${fileIcon(doc.tipoArquivo)} me-2`}></i>
                        <span className="fw-medium">{doc.nome}</span>
                        {doc.descricao && <div className="small text-muted">{doc.descricao}</div>}
                      </td>
                      <td><span className="badge bg-secondary">{doc.tipoArquivo?.toUpperCase()}</span></td>
                      <td className="text-muted">{formatSize(doc.tamanhoArquivo)}</td>
                      <td className="text-muted small">{doc.dataCriacao ? new Date(doc.dataCriacao).toLocaleDateString('pt-MZ') : '-'}</td>
                      <td className="text-end">
                        <button onClick={() => handleDownload(doc)} className="btn btn-sm btn-outline-primary me-1" title="Descarregar">
                          <i className="fa-solid fa-download"></i>
                        </button>
                        <button onClick={() => handleDelete(doc.id)} className="btn btn-sm btn-outline-danger" title="Excluir">
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
                <h5 className="modal-title"><i className="fa-solid fa-upload me-2"></i>Carregar Documento</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleUpload}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Ficheiro *</label>
                    <input type="file" className="form-control" required
                      onChange={(e) => setFile(e.target.files[0])} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input type="text" className="form-control" value={nome} placeholder="Deixe vazio para usar o nome do ficheiro"
                      onChange={(e) => setNome(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descrição</label>
                    <textarea className="form-control" rows="2" value={descricao}
                      onChange={(e) => setDescricao(e.target.value)} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {uploading ? <><i className="fa-solid fa-spinner fa-spin me-2"></i>A carregar...</> : <><i className="fa-solid fa-upload me-2"></i>Carregar</>}
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

export default Documentos
