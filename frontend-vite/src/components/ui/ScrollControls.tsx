import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown, Home } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const ScrollControls: React.FC = () => {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      setShowTop(currentScroll > 400);
      setShowBottom(totalHeight - currentScroll > 400);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  const isHome = pathname === '/' || pathname === '/portfolio';

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] flex flex-col gap-3 sm:gap-4 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {showTop && (
          <motion.button
            key="scroll-top"
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 10 }}
            onClick={scrollToTop}
            className="p-3 sm:p-4 rounded-full bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/10 text-[#8b5cf6] shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group pointer-events-auto"
            title="Scroll to Top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
        )}

        {showBottom && (
          <motion.button
            key="scroll-bottom"
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 10 }}
            onClick={scrollToBottom}
            className="p-3 sm:p-4 rounded-full bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/10 text-[#8b5cf6] shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group pointer-events-auto"
            title="Scroll to Bottom"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
        )}

        {!isHome && (
          <motion.div
            key="home-button"
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 10 }}
            className="pointer-events-auto"
          >
            <Link
              to="/"
              className="p-3 sm:p-4 rounded-full bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-white/10 text-[#d4a373] shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
              title="Back to Home"
              aria-label="Navigate to home"
            >
              <Home className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 whitespace-nowrap font-medium text-sm hidden sm:inline">
                Home
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScrollControls;
