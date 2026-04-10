import api from './api'

export const notificacaoService = {
  // Listar notificações com paginação
  listarNotificacoes: (page = 0, size = 20) => 
    api.get(`/api/notificacoes?page=${page}&size=${size}`),
  
  // Listar não lidas
  listarNaoLidas: () => 
    api.get('/api/notificacoes/nao-lidas'),
  
  // Contar não lidas
  contarNaoLidas: () => 
    api.get('/api/notificacoes/count-nao-lidas'),
  
  // Marcar como lida
  marcarComoLida: (id) => 
    api.put(`/api/notificacoes/${id}/marcar-lida`),
  
  // Marcar todas como lidas
  marcarTodasComoLidas: () => 
    api.put('/api/notificacoes/marcar-todas-lidas'),
  
  // Criar notificação
  criarNotificacao: (data) => 
    api.post('/api/notificacoes', data)
}

export const relatorioService = {
  // Relatório completo da obra
  relatorioObra: (obraId) => 
    api.get(`/api/relatorios/obra/${obraId}`),
  
  // Dados gerais
  dadosGerais: (obraId) => 
    api.get(`/api/relatorios/obra/${obraId}/dados-gerais`),
  
  // Progresso
  progresso: (obraId) => 
    api.get(`/api/relatorios/obra/${obraId}/progresso`),
  
  // Finanças
  financas: (obraId) => 
    api.get(`/api/relatorios/obra/${obraId}/financas`),
  
  // Materiais
  materiais: (obraId) => 
    api.get(`/api/relatorios/obra/${obraId}/materiais`),
  
  // Equipas
  equipas: (obraId) => 
    api.get(`/api/relatorios/obra/${obraId}/equipas`),
  
  // Ocorrências
  ocorrencias: (obraId) => 
    api.get(`/api/relatorios/obra/${obraId}/ocorrencias`),
  
  // Produtividade
  produtividade: (obraId, inicio, fim) => 
    api.get(`/api/relatorios/obra/${obraId}/produtividade?inicio=${inicio}&fim=${fim}`),
  
  // Comparativo de obras
  comparativoObras: (obraIds) => 
    api.get(`/api/relatorios/comparativo-obras?obraIds=${obraIds.join(',')}`)
}

export const exportService = {
  // Exportar relatório da obra para PDF
  exportObraPDF: (obraId) => 
    api.get(`/api/export/obra/${obraId}/pdf`, { responseType: 'blob' }),
  
  // Exportar custos para Excel
  exportCustosExcel: (obraId) => 
    api.get(`/api/export/obra/${obraId}/custos/excel`, { responseType: 'blob' }),
  
  // Exportar materiais para Excel
  exportMateriaisExcel: (obraId) => 
    api.get(`/api/export/obra/${obraId}/materiais/excel`, { responseType: 'blob' }),
  
  // Exportar presenças para Excel
  exportPresencasExcel: (inicio, fim) => 
    api.get(`/api/export/presencas/excel?inicio=${inicio}&fim=${fim}`, { responseType: 'blob' })
}

export const usuarioService = {
  // Listar utilizadores
  listarUsuarios: (perfil = null) => {
    const url = perfil ? `/api/usuarios?perfil=${perfil}` : '/api/usuarios'
    return api.get(url)
  },
  
  // Obter utilizador por ID
  obterUsuario: (id) => 
    api.get(`/api/usuarios/${id}`),
  
  // Obter utilizador atual
  obterUsuarioAtual: () => 
    api.get('/api/usuarios/me', {
      headers: { 'X-User-Id': JSON.parse(localStorage.getItem('user') || '{}').id }
    }),
  
  // Atualizar utilizador
  atualizarUsuario: (id, data) => 
    api.put(`/api/usuarios/${id}`, data),
  
  // Eliminar utilizador
  eliminarUsuario: (id) => 
    api.delete(`/api/usuarios/${id}`),
  
  // Toggle status
  toggleStatus: (id) => 
    api.put(`/api/usuarios/${id}/toggle-status`),
  
  // Alterar password
  alterarPassword: (id, currentPassword, newPassword) => 
    api.put(`/api/usuarios/${id}/change-password`, {
      currentPassword,
      newPassword
    }),
  
  // Criar utilizador
  criarUsuario: (data) => 
    api.post('/api/usuarios', data)
}

export const atividadeService = {
  // Atividades atrasadas
  atividadesAtrasadas: (cronogramaId) => 
    api.get(`/api/atividades/cronograma/${cronogramaId}/atrasadas`),
  
  // Progresso do cronograma
  progressoCronograma: (cronogramaId) => 
    api.get(`/api/atividades/cronograma/${cronogramaId}/progresso`),
  
  // Dados para Gantt chart
  ganttData: (cronogramaId) => 
    api.get(`/api/atividades/cronograma/${cronogramaId}/gantt`)
}

export const materialService = {
  // Materiais com stock crítico
  stockCritico: (obraId) => 
    api.get(`/api/materiais/obra/${obraId}/stock-critico`),
  
  // Resumo de materiais
  resumoMateriais: (obraId) => 
    api.get(`/api/materiais/obra/${obraId}/resumo`),
  
  // Movimentos de material
  movimentosMaterial: (materialId) => 
    api.get(`/api/materiais/${materialId}/movimentos`)
}

export const ocorrenciaService = {
  // Filtrar ocorrências
  filtrarOcorrencias: (obraId, { tipo, gravidade, status }) => {
    const params = new URLSearchParams()
    if (tipo) params.append('tipo', tipo)
    if (gravidade) params.append('gravidade', gravidade)
    if (status) params.append('status', status)
    return api.get(`/api/ocorrencias/obra/${obraId}/filtrar?${params}`)
  },
  
  // Estatísticas de ocorrências
  estatisticasOcorrencias: (obraId) => 
    api.get(`/api/ocorrencias/obra/${obraId}/estatisticas`)
}

export const fornecedorService = {
  // Obter fornecedor por ID
  obterFornecedor: (id) => 
    api.get(`/api/fornecedores/${id}`),
  
  // Atualizar fornecedor
  atualizarFornecedor: (id, data) => 
    api.put(`/api/fornecedores/${id}`, data)
}

export const obraService = {
  // Upload de imagem
  uploadImagem: (obraId, file) => {
    const formData = new FormData()
    formData.append('imagem', file)
    return api.post(`/api/obras/${obraId}/imagem`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  // Eliminar imagem
  eliminarImagem: (obraId) => 
    api.delete(`/api/obras/${obraId}/imagem`)
}

export const cotacaoService = {
  // Criar cotação
  criarCotacao: (obraId, data) => 
    api.post(`/api/cotacoes/obra/${obraId}`, data),
  
  // Listar cotações por obra
  listarCotacoes: (obraId) => 
    api.get(`/api/cotacoes/obra/${obraId}`),
  
  // Obter cotação por ID
  obterCotacao: (id) => 
    api.get(`/api/cotacoes/${id}`),
  
  // Atualizar cotação
  atualizarCotacao: (id, data) => 
    api.put(`/api/cotacoes/${id}`, data),
  
  // Atualizar status
  atualizarStatus: (id, status, decisao = null) => {
    const url = decisao 
      ? `/api/cotacoes/${id}/status?status=${status}&decisao=${decisao}`
      : `/api/cotacoes/${id}/status?status=${status}`
    return api.patch(url)
  },
  
  // Eliminar cotação
  eliminarCotacao: (id) => 
    api.delete(`/api/cotacoes/${id}`),
  
  // Comparar cotações
  compararCotacoes: (obraId, materiaisIds) => 
    api.get(`/api/cotacoes/comparar/obra/${obraId}?materiaisIds=${materiaisIds.join(',')}`),
  
  // Análise de mercado
  analiseMercado: (obraId, inicio, fim) => 
    api.get(`/api/cotacoes/analise/obra/${obraId}?inicio=${inicio}&fim=${fim}`),
  
  // Recomendações
  recomendacoes: (obraId) => 
    api.get(`/api/cotacoes/recomendacoes/${obraId}`),
  
  // Histórico por material
  historicoMaterial: (materialId) => 
    api.get(`/api/cotacoes/historico/material/${materialId}`)
}
