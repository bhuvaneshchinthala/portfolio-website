import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTransitionStore } from '@/lib/store';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { startTransition } = useTransitionStore();

  const scrollToSection = (id: string) => {
    startTransition(id);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-6 left-0 right-0 z-[90] flex justify-center px-4"
    >
      <nav className="bg-neutral-900/80 backdrop-blur-md border border-red-500/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-lg shadow-red-500/5">

        <ul className="flex items-center gap-6 font-paragraph text-sm text-gray-200 hidden md:flex">
            <li>
              <button
                className="hover:text-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-300 px-3 py-1 rounded-full hover:bg-white/5"
                onClick={() => scrollToSection('hero')}
              >
                Home
              </button>
            </li>
            <li>
              <Link
                to="/about-me"
                className="hover:text-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-300 px-3 py-1 rounded-full hover:bg-white/5"
              >
                About Me
              </Link>
            </li>
            {[
              { label: 'Projects', id: 'projects' },
              { label: 'Terminal', id: 'terminal' },
              { label: 'Contact', id: 'contact' },
            ].map((item) => (
              <li key={item.label}>
                <button
                  className="hover:text-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-300 px-3 py-1 rounded-full hover:bg-white/5"
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
        </ul>


        <div className="flex items-center gap-4 pl-4 border-l border-white/10">
          <button
            onClick={() => scrollToSection('contact')}
            className="px-5 py-2 rounded-full bg-white text-black text-xs font-semibold tracking-wide hover:bg-gray-200 transition-all duration-300 hover:scale-105 shadow-[0_0_15px_-3px_rgba(255,255,255,0.3)]"
          >
            Let's Talk →
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
