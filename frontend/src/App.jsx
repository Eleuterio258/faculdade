import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Obras from './pages/Obras'
import ObraDetail from './pages/ObraDetail'
import Cronogramas from './pages/Cronogramas'
import Materiais from './pages/Materiais'
import Custos from './pages/Custos'
import DiariosObra from './pages/DiariosObra'
import Equipas from './pages/Equipas'
import Presencas from './pages/Presencas'
import Ocorrencias from './pages/Ocorrencias'
import Fornecedores from './pages/Fornecedores'
import Documentos from './pages/Documentos'
import Relatorios from './pages/Relatorios'
import RelatoriosAvancados from './pages/RelatoriosAvancados'
import Notificacoes from './pages/Notificacoes'
import GestaoUsuarios from './pages/GestaoUsuarios'
import Cotacoes from './pages/Cotacoes'
import ComparacaoCotacoes from './pages/ComparacaoCotacoes'
import AnaliseMercado from './pages/AnaliseMercado'
import CotacaoDetail from './pages/CotacaoDetail'
import CotacaoForm from './pages/CotacaoForm'
import MeuPerfil from './pages/MeuPerfil'
import CotacoesGeral from './pages/CotacoesGeral'
import Layout from './components/Layout'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/obras"
            element={
              <PrivateRoute>
                <Layout>
                  <Obras />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/obras/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <ObraDetail />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/obras/:id/relatorio"
            element={
              <PrivateRoute>
                <Layout>
                  <RelatoriosAvancados />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/cronogramas"
            element={
              <PrivateRoute>
                <Layout>
                  <Cronogramas />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/materiais"
            element={
              <PrivateRoute>
                <Layout>
                  <Materiais />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/custos"
            element={
              <PrivateRoute>
                <Layout>
                  <Custos />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/diarios-obra"
            element={
              <PrivateRoute>
                <Layout>
                  <DiariosObra />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/equipas"
            element={
              <PrivateRoute>
                <Layout>
                  <Equipas />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/presencas"
            element={
              <PrivateRoute>
                <Layout>
                  <Presencas />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/ocorrencias"
            element={
              <PrivateRoute>
                <Layout>
                  <Ocorrencias />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/fornecedores"
            element={
              <PrivateRoute>
                <Layout>
                  <Fornecedores />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/documentos"
            element={
              <PrivateRoute>
                <Layout>
                  <Documentos />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/relatorios"
            element={
              <PrivateRoute>
                <Layout>
                  <Relatorios />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/notificacoes"
            element={
              <PrivateRoute>
                <Layout>
                  <Notificacoes />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/gestao-usuarios"
            element={
              <PrivateRoute>
                <Layout>
                  <GestaoUsuarios />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/meu-perfil"
            element={
              <PrivateRoute>
                <Layout>
                  <MeuPerfil />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/cotacoes"
            element={
              <PrivateRoute>
                <Layout>
                  <CotacoesGeral />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/obras/:id/cotacoes"
            element={
              <PrivateRoute>
                <Layout>
                  <Cotacoes />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/obras/:id/cotacoes/nova"
            element={
              <PrivateRoute>
                <Layout>
                  <CotacaoForm />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/obras/:id/cotacoes/:cotacaoId"
            element={
              <PrivateRoute>
                <Layout>
                  <CotacaoDetail />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/obras/:id/cotacoes/:cotacaoId/editar"
            element={
              <PrivateRoute>
                <Layout>
                  <CotacaoForm />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/obras/:id/cotacoes/comparar"
            element={
              <PrivateRoute>
                <Layout>
                  <ComparacaoCotacoes />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/obras/:id/cotacoes/analise"
            element={
              <PrivateRoute>
                <Layout>
                  <AnaliseMercado />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
