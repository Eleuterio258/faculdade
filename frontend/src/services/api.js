import axios from 'axios'

// URL base da API:
// - Em desenvolvimento, pode ficar vazia e usar o proxy do Vite (`/api` -> http://localhost:2025)
// - Em produção, defina VITE_API_URL (por ex.: https://meu-backend.com)
const baseURL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar o token automaticamente em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Só limpar token e redirecionar se for erro de autenticação real (não validação)
      const url = error.config?.url || ''
      const isAuthEndpoint = url.includes('/api/auth/')
      if (!isAuthEndpoint) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
