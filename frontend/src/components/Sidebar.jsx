import { useAuth } from '../context/AuthContext'
import SidebarBase from './SidebarBase'

const Sidebar = ({ collapsed, logout }) => {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  // Grupos de menu por perfil de usuário
  const baseGroup = {
    label: 'Visão Geral',
    items: [
      {
        title: 'Dashboard',
        url: '/',
        icon: 'fa-solid fa-house',
      },
    ],
  }

  const gruposPorPerfil = {
    ENGENHEIRO: [
      baseGroup,
      {
        label: 'Operação',
        items: [
          { title: 'Obras', url: '/obras', icon: 'fa-solid fa-briefcase' },
          { title: 'Cronogramas', url: '/cronogramas', icon: 'fa-solid fa-calendar' },
          { title: 'Materiais', url: '/materiais', icon: 'fa-solid fa-box' },
          { title: 'Custos', url: '/custos', icon: 'fa-solid fa-dollar-sign' },
          { title: 'Cotações', url: '/obras/1/cotacoes', icon: 'fa-solid fa-file-invoice-dollar' },
          { title: 'Diários de Obra', url: '/diarios-obra', icon: 'fa-solid fa-book' },
          { title: 'Presenças', url: '/presencas', icon: 'fa-solid fa-clipboard-check' },
          { title: 'Equipas', url: '/equipas', icon: 'fa-solid fa-users' },
          { title: 'Ocorrências', url: '/ocorrencias', icon: 'fa-solid fa-triangle-exclamation' },
          { title: 'Fornecedores', url: '/fornecedores', icon: 'fa-solid fa-truck' },
          { title: 'Documentos', url: '/documentos', icon: 'fa-solid fa-folder-open' },
        ],
      },
      {
        label: 'Relatórios',
        items: [
          { title: 'Relatórios', url: '/relatorios', icon: 'fa-solid fa-chart-bar' },
          { title: 'Notificações', url: '/notificacoes', icon: 'fa-solid fa-bell' },
        ],
      },
    ],
    EMPREITEIRO: [
      baseGroup,
      {
        label: 'Operação',
        items: [
          { title: 'Obras', url: '/obras', icon: 'fa-solid fa-briefcase' },
          { title: 'Cronogramas', url: '/cronogramas', icon: 'fa-solid fa-calendar' },
          { title: 'Custos', url: '/custos', icon: 'fa-solid fa-dollar-sign' },
          { title: 'Cotações', url: '/obras/1/cotacoes', icon: 'fa-solid fa-file-invoice-dollar' },
          { title: 'Ocorrências', url: '/ocorrencias', icon: 'fa-solid fa-triangle-exclamation' },
          { title: 'Fornecedores', url: '/fornecedores', icon: 'fa-solid fa-truck' },
          { title: 'Documentos', url: '/documentos', icon: 'fa-solid fa-folder-open' },
          { title: 'Gestão Utilizadores', url: '/gestao-usuarios', icon: 'fa-solid fa-users-gear' },
        ],
      },
      {
        label: 'Relatórios',
        items: [
          { title: 'Relatórios', url: '/relatorios', icon: 'fa-solid fa-chart-bar' },
          { title: 'Notificações', url: '/notificacoes', icon: 'fa-solid fa-bell' },
        ],
      },
    ],
    GESTOR_MATERIAIS: [
      baseGroup,
      {
        label: 'Materiais',
        items: [
          { title: 'Materiais', url: '/materiais', icon: 'fa-solid fa-box' },
          { title: 'Custos', url: '/custos', icon: 'fa-solid fa-dollar-sign' },
          { title: 'Cotações', url: '/obras/1/cotacoes', icon: 'fa-solid fa-file-invoice-dollar' },
          { title: 'Fornecedores', url: '/fornecedores', icon: 'fa-solid fa-truck' },
          { title: 'Documentos', url: '/documentos', icon: 'fa-solid fa-folder-open' },
        ],
      },
      {
        label: 'Relatórios',
        items: [
          { title: 'Notificações', url: '/notificacoes', icon: 'fa-solid fa-bell' },
        ],
      },
    ],
    TECNICO_OBRA: [
      baseGroup,
      {
        label: 'Obra',
        items: [
          { title: 'Obras', url: '/obras', icon: 'fa-solid fa-briefcase' },
          { title: 'Cronogramas', url: '/cronogramas', icon: 'fa-solid fa-calendar' },
          { title: 'Diários de Obra', url: '/diarios-obra', icon: 'fa-solid fa-book' },
          { title: 'Presenças', url: '/presencas', icon: 'fa-solid fa-clipboard-check' },
          { title: 'Ocorrências', url: '/ocorrencias', icon: 'fa-solid fa-triangle-exclamation' },
          { title: 'Equipas', url: '/equipas', icon: 'fa-solid fa-users' },
        ],
      },
      {
        label: 'Relatórios',
        items: [
          { title: 'Notificações', url: '/notificacoes', icon: 'fa-solid fa-bell' },
        ],
      },
    ],
  }

  const groups = gruposPorPerfil[user.perfil] || [baseGroup]

  return (
    <SidebarBase
      collapsed={collapsed}
      user={user}
      logout={logout}
      groups={groups}
    />
  )
}

export default Sidebar
