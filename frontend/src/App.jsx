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
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

