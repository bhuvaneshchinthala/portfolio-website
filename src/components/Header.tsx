import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTransitionStore } from '@/lib/store';

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
    { label: 'Home', type: 'scroll', target: 'hero' },
    { label: 'About Me', type: 'link', to: '/about-me' },
    { label: 'CBUM', type: 'link', to: '/cbum' },
    { label: 'Projects', type: 'scroll', target: 'projects' },
    { label: 'Terminal', type: 'scroll', target: 'terminal' },
    { label: 'Contact', type: 'scroll', target: 'contact' },
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
          scale: isNavbarHovered ? 1.05 : 0.75,
          backgroundColor: 'rgb(10, 10, 10)', // Guaranteed solid background (no alpha)
          borderColor: isNavbarHovered ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)',
          boxShadow: isNavbarHovered 
            ? '0 20px 40px -15px rgba(239,68,68,0.3)' 
            : '0 4px 12px -5px rgba(0,0,0,0.3)'
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className={`backdrop-blur-xl border border-white/10 rounded-2xl px-6 flex items-center gap-8 shadow-lg transition-[padding] duration-500 ${
          scrolled 
            ? 'py-2' 
            : 'py-3'
        }`}
      >

        <ul 
          className="relative flex items-center gap-2 font-syne text-[11px] font-bold uppercase tracking-[0.15em] text-gray-200 hidden md:flex"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {navItems.map((item, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <motion.li 
                key={item.label}
                className="relative py-1 flex flex-col items-center"
                onMouseEnter={() => setHoveredIndex(index)}
                animate={{
                  scale: hoveredIndex === null ? 0.85 : (isHovered ? 1.25 : 0.75),
                  opacity: hoveredIndex === null ? 0.65 : (isHovered ? 1 : 0.3),
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 24 }}
              >
                {/* Advanced Sliding Hover Indicator Pill */}
                {isHovered && (
                  <motion.div
                    layoutId="navbar-hover-pill"
                    className="absolute inset-0 bg-red-500/10 border border-red-500/25 rounded-lg z-0 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                  />
                )}

                {/* Sliding Cyber Dot Indicator at Bottom */}
                {isHovered && (
                  <motion.div
                    layoutId="navbar-hover-dot"
                    className="absolute bottom-[-4px] w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_#ff2800] z-20"
                    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                  />
                )}
                
                {item.type === 'scroll' ? (
                  <motion.button
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    style={isHovered ? { textShadow: '0 0 8px rgba(239,68,68,0.8)' } : {}}
                    className="relative z-10 px-4 py-1.5 rounded-lg text-gray-300 hover:text-red-400 transition-all duration-200 bg-transparent border-0 outline-none cursor-pointer font-syne font-bold uppercase tracking-[0.15em] text-[11px] flex items-center justify-center"
                    onClick={() => scrollToSection(item.target!)}
                  >
                    <ScrambleText text={item.label.toUpperCase()} active={isHovered} />
                  </motion.button>
                ) : (
                  <div className="flex items-center justify-center z-10">
                    <Link
                      to={item.to!}
                      style={isHovered ? { textShadow: '0 0 8px rgba(239,68,68,0.8)' } : {}}
                      className="relative block px-4 py-1.5 rounded-lg text-gray-300 hover:text-red-400 transition-all duration-200 font-syne font-bold uppercase tracking-[0.15em] text-[11px]"
                    >
                      <ScrambleText text={item.label.toUpperCase()} active={isHovered} />
                    </Link>
                  </div>
                )}
              </motion.li>
            );
          })}
        </ul>


        <div className="flex items-center gap-4 pl-4 border-l border-white/10" onMouseLeave={() => setHoveredIndex(null)}>
          <motion.button
            onMouseEnter={() => setHoveredIndex(navItems.length)}
            animate={{
              scale: hoveredIndex === null ? 0.85 : (hoveredIndex === navItems.length ? 1.25 : 0.75),
              opacity: hoveredIndex === null ? 0.8 : (hoveredIndex === navItems.length ? 1 : 0.3),
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            onClick={() => scrollToSection('contact')}
            className="px-5 py-2 rounded-lg bg-red-600 text-white text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-300 font-syne cursor-pointer"
          >
            Let's Talk →
          </motion.button>
        </div>
      </motion.nav>
    </motion.header>
  );
}
