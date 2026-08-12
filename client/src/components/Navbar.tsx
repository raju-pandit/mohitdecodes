import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Code2, Search, Menu, X, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

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
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary-500/20 p-2 rounded-lg group-hover:bg-primary-500/30 transition-colors">
              <Code2 className="w-6 h-6 text-primary-400" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-cyan-400">
              MohitDecodes
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                  location.pathname === link.path 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-dark-800/50'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-500 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
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
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm outline-none ring-2 ring-transparent focus:ring-primary-500 transition-all"
                >
                  {user?.name?.charAt(0) || 'U'}
                </button>
                
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-dark-900 border border-dark-800 rounded-xl shadow-xl py-1 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-dark-800 mb-1">
                        <p className="text-sm text-white font-medium truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                      </div>
                      <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-dark-800 hover:text-white" onClick={() => setProfileDropdownOpen(false)}>
                        <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                      </Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin" className="flex items-center px-4 py-2 text-sm text-primary-400 hover:bg-dark-800" onClick={() => setProfileDropdownOpen(false)}>
                          <Settings className="w-4 h-4 mr-2" /> Admin Panel
                        </Link>
                      )}
                      <button 
                        onClick={() => { logout(); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-dark-800 transition-colors mt-1 border-t border-dark-800/50"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                      </button>
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
                <div className="flex items-center gap-2">
                  <Code2 className="w-6 h-6 text-primary-400" />
                  <span className="font-bold text-lg text-slate-100">Menu</span>
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
