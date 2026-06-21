import React, { useEffect, useState } from 'react';
import { ArrowDown, Mail, Briefcase, FileDown } from 'lucide-react';
import { motion } from 'framer-motion';
import CanvasContainer from '../3D/CanvasContainer';
import { BACKEND_URL } from '../../context/AuthContext';

const Hero = ({ settings }) => {
  const heroTitle = settings?.heroTitle || 'Awais Ali';
  const heroSubtitle = settings?.heroSubtitle || 'Full Stack Developer';
  const roles = settings?.heroRoles?.length > 0 ? settings.heroRoles : ['Full Stack Developer', 'React & Node Specialist', '3D Web Innovator'];

  // Custom Typewriter logic
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const activeRole = roles[currentRoleIndex];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
      }, 50);
    } else {
      timer = setTimeout(() => {
        setDisplayText((prev) => activeRole.slice(0, prev.length + 1));
      }, 100);
    }

    if (!isDeleting && displayText === activeRole) {
      // Pause when full text is typed before starting deletion
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentRoleIndex, roles]);

  const handleScrollTo = (id) => {
    const element = document.querySelector(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20 px-4 select-none"
    >
      {/* 3D background */}
      <CanvasContainer />

      {/* Main Hero Container */}
      <div className="max-w-4xl text-center z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-4 py-1.5 rounded-full glass-panel text-indigo-500 dark:text-indigo-400 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-6"
        >
          Welcome to my digital space
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight text-light-text dark:text-dark-text mb-4"
        >
          Hi, I am <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 bg-clip-text text-transparent">{heroTitle}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="h-10 sm:h-12 flex items-center justify-center mb-6"
        >
          <span className="font-display text-lg sm:text-2xl md:text-3xl text-light-muted dark:text-dark-muted font-medium">
            I am a <span className="text-indigo-500 dark:text-indigo-400 border-r-2 border-indigo-500 dark:border-indigo-400 pr-1 animate-pulse">{displayText}</span>
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-sans text-sm sm:text-base md:text-lg text-light-muted dark:text-dark-muted max-w-xl mb-10 leading-relaxed"
        >
          {heroSubtitle} — crafting high-performance full-stack web applications with dynamic user experiences and creative interactive elements.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center px-4"
        >
          <button
            onClick={() => handleScrollTo('#projects')}
            className="flex items-center justify-center w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.03] transition-all"
          >
            <Briefcase className="w-4 h-4 mr-2" /> View My Work
          </button>
          
          <button
            onClick={() => handleScrollTo('#contact')}
            className="flex items-center justify-center w-full sm:w-auto px-8 py-3.5 bg-transparent border border-black/15 dark:border-white/15 text-light-text dark:text-dark-text hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-sm font-semibold hover:scale-[1.03] transition-all"
          >
            <Mail className="w-4 h-4 mr-2" /> Hire Me
          </button>

          {settings?.resumeUrl && (
            <a
              href={settings.resumeUrl.startsWith('http') ? settings.resumeUrl : `${BACKEND_URL}${settings.resumeUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full sm:w-auto px-6 py-3.5 bg-transparent border border-indigo-500/30 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-500/10 rounded-lg text-sm font-semibold hover:scale-[1.03] transition-all"
            >
              <FileDown className="w-4 h-4 mr-2" /> Resume
            </a>
          )}
        </motion.div>
      </div>

      {/* Smooth Scroll Indicator */}
      <div className="absolute bottom-8 left-50 transform -translate-x-50 flex flex-col items-center">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          onClick={() => handleScrollTo('#about')}
          className="w-9 h-14 rounded-full border-2 border-black/10 dark:border-white/10 flex items-start justify-center p-1.5 cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
        >
          <div className="w-1.5 h-3.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
