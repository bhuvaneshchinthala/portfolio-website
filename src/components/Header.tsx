import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-deep-black/80 backdrop-blur-xl border-b border-overlay' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-[120rem] mx-auto px-8 py-6 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-heading text-2xl font-bold tracking-tight"
        >
          <span className="bg-gradient-to-r from-foreground to-light-gray bg-clip-text text-transparent">
            NEBULA
          </span>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-8 font-paragraph text-sm"
        >
          <li>
            <button
              onClick={() => scrollToSection('hero')}
              className="text-secondary hover:text-foreground transition-colors duration-300 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-foreground group-hover:w-full transition-all duration-300" />
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection('terminal')}
              className="text-secondary hover:text-foreground transition-colors duration-300 relative group"
            >
              Code
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-foreground group-hover:w-full transition-all duration-300" />
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection('projects')}
              className="text-secondary hover:text-foreground transition-colors duration-300 relative group"
            >
              Projects
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-foreground group-hover:w-full transition-all duration-300" />
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection('about')}
              className="text-secondary hover:text-foreground transition-colors duration-300 relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-foreground group-hover:w-full transition-all duration-300" />
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-6 py-2 bg-foreground text-deep-black rounded-full font-medium hover:bg-light-gray transition-all duration-300 hover:scale-105"
            >
              Contact
            </button>
          </li>
        </motion.ul>
      </nav>
    </motion.header>
  );
}
