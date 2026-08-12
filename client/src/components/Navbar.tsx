import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Code2, Search, Menu, X, LogOut, LayoutDashboard, Settings, User } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { getInitials, hasCustomAvatar } from '../utils/formatters';

export const Navbar = ({ onOpenSearch }: { onOpenSearch: () => void }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [profileDropdownOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Tutorials', path: '/tutorials' },
    { name: 'Roadmaps', path: '/roadmaps' },
    { name: 'Resources', path: '/resources' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'YouTube', path: '/youtube' },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 20);
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${
        scrolled ? 'bg-dark-950/90 backdrop-blur-md border-b border-dark-800' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full border border-primary-500/25 bg-dark-900 overflow-hidden flex items-center justify-center group-hover:scale-105 group-hover:border-primary-500/50 group-hover:shadow-[0_0_12px_rgba(124,58,237,0.4)] transition-all duration-300 shrink-0">
              <img 
                src="/logo.png" 
                alt="Mohit Decodes Logo" 
                className="w-full h-full object-cover shrink-0" 
              />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-primary-400 transition-colors">
              Mohit Decodes
            </span>
          </Link>

          {/* Desktop Navigation — Pill Styled */}
          <nav className="hidden md:flex items-center gap-1 bg-dark-900/80 backdrop-blur-md px-3 py-1.5 border border-dark-700/50 rounded-full shadow-inner-glow">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 z-10 ${
                  location.pathname === link.path 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-primary-600 rounded-full z-0 shadow-glow"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" className="!px-2 text-gray-400" onClick={onOpenSearch}>
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline-block ml-2 text-sm border border-dark-700 bg-dark-900 rounded px-1.5 py-0.5 text-gray-500 font-mono">Ctrl K</span>
            </Button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 bg-dark-900/90 px-3 py-1.5 border border-primary-500/35 rounded-full cursor-pointer hover:bg-dark-850 transition-all shadow-inner-glow"
                >
                  <div className="w-6 h-6 rounded-full bg-primary-600/30 border border-primary-500/40 flex items-center justify-center text-white text-xs font-extrabold overflow-hidden shrink-0">
                    {hasCustomAvatar(user?.avatar) ? <img src={user.avatar} className="w-full h-full object-cover" /> : getInitials(user?.name || '')}
                  </div>
                  <span className="text-xs font-semibold text-white tracking-wide">{user?.name}</span>
                  <span className="text-gray-400 text-[9px] ml-0.5">{profileDropdownOpen ? '▲' : '▼'}</span>
                </button>
                
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-64 bg-dark-900 border border-dark-800 rounded-2xl shadow-2xl p-4 z-50 overflow-hidden text-left"
                    >
                      {/* Dropdown Header Info Card */}
                      <div className="flex items-start mb-3">
                        <div className="w-12 h-12 rounded-full bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-white text-sm font-extrabold overflow-hidden shrink-0 mr-3">
                          {hasCustomAvatar(user?.avatar) ? <img src={user.avatar} className="w-full h-full object-cover" /> : getInitials(user?.name || '')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-extrabold text-white truncate max-w-[90px]">{user?.name}</span>
                            <span className="flex items-center gap-1 text-[8px] text-green-400 font-semibold select-none bg-green-500/10 px-1.5 py-0.5 rounded-full">
                              <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                              Live Coding
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 truncate mt-0.5">{user?.email}</p>
                          <div className="mt-1">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-primary-600 text-white tracking-wider">
                              {user?.role === 'admin' ? 'ADMIN' : 'STUDENT'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-dark-800/80 my-3" />

                      {/* Dropdown Options */}
                      <div className="space-y-1">
                        <Link to="/dashboard" className="flex items-center px-3 py-2 text-sm text-gray-300 font-semibold hover:bg-dark-800/60 hover:text-white rounded-lg transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                          <User className="w-4 h-4 mr-3 text-gray-400" /> Profile
                        </Link>
                        {user?.role === 'admin' && (
                          <Link to="/admin" className="flex items-center px-3 py-2 text-sm text-primary-400 font-semibold hover:bg-dark-800/60 rounded-lg transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                            <Settings className="w-4 h-4 mr-3 text-primary-500" /> Admin Panel
                          </Link>
                        )}
                        <button 
                          onClick={() => { logout(); setProfileDropdownOpen(false); }}
                          className="w-full flex items-center px-3 py-2.5 text-sm text-red-500 font-bold hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                        >
                          <LogOut className="w-4 h-4 mr-3 text-red-500" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-dark-900 border-l border-dark-800 z-50 p-6 flex flex-col md:hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full border border-primary-500/25 bg-dark-900 overflow-hidden flex items-center justify-center shrink-0">
                    <img 
                      src="/logo.png" 
                      alt="Mohit Decodes Logo" 
                      className="w-full h-full object-cover shrink-0" 
                    />
                  </div>
                  <span className="font-bold text-lg text-slate-100">Mohit Decodes</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-white rounded-full bg-dark-800/50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-2 flex-grow overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      location.pathname === link.path 
                        ? 'bg-primary-500/10 text-primary-400' 
                        : 'text-gray-300 hover:bg-dark-800 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {!user && (
                <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-dark-800">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
