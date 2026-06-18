import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTransitionStore } from '@/lib/store';
import { Home, Briefcase, Dumbbell, Folder, Command, Mail, MessageSquare } from 'lucide-react';

// Micro-scramble component for futuristic text transitions on hover
function ScrambleText({ text, active }: { text: string; active: boolean }) {
  const [display, setDisplay] = useState(text);
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&*";

  useEffect(() => {
    if (!active) {
      setDisplay(text);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 25);

    return () => clearInterval(interval);
  }, [active, text]);

  return <>{display}</>;
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);

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

  const navItems = [
    { label: 'Home', type: 'scroll', target: 'hero', icon: Home },
    { label: 'About Me', type: 'link', to: '/about-me', icon: Briefcase },
    { label: 'CBUM', type: 'link', to: '/cbum', icon: Dumbbell },
    { label: 'Projects', type: 'scroll', target: 'projects', icon: Folder },
    { label: 'Terminal', type: 'scroll', target: 'terminal', icon: Command },
    { label: 'Contact', type: 'scroll', target: 'contact', icon: Mail },
    { label: "Let's Talk", type: 'scroll', target: 'contact', icon: MessageSquare },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-6 left-0 right-0 z-[90] flex justify-center px-4"
    >
      <motion.nav 
        onMouseEnter={() => setIsNavbarHovered(true)}
        onMouseLeave={() => {
          setIsNavbarHovered(false);
          setHoveredIndex(null);
        }}
        animate={{
          scale: isNavbarHovered ? 1.05 : 0.95,
          backgroundColor: 'rgba(10, 10, 10, 0.85)', // Glassmorphic solid background
          borderColor: isNavbarHovered ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.1)',
          boxShadow: isNavbarHovered 
            ? '0 20px 40px -15px rgba(239, 68, 68, 0.25)' 
            : '0 4px 12px -5px rgba(0, 0, 0, 0.3)'
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className={`backdrop-blur-xl border rounded-2xl px-4 py-2 flex items-center gap-3 shadow-lg transition-[padding] duration-500 ${
          scrolled ? 'py-1.5' : 'py-2'
        }`}
      >
        <ul className="flex items-center gap-3">
          {navItems.map((item, index) => {
            const isHovered = hoveredIndex === index;
            const Icon = item.icon;

            return (
              <motion.li 
                key={item.label}
                className="relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Floating Tooltip Above */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, x: '-50%' }}
                      animate={{ opacity: 1, y: 0, x: '-50%' }}
                      exit={{ opacity: 0, y: 10, x: '-50%' }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute -top-12 left-1/2 bg-neutral-950 border border-red-500/30 text-white font-orbitron font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded shadow-[0_0_10px_rgba(239,68,68,0.2)] whitespace-nowrap pointer-events-none z-[100]"
                    >
                      <ScrambleText text={item.label.toUpperCase()} active={isHovered} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {item.type === 'scroll' ? (
                  <button
                    onClick={() => scrollToSection(item.target!)}
                    className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-300 cursor-pointer outline-none ${
                      isHovered 
                        ? 'bg-neutral-800/80 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.25)] text-red-400' 
                        : 'bg-neutral-900/40 border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                  </button>
                ) : (
                  <Link
                    to={item.to!}
                    className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-300 outline-none ${
                      isHovered 
                        ? 'bg-neutral-800/80 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.25)] text-red-400' 
                        : 'bg-neutral-900/40 border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                  </Link>
                )}
              </motion.li>
            );
          })}
        </ul>
      </motion.nav>
    </motion.header>
  );
}
