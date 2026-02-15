import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout = ({ children }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <Sidebar collapsed={sidebarCollapsed} logout={handleLogout} />
      <div className="sidebar-inset">
        <Header onToggleSidebar={toggleSidebar} />
        <main>{children}</main>
      </div>
    </>
  )
}

export default Layout
