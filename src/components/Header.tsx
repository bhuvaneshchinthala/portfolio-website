import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTransitionStore } from '@/lib/store';
import { Home, User, Dumbbell, FolderGit2, Terminal, Mail } from 'lucide-react';

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

function FireBackground({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      trail: Array<{ x: number; y: number }>;
      size: number;
      speedY: number;
      speedX: number;
      life: number;
      maxLife: number;
      type: 'flame' | 'spark' | 'smoke';
      colorBase: string;
      angle: number;
      wobbleSpeed: number;
    }> = [];

    const colors = {
      flame: [
        'rgba(255, 235, 235, ', // White-hot core (slight red tint)
        'rgba(255, 70, 0, ',    // Intense neon orange-red
        'rgba(220, 15, 0, ',    // Pure brand crimson
        'rgba(140, 5, 0, ',     // Dark burning red
      ],
      smoke: 'rgba(70, 65, 65, ',
      spark: 'rgba(255, 90, 0, ', // Orange-red spark
    };

    const animate = () => {
      if (!canvas) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'screen';

      // Oscillating ambient wind force based on time
      const windForce = Math.sin(Date.now() * 0.0035) * 0.08;

      if (active) {
        // 1. Spawn flame particles
        for (let i = 0; i < 2; i++) {
          const maxLife = 15 + Math.random() * 15;
          particles.push({
            x: Math.random() * width,
            y: height + 2,
            trail: [],
            size: 3 + Math.random() * 4,
            speedY: -(0.5 + Math.random() * 0.8),
            speedX: (Math.random() - 0.5) * 0.15,
            life: maxLife,
            maxLife,
            type: 'flame',
            colorBase: '',
            angle: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.04 + Math.random() * 0.04,
          });
        }

        // 2. Spawn spark/ember particles
        if (Math.random() < 0.45) {
          particles.push({
            x: Math.random() * width,
            y: height - 1,
            trail: [],
            size: 1 + Math.random() * 1.5,
            speedY: -(1.5 + Math.random() * 1.8),
            speedX: (Math.random() - 0.5) * 0.8,
            life: 25 + Math.random() * 20,
            maxLife: 45,
            type: 'spark',
            colorBase: colors.spark,
            angle: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.08 + Math.random() * 0.08,
          });
        }
      }

      particles = particles.filter(p => {
        // Record trail for smooth curve rendering
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 6) p.trail.shift();

        // Base physics updates
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Apply wind breeze
        p.x += windForce;
        
        // Wobble/turbulence pathing
        p.angle += p.wobbleSpeed;
        p.x += Math.sin(p.angle) * 0.25;

        // Mouse gravity sway (thermal attraction)
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 70) {
            const pullForce = (70 - dist) / 70;
            p.speedX += (dx / dist) * pullForce * 0.12;
            p.speedY += (dy / dist) * pullForce * 0.08;
          }
        }

        p.life--;

        const pct = p.life / p.maxLife;

        // Transition flame to smoke near the end of life
        if (p.type === 'flame' && pct < 0.35) {
          p.type = 'smoke';
          p.colorBase = colors.smoke;
          p.size = p.size * 1.6;
          p.speedY *= 0.6;
        }

        let alpha = 0;
        let size = p.size;
        let colorStr = '';

        if (p.type === 'flame') {
          alpha = pct * 0.8;
          size = p.size * (0.3 + pct * 0.7);
          
          if (pct > 0.75) {
            colorStr = colors.flame[0];
          } else if (pct > 0.5) {
            colorStr = colors.flame[1];
          } else if (pct > 0.25) {
            colorStr = colors.flame[2];
          } else {
            colorStr = colors.flame[3];
          }
        } else if (p.type === 'spark') {
          alpha = pct * 0.95;
          size = p.size;
          colorStr = p.colorBase;
          p.speedY += 0.008;
        } else if (p.type === 'smoke') {
          alpha = pct * 0.22;
          size = p.size * (1.6 - pct * 0.6);
          colorStr = p.colorBase;
        }

        // Draw volumetric glow
        ctx.shadowBlur = p.type === 'smoke' ? 0 : 8;
        ctx.shadowColor = 'rgba(255, 40, 0, 0.5)';

        // Render trail as flame tongues using quadratic curves
        if (p.trail.length > 2 && (p.type === 'flame' || p.type === 'spark')) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let i = 1; i < p.trail.length - 1; i++) {
            const xc = (p.trail[i].x + p.trail[i + 1].x) / 2;
            const yc = (p.trail[i].y + p.trail[i + 1].y) / 2;
            ctx.quadraticCurveTo(p.trail[i].x, p.trail[i].y, xc, yc);
          }
          ctx.lineWidth = size;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = `${colorStr}${alpha})`;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `${colorStr}${alpha})`;
          ctx.fill();
        }

        return p.life > 0;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
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
    { label: 'About Me', type: 'link', to: '/about-me', icon: User },
    { label: 'CBUM', type: 'link', to: '/cbum', icon: Dumbbell },
    { label: 'Projects', type: 'scroll', target: 'projects', icon: FolderGit2 },
    { label: 'Terminal', type: 'scroll', target: 'terminal', icon: Terminal },
    { label: 'Contact', type: 'scroll', target: 'contact', icon: Mail },
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
          backgroundColor: 'rgb(10, 10, 10)', // Guaranteed solid background (no alpha)
          borderColor: isNavbarHovered ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)',
          boxShadow: isNavbarHovered 
            ? '0 20px 40px -15px rgba(239,68,68,0.3)' 
            : '0 4px 12px -5px rgba(0,0,0,0.3)'
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className={`backdrop-blur-xl border border-white/10 rounded-xl px-6 flex items-center gap-8 shadow-lg transition-[padding] duration-500 ${
          scrolled 
            ? 'py-2' 
            : 'py-3'
        }`}
      >

        <ul 
          className="relative flex items-center gap-2 font-orbitron text-[11px] font-bold uppercase tracking-[0.15em] text-gray-200 hidden md:flex"
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
                  scale: hoveredIndex === null ? 0.9 : (isHovered ? 1.15 : 0.8),
                  opacity: hoveredIndex === null ? 0.75 : (isHovered ? 1 : 0.45),
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 24 }}
              >
                {/* Advanced Sliding Hover Indicator Pill */}
                {isHovered && (
                  <motion.div
                    layoutId="navbar-hover-pill"
                    className="absolute inset-0 border border-orange-500/35 bg-orange-950/10 rounded-lg z-0 overflow-hidden shadow-[0_0_15px_rgba(255,80,0,0.2)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                  >
                    <FireBackground active={isHovered} />
                  </motion.div>
                )}

                {/* Sliding Cyber Dot Indicator at Bottom */}
                {isHovered && (
                  <motion.div
                    layoutId="navbar-hover-dot"
                    className="absolute bottom-[-4px] w-1.5 h-1.5 rounded-full z-20 animate-fire-dot"
                    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                  />
                )}
                
                {item.type === 'scroll' ? (
                  <motion.button
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className={`relative z-10 px-4 py-1.5 rounded-lg transition-all duration-200 bg-transparent border-0 outline-none cursor-pointer font-orbitron font-bold uppercase tracking-[0.15em] text-[11px] flex items-center justify-center ${
                      isHovered ? 'animate-fire-text' : 'text-gray-300'
                    }`}
                    onClick={() => scrollToSection(item.target!)}
                  >
                    <item.icon size={14} className={isHovered ? 'animate-pulse' : 'text-gray-400'} />
                    <motion.span
                      initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                      animate={{ 
                        width: isHovered ? 'auto' : 0, 
                        opacity: isHovered ? 1 : 0,
                        marginLeft: isHovered ? 6 : 0
                      }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden whitespace-nowrap flex items-center"
                    >
                      <ScrambleText text={item.label.toUpperCase()} active={isHovered} />
                    </motion.span>
                  </motion.button>
                ) : (
                  <div className="flex items-center justify-center z-10">
                    <Link
                      to={item.to!}
                      className={`relative block px-4 py-1.5 rounded-lg transition-all duration-200 font-orbitron font-bold uppercase tracking-[0.15em] text-[11px] flex items-center justify-center ${
                        isHovered ? 'animate-fire-text' : 'text-gray-300'
                      }`}
                    >
                      <item.icon size={14} className={isHovered ? 'animate-pulse' : 'text-gray-400'} />
                      <motion.span
                        initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                        animate={{ 
                          width: isHovered ? 'auto' : 0, 
                          opacity: isHovered ? 1 : 0,
                          marginLeft: isHovered ? 6 : 0
                        }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="overflow-hidden whitespace-nowrap flex items-center"
                      >
                        <ScrambleText text={item.label.toUpperCase()} active={isHovered} />
                      </motion.span>
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
              scale: hoveredIndex === null ? 0.9 : (hoveredIndex === navItems.length ? 1.15 : 0.8),
              opacity: hoveredIndex === null ? 0.85 : (hoveredIndex === navItems.length ? 1 : 0.5),
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            onClick={() => scrollToSection('contact')}
            className={`relative overflow-hidden px-5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 font-orbitron cursor-pointer ${
              hoveredIndex === navItems.length
                ? 'border border-orange-500/40 bg-orange-950/20 text-orange-200 shadow-[0_0_20px_rgba(255,90,0,0.35)]'
                : 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
            }`}
          >
            <FireBackground active={hoveredIndex === navItems.length} />
            <span className="relative z-10">Let's Talk →</span>
          </motion.button>
        </div>
      </motion.nav>
    </motion.header>
  );
}
