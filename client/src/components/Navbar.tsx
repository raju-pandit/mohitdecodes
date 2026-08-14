import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, LogOut, Settings, User } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import BrandLogo from './Logo';
import { getInitials, hasCustomAvatar } from '../utils/formatters';

export const Navbar = ({ onOpenSearch }: { onOpenSearch: () => void }) => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Framer Motion Scroll Listener
  useMotionValueEvent(scrollY, "change", (latest) => {
    const currentScrollY = latest;
    const isScrolled = currentScrollY > 30;
    setScrolled(isScrolled);

    if (currentScrollY <= 15) {
      setShowNavbar(true);
    } else if (currentScrollY > lastScrollY.current + 8) {
      // scrolling down
      setShowNavbar(true); // Keep navbar active (collapsing into center pill)
    } else if (currentScrollY < lastScrollY.current - 8) {
      // scrolling up
      setShowNavbar(true);
    }

    lastScrollY.current = currentScrollY;
  });

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

  // Close dropdowns on route change
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
    { name: 'Topmate', path: 'https://topmate.io/mohitdecodes', isExternal: true },
    { name: 'YouTube', path: '/youtube' },
  ];

  const handleNavClick = (link: { name: string; path: string; isExternal?: boolean }) => {
    if (link.isExternal) {
      window.open(link.path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link.path);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header 
      style={{
        transform: showNavbar ? 'translate3d(-50%, 0, 0)' : 'translate3d(-50%, -160%, 0)',
        transition: 'transform 0.35s ease',
      }}
      className="fixed top-[10px] left-1/2 z-[9999] w-[95%] max-w-7xl pointer-events-none"
    >
      <div className="w-full flex flex-col items-center">
        {/* Outer Header Bar (When scrolled, outer container becomes transparent so ONLY center pill remains) */}
        <div 
          style={{ 
            backgroundColor: scrolled ? 'transparent' : 'rgba(10, 10, 22, 0.45)',
            backdropFilter: scrolled ? 'none' : 'blur(14px)', 
            WebkitBackdropFilter: scrolled ? 'none' : 'blur(14px)',
            border: scrolled ? '1px solid transparent' : '1px solid rgba(255, 255, 255, 0.10)',
          }}
          className={`w-full pointer-events-auto flex items-center justify-between h-14 sm:h-16 px-3.5 sm:px-6 rounded-2xl sm:rounded-[999px] transition-all duration-300 ${
            scrolled ? 'shadow-none' : 'shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] shadow-purple-950/15'
          }`}
        >
          {/* Left: MD Logo + MohitDecodes (hides on desktop when scrolled so only center menu pill remains) */}
          <div className={`transition-all duration-300 shrink-0 ${scrolled ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden lg:pointer-events-none' : 'opacity-100'}`}>
            <BrandLogo size="md" />
          </div>

          {/* Center: Floating Glass Pill Navigation */}
          <nav 
            style={{
              backgroundColor: isDark 
                ? (scrolled ? 'rgba(10, 10, 25, 0.85)' : 'rgba(255, 255, 255, 0.04)')
                : (scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)'),
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
            className={`hidden lg:flex items-center gap-1 px-3.5 py-1.5 border rounded-[999px] transition-all duration-300 ${
              isDark
                ? (scrolled 
                    ? 'border-primary-500/40 shadow-[0_0_24px_rgba(168,85,247,0.3)] border-white/15' 
                    : 'border-white/10 border-primary-500/20 shadow-[0_0_15px_rgba(124,58,237,0.15)]')
                : (scrolled
                    ? 'border-primary-500/30 shadow-[0_4px_20px_rgba(124,58,237,0.1)] border-slate-200'
                    : 'border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)]')
            }`}
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className={`relative px-3.5 py-1.5 rounded-[999px] text-xs font-semibold tracking-wide transition-all duration-200 z-10 cursor-pointer ${
                    isActive 
                      ? 'text-white font-bold' 
                      : (isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 rounded-[999px] z-0 shadow-[0_0_14px_rgba(168,85,247,0.6)]"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>


          {/* Right: Search Icon + ThemeToggle + Profile */}
          <div className={`flex items-center gap-2 sm:gap-3 transition-all duration-300 ${scrolled ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden lg:pointer-events-none' : 'opacity-100'}`}>
            <motion.button 
              type="button"
              onClick={onOpenSearch}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className={`relative inline-flex items-center justify-center rounded-full p-2 transition-all duration-300 cursor-pointer overflow-hidden border ${
                isDark
                  ? 'bg-white/[0.06] hover:bg-white/[0.12] border-white/10 text-slate-300 hover:text-white hover:border-primary-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300/80 text-slate-700 hover:text-slate-900 shadow-sm'
              }`}
              aria-label="Search"
              title="Search (Ctrl + K)"
            >
              <Search size={16} className="stroke-[2.2]" />
            </motion.button>

            {/* Theme Toggle Button */}
            <ThemeToggle size="sm" />

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-1.5 md:gap-2.5 p-1 md:px-3 md:py-1.5 border rounded-full cursor-pointer transition-all ${
                    isDark 
                      ? 'bg-white/5 border-primary-500/35 hover:bg-white/10' 
                      : 'bg-slate-100 border-primary-500/30 hover:bg-slate-200'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-primary-600/30 border border-primary-500/40 flex items-center justify-center text-primary-600 dark:text-white text-xs font-extrabold overflow-hidden shrink-0">
                    {hasCustomAvatar(user?.avatar) ? <img src={user.avatar} className="w-full h-full object-cover" /> : getInitials(user?.name || '')}
                  </div>
                  <span className={`hidden md:inline text-xs font-semibold tracking-wide ml-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{user?.name}</span>
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
                        backgroundColor: isDark ? 'rgba(10, 10, 25, 0.96)' : 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                      }}
                      className={`absolute right-0 mt-3 w-64 border rounded-2xl p-4 z-[9999] overflow-hidden text-left ${
                        isDark ? 'border-white/10 shadow-2xl' : 'border-slate-200 shadow-xl'
                      }`}
                    >
                      {/* Dropdown Header Info Card */}
                      <div className="flex items-start mb-3">
                        <div className="w-12 h-12 rounded-full bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-600 dark:text-white text-sm font-extrabold overflow-hidden shrink-0 mr-3">
                          {hasCustomAvatar(user?.avatar) ? <img src={user.avatar} className="w-full h-full object-cover" /> : getInitials(user?.name || '')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm font-extrabold truncate max-w-[90px] ${isDark ? 'text-white' : 'text-slate-900'}`}>{user?.name}</span>
                            <span className="flex items-center gap-1 text-[8px] text-green-500 font-semibold select-none bg-green-500/10 px-1.5 py-0.5 rounded-full">
                              <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
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

                      <div className={`border-t my-3 ${isDark ? 'border-white/10' : 'border-slate-200'}`} />

                      {/* Dropdown Options */}
                      <div className="space-y-1">
                        <Link to="/dashboard" className={`flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                          isDark ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`} onClick={() => setProfileDropdownOpen(false)}>
                          <User className="w-4 h-4 mr-3 text-slate-400" /> Profile
                        </Link>
                        {user?.role === 'admin' && (
                          <Link to="/admin" className={`flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                            isDark ? 'text-primary-400 hover:bg-white/10' : 'text-primary-600 hover:bg-primary-50'
                          }`} onClick={() => setProfileDropdownOpen(false)}>
                            <Settings className="w-4 h-4 mr-3 text-primary-500" /> Admin Panel
                          </Link>
                        )}
                        <button 
                          onClick={() => { logout(); setProfileDropdownOpen(false); }}
                          className="w-full flex items-center px-3 py-2.5 text-sm text-red-500 font-bold hover:bg-red-500/10 rounded-lg transition-colors mt-1 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 mr-3 text-red-500" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`cursor-pointer ${isDark ? 'text-slate-200 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="cursor-pointer"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button 
              className={`lg:hidden p-2 rounded-xl border transition-all select-none shrink-0 cursor-pointer ${
                isDark 
                  ? 'text-slate-200 hover:text-white bg-white/5 border-white/10 hover:bg-white/10' 
                  : 'text-slate-700 hover:text-slate-900 bg-slate-100 border-slate-200 hover:bg-slate-200'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                backgroundColor: isDark ? 'rgba(10, 10, 25, 0.96)' : 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)',
              }}
              className={`mt-2.5 w-full pointer-events-auto rounded-2xl p-4 shadow-2xl lg:hidden flex flex-col gap-1 max-h-[80vh] overflow-y-auto ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-500/20">
                <span className="text-xs font-semibold text-slate-400">Theme</span>
                <ThemeToggle size="sm" />
              </div>

              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    location.pathname === link.path 
                      ? 'bg-primary-600/20 text-primary-500 dark:text-primary-300 border border-primary-500/30' 
                      : (isDark ? 'text-slate-200 hover:bg-white/5 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900')
                  }`}
                >
                  {link.name}
                </button>
              ))}

              <div className="border-t border-white/10 my-2 pt-2">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 px-2 py-1">
                      <div className="w-8 h-8 rounded-full bg-primary-600/30 border border-primary-500/40 flex items-center justify-center text-white text-xs font-extrabold overflow-hidden shrink-0">
                        {hasCustomAvatar(user.avatar) ? <img src={user.avatar} className="w-full h-full object-cover" /> : getInitials(user.name || '')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/5 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" /> Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-primary-400 hover:bg-white/5 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-primary-500" /> Admin Panel
                      </Link>
                    )}
                    <button 
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 flex items-center gap-2 w-full text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-400" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-center cursor-pointer"
                      onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                    >
                      Login
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="w-full justify-center cursor-pointer"
                      onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
