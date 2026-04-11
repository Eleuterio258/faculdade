import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const fillTestUser = (type) => {
    const users = {
      engenheiro: { username: 'engenheiro', password: 'admin123' },
      empreiteiro: { username: 'empreiteiro1', password: 'senha123' },
      gestor: { username: 'gestor.materiais', password: 'senha123' },
      tecnico: { username: 'tecnico.obra', password: 'senha123' },
    }
    const user = users[type]
    if (user) {
      setUsername(user.username)
      setPassword(user.password)
      setError('')
    }
  }

  return (
    <div className="login-container">
      {/* Left Side - Brand/Image */}
      <div className="login-left">
        <div className="login-brand">
          
          <h1>Gestão de Obras</h1>
          <p>
            Sistema completo para gestão de obras de construção civil.
            Controle de cronogramas, materiais, custos e muito mais.
          </p>
          <div className="login-features">
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <i className="fa-solid fa-briefcase"></i>
              </div>
              <div className="login-feature-text">
                <strong>Gestão de Obras</strong>
                <span>Controle completo de todas as suas obras</span>
              </div>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <i className="fa-solid fa-calendar"></i>
              </div>
              <div className="login-feature-text">
                <strong>Cronogramas</strong>
                <span>Planeje e acompanhe o progresso</span>
              </div>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <i className="fa-solid fa-box"></i>
              </div>
              <div className="login-feature-text">
                <strong>Materiais</strong>
                <span>Gerencie estoque e movimentações</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="login-right">
        <div className="login-form-container">
          <div className="login-form-header">
            <h2>Bem-vindo de volta</h2>
            <p>Faça login para acessar sua conta</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fa-solid fa-circle-exclamation me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fa-solid fa-user"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Digite seu username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Senha
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fa-solid fa-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin me-2"></i>
                  Entrando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket me-2"></i>
                  Entrar
                </>
              )}
            </button>
          </form>
 
       

       

          <div className="mt-4">
            <h6 className="text-muted small mb-3 text-center">
              Usuários de teste rápidos
            </h6>
            <div className="d-flex flex-column gap-2">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm w-100"
                disabled={loading}
                onClick={() => fillTestUser('engenheiro')}
              >
                <i className="fa-solid fa-user-shield me-2"></i>
                Entrar como Engenheiro
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm w-100"
                disabled={loading}
                onClick={() => fillTestUser('empreiteiro')}
              >
                <i className="fa-solid fa-user-tie me-2"></i>
                Entrar como Empreiteiro
              </button>
              <button
                type="button"
                className="btn btn-outline-info btn-sm w-100"
                disabled={loading}
                onClick={() => fillTestUser('gestor')}
              >
                <i className="fa-solid fa-boxes-stacked me-2"></i>
                Entrar como Gestor de Materiais
              </button>
              <button
                type="button"
                className="btn btn-outline-success btn-sm w-100"
                disabled={loading}
                onClick={() => fillTestUser('tecnico')}
              >
                <i className="fa-solid fa-user-gear me-2"></i>
                Entrar como Técnico de Obra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
