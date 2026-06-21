import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, LayoutDashboard, MonitorOff, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { theme, toggleTheme, cursorEnabled, setCursorEnabled } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '#home' },
    { name: 'About', path: '#about' },
    { name: 'Skills', path: '#skills' },
    { name: 'Resume', path: '#resume' },
    { name: 'Projects', path: '#projects' },
    { name: 'Services', path: '#services' },
    { name: 'Blog', path: '#blog' },
    { name: 'Contact', path: '#contact' },
  ];

  const handleLinkClick = (e, path) => {
    setIsOpen(false);
    if (location.pathname !== '/') return; // Let default router link handle if not on home

    e.preventDefault();
    const element = document.querySelector(path);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-white/70 dark:bg-[#050508]/75 backdrop-blur-md border-b border-black/5 dark:border-white/5 shadow-lg'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="font-display font-extrabold text-xl sm:text-2xl tracking-wider bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 bg-clip-text text-transparent"
            >
              AWAIS.ALI
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {location.pathname === '/' ? (
              navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(e) => handleLinkClick(e, link.path)}
                  className="font-sans text-sm font-medium text-light-text/80 dark:text-dark-text/80 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                >
                  {link.name}
                </a>
              ))
            ) : (
              <Link
                to="/"
                className="font-sans text-sm font-medium text-light-text/80 dark:text-dark-text/80 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              >
                Back to Portfolio
              </Link>
            )}

            {/* Visual Controls */}
            <div className="flex items-center space-x-3 border-l border-black/10 dark:border-white/10 pl-6">
              {/* Custom Cursor Toggle */}
              <button
                onClick={() => setCursorEnabled(!cursorEnabled)}
                title="Toggle Custom Cursor"
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-light-text/70 dark:text-dark-text/70 transition-colors"
              >
                <MonitorOff className={`w-[18px] h-[18px] ${!cursorEnabled ? 'text-indigo-500' : ''}`} />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                title="Toggle Theme Mode"
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-light-text/70 dark:text-dark-text/70 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-[18px] h-[18px] text-yellow-400" />
                ) : (
                  <Moon className="w-[18px] h-[18px] text-indigo-900" />
                )}
              </button>

              {/* Admin login / Dashboard */}
              <Link
                to={user ? '/admin' : '/admin/login'}
                title={user ? 'Admin Dashboard' : 'Admin Login'}
                className="p-2 rounded-full hover:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 transition-all"
              >
                {user ? <LayoutDashboard className="w-[18px] h-[18px]" /> : <User className="w-[18px] h-[18px]" />}
              </Link>
            </div>
          </div>

          {/* Mobile menu and controls */}
          <div className="flex items-center lg:hidden space-x-2">
            {/* Theme Toggle for mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-light-text/70 dark:text-dark-text/70 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-900" />}
            </button>

            {/* Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-light-text/80 dark:text-dark-text/80 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white dark:bg-[#0d0d14] border-b border-black/5 dark:border-white/5 overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {location.pathname === '/' ? (
                navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={(e) => handleLinkClick(e, link.path)}
                    className="block px-3 py-2.5 rounded-md text-base font-medium text-light-text/80 dark:text-dark-text/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                  >
                    {link.name}
                  </a>
                ))
              ) : (
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-base font-medium text-light-text/80 dark:text-dark-text/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                >
                  Back to Portfolio
                </Link>
              )}

              <div className="pt-4 border-t border-black/10 dark:border-white/10 flex justify-between items-center px-3">
                <span className="text-sm font-medium text-light-muted dark:text-dark-muted">Admin Panel</span>
                <Link
                  to={user ? '/admin' : '/admin/login'}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md text-sm font-medium hover:bg-indigo-600 transition-colors"
                >
                  {user ? (
                    <>
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 mr-2" /> Admin Login
                    </>
                  )}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
