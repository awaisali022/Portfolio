import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PageLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 600);
          return 100;
        }
        const increment = Math.floor(Math.random() * 15) + 5;
        const next = prev + increment;
        return next > 100 ? 100 : next;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {progress < 100 && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050508]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="relative flex flex-col items-center">
            {/* Spinning Rings */}
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 rounded-full border-[3px] border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full border-[3px] border-r-purple-500 border-t-transparent border-b-transparent border-l-transparent animate-spin-slow" />
              <div className="absolute inset-4 rounded-full border-[3px] border-b-indigo-400 border-t-transparent border-r-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-display font-extrabold text-xl tracking-wider">AA</span>
              </div>
            </div>

            {/* Branding */}
            <h2 className="text-white font-display font-semibold tracking-wider text-xl mb-1">
              Awais Ali
            </h2>
            <p className="text-gray-400 font-sans text-xs tracking-widest uppercase mb-6">
              Full Stack Developer
            </p>

            {/* Load Bar */}
            <div className="w-48 bg-gray-900 h-[2px] rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="text-indigo-400 font-display font-medium mt-3 text-lg">
              {progress}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
