import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, LogOut, Settings, User } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './Logo';
import { getInitials, hasCustomAvatar } from '../utils/formatters';

export const Navbar = ({ onOpenSearch }: { onOpenSearch: () => void }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
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

  // Close dropdown & mobile menu on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
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

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-[9990] p-2.5 sm:p-3 flex justify-center pointer-events-none">
        <div 
          style={{ 
            backgroundColor: 'rgba(10, 10, 18, 0.55)',
            backdropFilter: 'blur(14px)', 
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
          className="w-full max-w-7xl pointer-events-auto flex items-center justify-between h-14 sm:h-16 px-3.5 sm:px-6 rounded-2xl sm:rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] shadow-purple-950/20 transition-all duration-300"
        >
          {/* Logo */}
          <BrandLogo size="md" />

          {/* Desktop Navigation — Floating Pill */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] px-3 py-1.5 border border-white/5 rounded-full">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 z-10 ${
                  location.pathname === link.path 
                    ? 'text-white' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-primary-600 rounded-full z-0 shadow-[0_0_12px_rgba(147,51,234,0.5)]"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" className="!px-2 sm:!px-2.5 text-slate-300 hover:text-white" onClick={onOpenSearch}>
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline-block ml-2 text-xs border border-white/10 bg-white/5 rounded px-1.5 py-0.5 text-slate-400 font-mono">Ctrl K</span>
            </Button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 md:gap-2.5 bg-white/5 p-1 md:px-3 md:py-1.5 border border-primary-500/35 rounded-full cursor-pointer hover:bg-white/10 transition-all shadow-inner"
                >
                  <div className="w-6 h-6 rounded-full bg-primary-600/30 border border-primary-500/40 flex items-center justify-center text-white text-xs font-extrabold overflow-hidden shrink-0">
                    {hasCustomAvatar(user?.avatar) ? <img src={user.avatar} className="w-full h-full object-cover" /> : getInitials(user?.name || '')}
                  </div>
                  <span className="hidden md:inline text-xs font-semibold text-white tracking-wide ml-1">{user?.name}</span>
                  <span className="hidden md:inline text-slate-400 text-[9px] ml-0.5">{profileDropdownOpen ? '▲' : '▼'}</span>
                </button>
                
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        backgroundColor: 'rgba(10, 10, 25, 0.96)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                      }}
                      className="absolute right-0 mt-3 w-64 border border-white/10 rounded-2xl shadow-2xl p-4 z-[9999] overflow-hidden text-left"
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
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                          <div className="mt-1">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-primary-600 text-white tracking-wider">
                              {user?.role === 'admin' ? 'ADMIN' : 'STUDENT'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-white/10 my-3" />

                      {/* Dropdown Options */}
                      <div className="space-y-1">
                        <Link to="/dashboard" className="flex items-center px-3 py-2 text-sm text-slate-300 font-semibold hover:bg-white/10 hover:text-white rounded-lg transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                          <User className="w-4 h-4 mr-3 text-slate-400" /> Profile
                        </Link>
                        {user?.role === 'admin' && (
                          <Link to="/admin" className="flex items-center px-3 py-2 text-sm text-primary-400 font-semibold hover:bg-white/10 rounded-lg transition-colors" onClick={() => setProfileDropdownOpen(false)}>
                            <Settings className="w-4 h-4 mr-3 text-primary-500" /> Admin Panel
                          </Link>
                        )}
                        <button 
                          onClick={() => { logout(); setProfileDropdownOpen(false); }}
                          className="w-full flex items-center px-3 py-2.5 text-sm text-red-400 font-bold hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                        >
                          <LogOut className="w-4 h-4 mr-3 text-red-400" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-slate-200 hover:text-white">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-slate-200 hover:text-white rounded-xl hover:bg-white/10 border border-white/10 bg-white/5 transition-all select-none shrink-0"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer (outside transformed container so fixed inset-0 covers 100% viewport) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[9999] lg:hidden">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ ease: 'easeOut', duration: 0.2 }}
              style={{
                backgroundColor: 'rgba(10, 10, 25, 0.97)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}
              className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm border-l border-white/10 p-6 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <BrandLogo size="sm" />
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-2 text-slate-300 hover:text-white rounded-full bg-white/5 border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1.5 flex-grow overflow-y-auto pr-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                      location.pathname === link.path 
                        ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30' 
                        : 'text-slate-200 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {user ? (
                <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 px-2 mb-2">
                    <div className="w-9 h-9 rounded-full bg-primary-600/30 border border-primary-500/40 flex items-center justify-center text-white text-xs font-extrabold overflow-hidden shrink-0">
                      {hasCustomAvatar(user.avatar) ? <img src={user.avatar} className="w-full h-full object-cover" /> : getInitials(user.name || '')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full flex justify-center items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" /> Profile Dashboard
                    </Button>
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full flex justify-center items-center gap-2 text-primary-400">
                        <Settings className="w-4 h-4 text-primary-500" /> Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="ghost" 
                    className="w-full flex justify-center items-center gap-2 text-red-400 hover:bg-red-500/10 font-bold"
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                  >
                    <LogOut className="w-4 h-4 text-red-400" /> Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-white/10">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full justify-center">Sign Up</Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
