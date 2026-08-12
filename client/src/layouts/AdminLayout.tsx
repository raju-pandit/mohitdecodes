import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, FileText, GraduationCap, Download,
  FolderKanban, Map, Star, Users, MessageSquare, Mail, Menu, X,
  ChevronRight, LogOut, ExternalLink, Code2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getInitials, hasCustomAvatar } from '../utils/formatters'
import BrandLogo from '../components/Logo'


const adminNavItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Courses', path: '/admin/courses', icon: BookOpen },
  { label: 'Blogs', path: '/admin/blogs', icon: FileText },
  { label: 'Tutorials', path: '/admin/tutorials', icon: GraduationCap },
  { label: 'Resources', path: '/admin/resources', icon: Download },
  { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
  { label: 'Roadmaps', path: '/admin/roadmaps', icon: Map },
  { label: 'Testimonials', path: '/admin/testimonials', icon: Star },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Messages', path: '/admin/messages', icon: MessageSquare },
  { label: 'Newsletter', path: '/admin/newsletter', icon: Mail },
]

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-dark-700">
        <BrandLogo size="sm" />
        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-1 ml-8">Admin Panel</p>
      </div>


      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {adminNavItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-primary-700/20 text-primary-400 border border-primary-700/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-dark-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-primary-400' : ''}`} />
              {item.label}
              {active && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-700 space-y-2">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg hover:bg-dark-700 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-sm text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
        {user && (
          <div className="flex items-center gap-2 px-3 py-2 mt-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shrink-0 overflow-hidden">
              {hasCustomAvatar(user.avatar) ? <img src={user.avatar} className="w-full h-full object-cover" /> : getInitials(user.name || '')}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-300">{user.name}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-dark-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-dark-900 border-r border-dark-700 flex-shrink-0 overflow-y-auto">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-64 z-50 bg-dark-900 border-r border-dark-700 lg:hidden overflow-y-auto"
            >
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 bg-dark-900 border-b border-dark-700 flex items-center gap-4 px-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-400 hover:text-slate-200 p-1"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-slate-300">
              {adminNavItems.find(i => isActive(i.path))?.label || 'Admin'}
            </h2>
          </div>
        </header>

        {/* Page Content - scrollable area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


export default AdminLayout
